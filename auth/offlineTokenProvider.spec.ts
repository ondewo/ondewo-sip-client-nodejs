// Copyright 2021-2026 ONDEWO GmbH
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/**
 * Unit tests for the D18 offline-token helper. The token endpoint is mocked via the injectable
 * `fetchImpl` option -- there is NO network access.
 *
 * @example
 * ```sh
 * # compiles the hand-written sources to .test-build and enforces the 100% coverage gate
 * npm test
 * ```
 */

import { test as runTestCase, mock } from 'node:test';
import assert from 'node:assert/strict';

import {
	login,
	OfflineTokenProvider,
	TokenError,
	type OfflineTokenLoginOptions,
	type TokenFetch,
	type TokenFetchInit,
	type TokenFetchResponse
} from './offlineTokenProvider';

/** Reusable, valid login options shared (via spread) by every test case. */
const BASE_OPTIONS: OfflineTokenLoginOptions = {
	keycloakUrl: 'https://auth.example.com/auth',
	realm: 'ondewo-ccai-platform',
	clientId: 'ondewo-sip-cai-sdk-public',
	username: 'tech-user@example.com',
	password: 'super-secret',
	// Date is what mock.timers advances; the provider's own default clock is the monotonic performance.now.
	nowInMs: (): number => Date.now()
};

/** The token endpoint URL {@link BASE_OPTIONS} is expected to resolve to. */
const EXPECTED_TOKEN_ENDPOINT: string =
	'https://auth.example.com/auth/realms/ondewo-ccai-platform/protocol/openid-connect/token';

/**
 * The {@link OfflineTokenLoginOptions} fields {@link login} must reject as absent/empty, in the order
 * the implementation validates them.
 */
const REQUIRED_LOGIN_OPTION_KEYS: (keyof OfflineTokenLoginOptions)[] = [
	'keycloakUrl',
	'realm',
	'clientId',
	'username',
	'password'
];

/** One scripted response in a {@link makeFetchStub} sequence. */
interface StubResponse {
	/** HTTP status to report; defaults to `200` when omitted. */
	status?: number;
	/** Response body: a string is sent verbatim, anything else is JSON-stringified. */
	body: unknown;
}

/** A single fetch invocation captured by the stub, for post-hoc assertions. */
interface RecordedCall {
	/** The URL the stub was called with. */
	url: string;
	/** The request init (method, headers, body) the stub received. */
	init: TokenFetchInit;
	/** The form-encoded request body parsed into `URLSearchParams` for convenient field assertions. */
	params: URLSearchParams;
}

/** A scripted fetch implementation paired with the list it records calls into. */
interface FetchStub {
	/** The injectable {@link TokenFetch} to pass as `fetchImpl`. */
	fetchImpl: TokenFetch;
	/** The {@link RecordedCall}s captured so far, in call order. */
	calls: RecordedCall[];
}

/**
 * Build a fake fetch that returns a sequence of JSON responses (one per call) and records the
 * requests it received, so assertions can inspect the form-encoded body and the URL.
 *
 * @param responses - The scripted responses, consumed in order (one per fetch call).
 * @returns A {@link FetchStub} exposing the injectable `fetchImpl` and its recorded `calls`.
 * @throws {Error} If the stub is called more times than there are scripted responses.
 */
function makeFetchStub(responses: StubResponse[]): FetchStub {
	const calls: RecordedCall[] = [];
	const fetchImpl: TokenFetch = (url: string, init: TokenFetchInit): Promise<TokenFetchResponse> => {
		calls.push({ url, init, params: new URLSearchParams(init.body) });
		const next: StubResponse | undefined = responses.shift();
		if (next === undefined) {
			throw new Error('fetch stub called more times than expected');
		}
		const status: number = next.status !== undefined ? next.status : 200;
		const bodyText: string = typeof next.body === 'string' ? next.body : JSON.stringify(next.body);
		return Promise.resolve({
			ok: status >= 200 && status < 300,
			status,
			text: (): Promise<string> => Promise.resolve(bodyText)
		});
	};
	return { fetchImpl, calls };
}

/**
 * Yield to the microtask queue so an awaited refresh inside a fired timer can settle.
 *
 * @returns A promise that resolves on the next tick of the event loop.
 */
function flushMicrotasks(): Promise<void> {
	return new Promise((resolve: () => void): void => {
		setImmediate(resolve);
	});
}

/** A live `setTimeout` spy: the delays it has recorded plus the function that uninstalls it. */
interface TimerDelayCapture {
	/** The delays (in milliseconds) passed to `setTimeout` while the spy was installed, in order. */
	delaysInMs: number[];
	/** Uninstall the spy and reinstate the previously installed `setTimeout`. */
	restore(): void;
}

/**
 * Install a `setTimeout` spy that records every scheduled delay and then forwards to the previously
 * installed `setTimeout`, so a test can assert the exact delay the refresh loop arms instead of only
 * observing that *some* refresh eventually fired.
 *
 * @returns A {@link TimerDelayCapture} holding the recorded delays and its `restore` function.
 */
function captureTimerDelays(): TimerDelayCapture {
	const delaysInMs: number[] = [];
	const previousSetTimeout: typeof globalThis.setTimeout = globalThis.setTimeout;
	globalThis.setTimeout = ((handler: () => void, delayInMs: number): ReturnType<typeof setTimeout> => {
		delaysInMs.push(delayInMs);
		return previousSetTimeout(handler, delayInMs);
	}) as unknown as typeof globalThis.setTimeout;
	return {
		delaysInMs,
		restore: (): void => {
			globalThis.setTimeout = previousSetTimeout;
		}
	};
}

/** A live `clearTimeout` spy: the handles it has recorded plus the function that uninstalls it. */
interface ClearedTimerCapture {
	/** The timer handles passed to `clearTimeout` while the spy was installed, in order. */
	handles: unknown[];
	/** Uninstall the spy and reinstate the previously installed `clearTimeout`. */
	restore(): void;
}

/**
 * Install a `clearTimeout` spy that records every released timer handle and then forwards to the
 * previously installed `clearTimeout`, so a test can assert `stop()` RELEASES the armed timer rather
 * than merely dropping its reference. Nulling the private field alone leaves the timer pending, which
 * no externally observable behaviour reveals: the `stopped` flag makes the fired refresh return early,
 * so the fetch-call count stays identical either way.
 *
 * @returns A {@link ClearedTimerCapture} holding the recorded handles and its `restore` function.
 */
function captureClearedTimers(): ClearedTimerCapture {
	const handles: unknown[] = [];
	const previousClearTimeout: typeof globalThis.clearTimeout = globalThis.clearTimeout;
	globalThis.clearTimeout = (handle: Parameters<typeof globalThis.clearTimeout>[0]): void => {
		handles.push(handle);
		previousClearTimeout(handle);
	};
	return {
		handles,
		restore: (): void => {
			globalThis.clearTimeout = previousClearTimeout;
		}
	};
}

/** The subset of Node's `Timeout` needed to check whether a timer keeps the event loop alive. */
interface RefCountedTimer {
	/**
	 * Report whether the timer still holds a reference on Node's event loop.
	 *
	 * @returns `true` while the timer is ref-ed, `false` once `unref()` has been called on it.
	 */
	hasRef(): boolean;
}

/**
 * White-box view of an {@link OfflineTokenProvider}'s private refresh timer, so a test can assert the
 * timer cannot keep a consumer's process alive (the symptom a missing `unref()` produces).
 */
interface ProviderTimerView {
	/** The armed refresh timer, or `null` when no refresh is currently scheduled. */
	timer: RefCountedTimer | null;
}

/**
 * Asserts the initial login posts a ROPC + `offline_access` request to the realm token endpoint
 * using the public client and exposes the resulting access token / `Authorization` header (no
 * `client_secret` on the wire — Q1).
 */
runTestCase(
	'login posts ROPC + offline_access to the realm token endpoint with the public client (no secret)',
	async () => {
		const stub: FetchStub = makeFetchStub([
			{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 } }
		]);

		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });

		assert.equal(stub.calls.length, 1);
		assert.equal(stub.calls[0].url, EXPECTED_TOKEN_ENDPOINT);
		assert.equal(stub.calls[0].init.method, 'POST');
		assert.equal(stub.calls[0].init.headers['Content-Type'], 'application/x-www-form-urlencoded');

		const params: URLSearchParams = stub.calls[0].params;
		assert.equal(params.get('grant_type'), 'password');
		assert.equal(params.get('client_id'), 'ondewo-sip-cai-sdk-public');
		assert.equal(params.get('username'), 'tech-user@example.com');
		assert.equal(params.get('password'), 'super-secret');
		assert.equal(params.get('scope'), 'offline_access');
		// Q1: PUBLIC client -- there must be NO client_secret on the wire.
		assert.equal(params.get('client_secret'), null);

		assert.equal(provider.getAccessToken(), 'access-1');
		assert.equal(provider.getAuthorizationHeader(), 'Bearer access-1');
		provider.stop();
	}
);

/**
 * Asserts the background loop exchanges the offline `refresh_token` for a fresh access token before
 * the previous one expires, swapping in the new access token / `Authorization` header.
 */
runTestCase('auto-refresh exchanges the offline refresh_token for a fresh access token before expiry', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		{ body: { access_token: 'access-2', refresh_token: 'offline-2', expires_in: 31 } }
	]);

	// expires_in 31 - 30 skew = 1s scheduled delay; drive it deterministically via fake timers.
	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });
		assert.equal(provider.getAccessToken(), 'access-1');

		mock.timers.tick(1000);
		await flushMicrotasks();

		assert.equal(stub.calls.length, 2);
		const refreshParams: URLSearchParams = stub.calls[1].params;
		assert.equal(refreshParams.get('grant_type'), 'refresh_token');
		assert.equal(refreshParams.get('refresh_token'), 'offline-1');
		assert.equal(refreshParams.get('client_id'), 'ondewo-sip-cai-sdk-public');
		assert.equal(refreshParams.get('client_secret'), null);

		assert.equal(provider.getAccessToken(), 'access-2');
		assert.equal(provider.getAuthorizationHeader(), 'Bearer access-2');
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts the bounded loop performs no further renewal once `tokenExpirationInS` has elapsed: the
 * deadline passes before the armed timer fires, so only the initial login call is observed.
 */
runTestCase('the refresh loop stops after tokenExpirationInS elapses (no further renewal)', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } }
	]);

	let fakeNowInMs: number = 1_000_000;
	const nowInMs: () => number = (): number => fakeNowInMs;

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		// Bound the loop to 2s; the first refresh is armed at ~1s but the deadline passes before it fires.
		const provider: OfflineTokenProvider = await login({
			...BASE_OPTIONS,
			fetchImpl: stub.fetchImpl,
			nowInMs,
			tokenExpirationInS: 2
		});

		// Advance the wall clock past the deadline before the timer fires.
		fakeNowInMs += 3000;
		mock.timers.tick(1000);
		await flushMicrotasks();

		// Deadline already passed -> refresh must NOT have fired; only the initial login call happened.
		assert.equal(stub.calls.length, 1);
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts a non-2xx token response rejects {@link login} with a {@link TokenError} whose message
 * reports the HTTP status, so this failure mode is distinguishable from the token-shape ones.
 */
runTestCase('login rejects a non-2xx token response with TokenError', async () => {
	const stub: FetchStub = makeFetchStub([{ status: 401, body: { error: 'invalid_grant' } }]);
	await assert.rejects(() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl }), {
		name: 'KeycloakAuthenticationError',
		message: /failed with status 401/
	});
});

/**
 * Asserts a 2xx token response without a `refresh_token` (the SDK client lacks `offline_access`)
 * rejects {@link login} with a {@link TokenError} that names the MISSING `refresh_token` -- not the
 * `access_token`, which this response does carry.
 */
runTestCase('login rejects when the token response carries no refresh_token (missing offline_access)', async () => {
	const stub: FetchStub = makeFetchStub([{ body: { access_token: 'access-1', expires_in: 300 } }]);
	await assert.rejects(() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl }), {
		name: 'KeycloakAuthenticationError',
		message: /did not contain a refresh_token/
	});
});

/**
 * Asserts {@link login} rejects with a {@link TokenError} when a required option is empty, naming the
 * offending option in the message.
 */
runTestCase('login validates required options', async () => {
	const stub: FetchStub = makeFetchStub([]);
	await assert.rejects(() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl, clientId: '' }), {
		name: 'TokenError',
		message: /option "clientId" is required/
	});
});

/**
 * Asserts {@link OfflineTokenProvider.getAuthorizationHeader} throws a {@link TokenError} reporting the
 * absent token (and {@link OfflineTokenProvider.getAccessToken} returns `null`) before bootstrap has run.
 */
runTestCase('getAuthorizationHeader throws before bootstrap when no token is available', () => {
	const stub: FetchStub = makeFetchStub([]);
	const provider: OfflineTokenProvider = new OfflineTokenProvider({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });
	assert.throws(() => provider.getAuthorizationHeader(), {
		name: 'TokenError',
		message: /No access token available/
	});
	assert.equal(provider.getAccessToken(), null);
});

/**
 * Asserts a 2xx token response with a non-JSON body rejects {@link login} with a {@link TokenError}
 * that identifies the body as unparseable (rather than as a missing field).
 */
runTestCase('login rejects a 2xx token response whose body is not valid JSON', async () => {
	const stub: FetchStub = makeFetchStub([{ body: '<<<not-json>>>' }]);
	await assert.rejects(() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl }), {
		name: 'KeycloakAuthenticationError',
		message: /with a body that is not JSON/
	});
});

/**
 * Asserts a parseable 2xx token response without an `access_token` rejects {@link login} with a
 * {@link TokenError} that names the missing `access_token`.
 */
runTestCase('login rejects a parseable token response that carries no access_token', async () => {
	const stub: FetchStub = makeFetchStub([{ body: { refresh_token: 'offline-1', expires_in: 300 } }]);
	await assert.rejects(() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl }), {
		name: 'KeycloakAuthenticationError',
		message: /did not contain an access_token/
	});
});

/**
 * Asserts a 2xx token response whose `access_token` is present but EMPTY is rejected exactly like an
 * absent one: a blank bearer token would otherwise be handed to gRPC and fail as UNAUTHENTICATED.
 */
runTestCase('login rejects a token response whose access_token is an empty string', async () => {
	const stub: FetchStub = makeFetchStub([{ body: { access_token: '', refresh_token: 'offline-1', expires_in: 300 } }]);
	await assert.rejects(() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl }), {
		name: 'KeycloakAuthenticationError',
		message: /did not contain an access_token/
	});
});

/**
 * Asserts {@link login} rejects with a {@link TokenError} naming the missing options object for both a
 * `null` and an `undefined` argument.
 */
runTestCase('login rejects a missing options object', async () => {
	await assert.rejects(() => login(null as unknown as OfflineTokenLoginOptions), {
		name: 'TokenError',
		message: /requires an options object/
	});
	await assert.rejects(() => login(undefined as unknown as OfflineTokenLoginOptions), {
		name: 'TokenError',
		message: /requires an options object/
	});
});

/**
 * Asserts a failed background refresh is reported to the {@link OfflineTokenProvider.onRefreshError}
 * handler (as a {@link TokenError}) while the still-valid stale access token is preserved.
 */
runTestCase('a failed background refresh is surfaced to onRefreshError and keeps the stale token', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		{ status: 500, body: 'boom' }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });
		let captured: unknown = null;
		provider.onRefreshError((error: unknown): void => {
			captured = error;
		});

		mock.timers.tick(1000);
		await flushMicrotasks();
		await flushMicrotasks();

		assert.ok(captured instanceof TokenError);
		assert.match(captured.message, /500/);
		// The transient failure must NOT clobber the still-valid access token.
		assert.equal(provider.getAccessToken(), 'access-1');
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts that, with no {@link OfflineTokenProvider.onRefreshError} handler registered, a failed
 * background refresh is swallowed silently and the stale access token survives.
 */
runTestCase('a failed background refresh re-arms the timer and recovers on the next tick', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		{ status: 503, body: 'down' },
		{ body: { access_token: 'access-2', refresh_token: 'offline-2', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		// randomFraction 0 puts the retry at the base of its window, so the delay is exact.
		const provider: OfflineTokenProvider = await login({
			...BASE_OPTIONS,
			fetchImpl: stub.fetchImpl,
			randomFraction: (): number => 0
		});

		mock.timers.tick(1000);
		await flushMicrotasks();
		await flushMicrotasks();

		// No handler -> the rejection is swallowed; the stale token survives and nothing throws.
		assert.equal(provider.getAccessToken(), 'access-1');

		// ...and the loop RE-ARMS. refresh() reschedules on its last line, after the await that
		// threw, so the catch is the only thing that can keep proactive renewal alive; without the
		// re-arm one transient 5xx ended it for the life of the provider and every later token came
		// from the UNAUTHENTICATED fallback. The re-arm waits the failure-backoff base (5 s): 7.1.1
		// used MIN_REFRESH_DELAY_IN_S here, polling the endpoint once a second for a whole outage.
		mock.timers.tick(4999);
		await flushMicrotasks();
		assert.equal(stub.calls.length, 2, 'the retry fired before the backoff base elapsed');

		mock.timers.tick(1);
		await flushMicrotasks();
		await flushMicrotasks();
		assert.equal(stub.calls.length, 3, 'the refresh loop did not re-arm after a failure');
		assert.equal(provider.getAccessToken(), 'access-2');
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts the provider keeps reusing the previous offline `refresh_token` across refreshes when
 * Keycloak does not rotate it (i.e. a refresh response carries no new `refresh_token`).
 */
runTestCase('a refresh response without a rotated refresh_token keeps reusing the previous one', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		// First refresh succeeds but Keycloak does NOT rotate the offline token.
		{ body: { access_token: 'access-2', expires_in: 31 } },
		{ body: { access_token: 'access-3', refresh_token: 'offline-3', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });

		mock.timers.tick(1000);
		await flushMicrotasks();
		assert.equal(provider.getAccessToken(), 'access-2');

		mock.timers.tick(1000);
		await flushMicrotasks();
		// The second refresh must still send the original offline-1 token (it was never rotated).
		assert.equal(stub.calls[2].params.get('refresh_token'), 'offline-1');
		assert.equal(provider.getAccessToken(), 'access-3');
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts a missing or zero `expires_in` clamps the scheduled delay to `MIN_REFRESH_DELAY_IN_S`
 * (1s) rather than spinning a hot loop, and the refresh fires at exactly that minimum.
 */
runTestCase('an absent/zero expires_in falls back to the minimum refresh delay', async () => {
	const stub: FetchStub = makeFetchStub([
		// No expires_in -> the scheduler must clamp to MIN_REFRESH_DELAY_IN_S (1s), not spin a hot loop.
		{ body: { access_token: 'access-1', refresh_token: 'offline-1' } },
		{ body: { access_token: 'access-2', refresh_token: 'offline-2', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });
		assert.equal(provider.getAccessToken(), 'access-1');

		// The refresh must fire exactly at the 1s minimum delay.
		mock.timers.tick(1000);
		await flushMicrotasks();

		assert.equal(stub.calls.length, 2);
		assert.equal(provider.getAccessToken(), 'access-2');
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts a non-positive `tokenExpirationInS` (here `0`) makes the deadline coincide with bootstrap,
 * so `scheduleRefresh` sees no remaining time, arms no timer, and never refreshes.
 */
runTestCase('a non-positive tokenExpirationInS lapses the loop immediately at schedule time', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } }
	]);

	let fakeNowInMs: number = 5_000_000;
	const nowInMs: () => number = (): number => fakeNowInMs;

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		// tokenExpirationInS=0 -> deadline == now at bootstrap -> scheduleRefresh sees remaining <= 0 and stops.
		const provider: OfflineTokenProvider = await login({
			...BASE_OPTIONS,
			fetchImpl: stub.fetchImpl,
			nowInMs,
			tokenExpirationInS: 0
		});
		assert.equal(provider.getAccessToken(), 'access-1');

		// No timer was armed; advancing the clock must not trigger a refresh.
		fakeNowInMs += 100_000;
		mock.timers.tick(100_000);
		await flushMicrotasks();

		assert.equal(stub.calls.length, 1);
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts {@link login} uses `globalThis.fetch` when no `fetchImpl` is injected, exercising the
 * default-branch by temporarily overriding the global fetch (no network access).
 */
runTestCase('login falls back to the global fetch when no fetchImpl is provided', async () => {
	const calls: string[] = [];
	const originalFetch: typeof globalThis.fetch = globalThis.fetch;
	// Override the global fetch so the default-branch (`globalThis.fetch`) is exercised without network.
	globalThis.fetch = ((url: string): Promise<TokenFetchResponse> => {
		calls.push(url);
		return Promise.resolve({
			ok: true,
			status: 200,
			text: (): Promise<string> =>
				Promise.resolve(JSON.stringify({ access_token: 'global-1', refresh_token: 'offline-1', expires_in: 31 }))
		});
	}) as unknown as typeof globalThis.fetch;

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS });
		assert.equal(calls.length, 1);
		assert.equal(calls[0], EXPECTED_TOKEN_ENDPOINT);
		assert.equal(provider.getAccessToken(), 'global-1');
		provider.stop();
	} finally {
		globalThis.fetch = originalFetch;
		mock.timers.reset();
	}
});

/**
 * Asserts that by default (flag omitted) the default transport uses the plain global `fetch` with NO
 * dispatcher, so TLS verification stays ON (the secure, unchanged behaviour).
 */
runTestCase('keycloakVerifySsl default: the default transport attaches no dispatcher (TLS verify ON)', async () => {
	const originalFetch: typeof globalThis.fetch = globalThis.fetch;
	let capturedInit: TokenFetchInit | undefined;
	globalThis.fetch = ((_url: string, init: TokenFetchInit): Promise<TokenFetchResponse> => {
		capturedInit = init;
		return Promise.resolve({
			ok: true,
			status: 200,
			text: (): Promise<string> =>
				Promise.resolve(
					JSON.stringify({ access_token: 'access-secure', refresh_token: 'offline-secure', expires_in: 300 })
				)
		});
	}) as unknown as typeof globalThis.fetch;
	try {
		// Omit fetchImpl (-> default transport) and keycloakVerifySsl (-> defaults to verify ON).
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS });
		try {
			assert.ok(capturedInit !== undefined);
			// No undici dispatcher => undici's global dispatcher with TLS verification ON.
			assert.equal(capturedInit.dispatcher, undefined);
			assert.equal(provider.getAccessToken(), 'access-secure');
		} finally {
			provider.stop();
		}
	} finally {
		globalThis.fetch = originalFetch;
	}
});

/**
 * Asserts that with `keycloakVerifySsl: false` the default transport attaches an undici `Agent`
 * dispatcher, disabling TLS verification for the token call.
 */
runTestCase(
	'keycloakVerifySsl false: the default transport attaches an undici Agent dispatcher (TLS verify OFF)',
	async () => {
		const originalFetch: typeof globalThis.fetch = globalThis.fetch;
		let capturedInit: TokenFetchInit | undefined;
		globalThis.fetch = ((_url: string, init: TokenFetchInit): Promise<TokenFetchResponse> => {
			capturedInit = init;
			return Promise.resolve({
				ok: true,
				status: 200,
				text: (): Promise<string> =>
					Promise.resolve(
						JSON.stringify({ access_token: 'access-insecure', refresh_token: 'offline-insecure', expires_in: 300 })
					)
			});
		}) as unknown as typeof globalThis.fetch;
		try {
			const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, keycloakVerifySsl: false });
			try {
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				const undici: { Agent: new (options: unknown) => unknown } = require('undici') as {
					Agent: new (options: unknown) => unknown;
				};
				assert.ok(capturedInit !== undefined);
				// The insecure undici Agent (rejectUnauthorized:false) reached the token POST.
				assert.ok(capturedInit.dispatcher instanceof undici.Agent);
				assert.equal(provider.getAccessToken(), 'access-insecure');
			} finally {
				provider.stop();
			}
		} finally {
			globalThis.fetch = originalFetch;
		}
	}
);

/**
 * Asserts an injected `fetchImpl` is used verbatim, so `keycloakVerifySsl: false` is a no-op (no
 * dispatcher) for custom transports.
 */
runTestCase('keycloakVerifySsl false is ignored when a custom fetchImpl is injected', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 } }
	]);
	const provider: OfflineTokenProvider = await login({
		...BASE_OPTIONS,
		keycloakVerifySsl: false,
		fetchImpl: stub.fetchImpl
	});
	try {
		assert.equal(stub.calls.length, 1);
		// The injected transport receives the request unchanged — the flag never touches it.
		assert.equal(stub.calls[0].init.dispatcher, undefined);
		assert.equal(provider.getAccessToken(), 'access-1');
	} finally {
		provider.stop();
	}
});

/**
 * Asserts that calling {@link OfflineTokenProvider.stop} while a refresh is in flight still applies
 * that refresh's token but suppresses re-arming any further refresh (`scheduleRefresh` sees
 * `stopped`), so no additional fetch occurs even after advancing the clock.
 */
runTestCase('stop() during an in-flight refresh suppresses re-arming the next refresh', async () => {
	const calls: URLSearchParams[] = [];
	// Captures the refresh resolver so the test can complete the in-flight refresh on demand.
	let releaseRefresh: () => void = (): void => {};
	const fetchImpl: TokenFetch = (_url: string, init: TokenFetchInit): Promise<TokenFetchResponse> => {
		calls.push(new URLSearchParams(init.body));
		if (calls.length === 1) {
			return Promise.resolve({
				ok: true,
				status: 200,
				text: (): Promise<string> =>
					Promise.resolve(JSON.stringify({ access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 }))
			});
		}
		// Hold the refresh response open until the test releases it, after calling stop().
		return new Promise((resolve: (value: TokenFetchResponse) => void): void => {
			releaseRefresh = (): void => {
				resolve({
					ok: true,
					status: 200,
					text: (): Promise<string> =>
						Promise.resolve(JSON.stringify({ access_token: 'access-2', refresh_token: 'offline-2', expires_in: 31 }))
				});
			};
		});
	};

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl });

		// Fire the timer so refresh() starts and is parked awaiting the (pending) refresh response.
		mock.timers.tick(1000);
		await flushMicrotasks();
		assert.equal(calls.length, 2);

		// Stop while the refresh is in flight, then let it complete.
		provider.stop();
		releaseRefresh();
		await flushMicrotasks();
		await flushMicrotasks();

		// The completed refresh still updated the token, but scheduleRefresh saw `stopped` and armed nothing.
		assert.equal(provider.getAccessToken(), 'access-2');
		mock.timers.tick(100_000);
		await flushMicrotasks();
		assert.equal(calls.length, 2);
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts trailing slashes on `keycloakUrl` collapse to exactly one separator before `/realms`, so a
 * `KEYCLOAK_URL` copied with a trailing slash cannot POST to a `//realms/...` path.
 */
runTestCase('a keycloakUrl with trailing slashes yields exactly one slash before /realms', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 } }
	]);

	const provider: OfflineTokenProvider = await login({
		...BASE_OPTIONS,
		keycloakUrl: 'https://auth.example.com/auth///',
		fetchImpl: stub.fetchImpl
	});
	try {
		// Only the trailing slashes are stripped -- the `/auth` base path is preserved verbatim.
		assert.equal(stub.calls[0].url, EXPECTED_TOKEN_ENDPOINT);
	} finally {
		provider.stop();
	}
});

/**
 * Asserts a realm whose name carries characters that are unsafe in a URL path is percent-encoded into
 * the token endpoint instead of being injected raw.
 */
runTestCase('a realm needing percent-encoding is URL-encoded into the token endpoint path', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 } }
	]);

	const provider: OfflineTokenProvider = await login({
		...BASE_OPTIONS,
		realm: 'ondewo ccai/platform',
		fetchImpl: stub.fetchImpl
	});
	try {
		assert.equal(
			stub.calls[0].url,
			'https://auth.example.com/auth/realms/ondewo%20ccai%2Fplatform/protocol/openid-connect/token'
		);
	} finally {
		provider.stop();
	}
});

/**
 * Asserts the armed refresh delay is the token lifetime minus the 30s skew head-room -- i.e. a 300s
 * token refreshes after 270s, not after its full lifetime and not on the 1s minimum.
 */
runTestCase('the armed refresh delay is the token lifetime minus the 30s skew', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 } }
	]);

	const capture: TimerDelayCapture = captureTimerDelays();
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });
		try {
			// 300s lifetime - 30s skew = one timer armed at 270s.
			assert.deepEqual(capture.delaysInMs, [270_000]);
		} finally {
			provider.stop();
		}
	} finally {
		capture.restore();
	}
});

/**
 * Asserts a token whose lifetime is at or below the 30s skew floors the armed delay at the 1s minimum
 * (a zero/negative delay would hammer the token endpoint in a hot loop).
 */
runTestCase('a token lifetime at or below the skew floors the armed refresh delay at the 1s minimum', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 30 } }
	]);

	const capture: TimerDelayCapture = captureTimerDelays();
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });
		try {
			// 30s lifetime - 30s skew = 0s -> clamped up to the 1s minimum, never to 0.
			assert.deepEqual(capture.delaysInMs, [1_000]);
		} finally {
			provider.stop();
		}
	} finally {
		capture.restore();
	}
});

/**
 * Asserts the armed delay is clamped to the time remaining before the `tokenExpirationInS` deadline,
 * so a long-lived token cannot schedule a refresh beyond the end of the bounded loop.
 */
runTestCase('the armed refresh delay is clamped to the time remaining before the bounded deadline', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 } }
	]);

	const frozenNowInMs: number = 7_000_000;
	const nowInMs: () => number = (): number => frozenNowInMs;

	const capture: TimerDelayCapture = captureTimerDelays();
	try {
		const provider: OfflineTokenProvider = await login({
			...BASE_OPTIONS,
			fetchImpl: stub.fetchImpl,
			nowInMs,
			tokenExpirationInS: 100
		});
		try {
			// The token would allow 270s, but the bounded loop only has 100s left -> clamped to 100s.
			assert.deepEqual(capture.delaysInMs, [100_000]);
		} finally {
			provider.stop();
		}
	} finally {
		capture.restore();
	}
});

/**
 * Asserts the delay a REFRESH re-arms is derived from the lifetime of the REFRESHED token (minus the
 * 30s skew), not from the lifetime bootstrap saw: Keycloak may hand out a shorter-lived access token on
 * a refresh, and re-using the bootstrap delay would then schedule the next renewal after expiry.
 */
runTestCase('a refresh re-arms the next delay from the refreshed lifetime, not the bootstrap one', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 } },
		// A DELIBERATELY different lifetime on the refresh -- the re-armed delay must follow this one.
		{ body: { access_token: 'access-2', refresh_token: 'offline-2', expires_in: 120 } }
	]);

	// Enable the fake clock FIRST, so the delay spy wraps (and forwards to) the mocked setTimeout.
	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	const capture: TimerDelayCapture = captureTimerDelays();
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });
		try {
			// 300s lifetime - 30s skew = the single delay BOOTSTRAP armed.
			assert.deepEqual(capture.delaysInMs, [270_000]);

			mock.timers.tick(270_000);
			await flushMicrotasks();

			assert.equal(stub.calls.length, 2);
			assert.equal(provider.getAccessToken(), 'access-2');
			// 120s refreshed lifetime - 30s skew = 90s: the RE-ARMED delay, not another 270s.
			assert.deepEqual(capture.delaysInMs, [270_000, 90_000]);
		} finally {
			provider.stop();
		}
	} finally {
		capture.restore();
		mock.timers.reset();
	}
});

/** Asserts the armed refresh timer is unref-ed, so it can never keep a consumer's process alive. */
runTestCase('the armed refresh timer is unref-ed and cannot hold the event loop open', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 } }
	]);

	const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });
	try {
		const armedTimer: RefCountedTimer | null = (provider as unknown as ProviderTimerView).timer;
		assert.ok(armedTimer !== null, 'bootstrap must arm a refresh timer');
		assert.equal(armedTimer.hasRef(), false);
	} finally {
		provider.stop();
	}
});

/**
 * Asserts a rotated offline `refresh_token` is adopted: the refresh that follows sends the NEW token,
 * not the one login obtained (Keycloak invalidates the superseded token, so reusing it kills the
 * session).
 */
runTestCase('a rotated refresh_token is the one the next refresh sends', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		// Keycloak rotates the offline token on the first refresh.
		{ body: { access_token: 'access-2', refresh_token: 'offline-2', expires_in: 31 } },
		{ body: { access_token: 'access-3', refresh_token: 'offline-3', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });

		mock.timers.tick(1000);
		await flushMicrotasks();
		mock.timers.tick(1000);
		await flushMicrotasks();

		assert.equal(stub.calls.length, 3);
		assert.equal(stub.calls[1].params.get('refresh_token'), 'offline-1');
		// The rotated token -- NOT offline-1 -- must be presented on the following refresh.
		assert.equal(stub.calls[2].params.get('refresh_token'), 'offline-2');
		assert.equal(provider.getAccessToken(), 'access-3');
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts an empty-string `refresh_token` in a refresh response does NOT clobber the stored offline
 * token: the next refresh still presents the last usable one.
 */
runTestCase('an empty rotated refresh_token does not clobber the stored offline token', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		// A refresh that succeeds but carries a blank rotated token must be ignored for rotation.
		{ body: { access_token: 'access-2', refresh_token: '', expires_in: 31 } },
		{ body: { access_token: 'access-3', refresh_token: 'offline-3', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });

		mock.timers.tick(1000);
		await flushMicrotasks();
		assert.equal(provider.getAccessToken(), 'access-2');

		mock.timers.tick(1000);
		await flushMicrotasks();
		assert.equal(stub.calls[2].params.get('refresh_token'), 'offline-1');
		assert.equal(provider.getAccessToken(), 'access-3');
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts {@link OfflineTokenProvider.stop} is safe (and idempotent) on a provider that never
 * bootstrapped: it arms nothing, touches no token endpoint, and leaves the token unset.
 */
runTestCase('stop() before bootstrap is a safe, idempotent no-op', () => {
	const stub: FetchStub = makeFetchStub([]);
	const provider: OfflineTokenProvider = new OfflineTokenProvider({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });

	assert.doesNotThrow((): void => {
		provider.stop();
		provider.stop();
	});
	assert.equal(provider.getAccessToken(), null);
	assert.equal(stub.calls.length, 0);
});

/**
 * Asserts {@link OfflineTokenProvider.stop} only halts the loop: repeated calls are harmless, no
 * further refresh is ever issued, and the last token stays readable so the caller can keep using it
 * until the server answers UNAUTHENTICATED and it re-logs in.
 */
runTestCase('after stop() the last access token is still served and no further refresh is issued', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });

		provider.stop();
		// Idempotent: a second (and third) stop() must neither throw nor re-arm anything.
		provider.stop();
		provider.stop();

		mock.timers.tick(100_000);
		await flushMicrotasks();

		// Only the initial login call -- the armed timer was cleared and nothing re-armed it.
		assert.equal(stub.calls.length, 1);
		assert.equal(
			(provider as unknown as ProviderTimerView).timer,
			null,
			'stop() must release the armed timer, not just ignore it'
		);
		assert.equal(provider.getAccessToken(), 'access-1');
		assert.equal(provider.getAuthorizationHeader(), 'Bearer access-1');
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts {@link OfflineTokenProvider.stop} hands the armed timer to `clearTimeout` instead of merely
 * nulling the field that holds it. The source relies on this invariant: the early `if (this.stopped)`
 * return in `refresh()` is annotated as unreachable precisely BECAUSE stop() clears the only timer
 * that can call it, and a pending timer that still fires would falsify that claim.
 */
runTestCase('stop() releases the armed timer through clearTimeout, not just its reference', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	// Installed AFTER the timer mock so the spy wraps whichever clearTimeout is currently in place.
	const cleared: ClearedTimerCapture = captureClearedTimers();
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });
		const armedTimer: RefCountedTimer | null = (provider as unknown as ProviderTimerView).timer;
		assert.notEqual(armedTimer, null, 'bootstrap must arm a refresh timer');
		assert.equal(cleared.handles.length, 0, 'nothing may be cleared before stop() is called');

		provider.stop();

		assert.equal(cleared.handles.length, 1, 'stop() must pass the armed timer to clearTimeout');
		assert.equal(cleared.handles[0], armedTimer, 'stop() must release the very timer it armed');

		// Idempotent: with no timer left there is nothing further to release.
		provider.stop();
		assert.equal(cleared.handles.length, 1, 'a second stop() must not clear anything again');
	} finally {
		cleared.restore();
		mock.timers.reset();
	}
});

/**
 * Asserts a second {@link OfflineTokenProvider.onRefreshError} registration REPLACES the first: only
 * the most recently registered handler is invoked for a failed background refresh.
 */
runTestCase('onRefreshError replaces a previously registered handler (the later registration wins)', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		{ status: 500, body: 'boom' }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });
		let replacedHandlerCalls: number = 0;
		let capturedByLatestHandler: unknown = null;
		provider.onRefreshError((): void => {
			replacedHandlerCalls += 1;
		});
		provider.onRefreshError((error: unknown): void => {
			capturedByLatestHandler = error;
		});

		mock.timers.tick(1000);
		await flushMicrotasks();
		await flushMicrotasks();

		assert.equal(replacedHandlerCalls, 0, 'the replaced handler must never be invoked');
		assert.ok(capturedByLatestHandler instanceof TokenError);
		// The documented `name` contract is what a caller branches on across module instances; the
		// typed error still IS a TokenError (subclass), so `instanceof TokenError` keeps working.
		assert.equal(capturedByLatestHandler.name, 'KeycloakAuthenticationError');
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts the `Authorization` value is exactly `"Bearer "` plus the access token, inserted verbatim
 * (no URL-encoding, no trimming, no extra whitespace), and that it follows the token across a refresh.
 */
runTestCase('getAuthorizationHeader inserts the access token verbatim and follows it across a refresh', async () => {
	const firstToken: string = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0ZWNoLXVzZXIifQ.first+sig/one==';
	const refreshedToken: string = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0ZWNoLXVzZXIifQ.second+sig/two==';
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: firstToken, refresh_token: 'offline-1', expires_in: 31 } },
		{ body: { access_token: refreshedToken, refresh_token: 'offline-1', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });

		// A JWT's `+`, `/` and `=` must survive untouched -- any encoding would break the gRPC header.
		assert.equal(provider.getAuthorizationHeader(), `Bearer ${firstToken}`);
		assert.equal(provider.getAuthorizationHeader().length, 'Bearer '.length + firstToken.length);

		mock.timers.tick(1000);
		await flushMicrotasks();

		assert.equal(provider.getAccessToken(), refreshedToken);
		assert.equal(provider.getAuthorizationHeader(), `Bearer ${refreshedToken}`);
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Asserts EVERY required login option is validated (not just one) and that the rejection message
 * names the offending option, so a misconfigured deployment fails fast and legibly before any network
 * call.
 */
runTestCase('login rejects each required option when it is empty, naming it in the message', async () => {
	for (const key of REQUIRED_LOGIN_OPTION_KEYS) {
		const stub: FetchStub = makeFetchStub([]);
		await assert.rejects(
			() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl, [key]: '' }),
			{ name: 'TokenError', message: new RegExp(`"${key}"`) },
			`login() must reject an empty "${key}" option`
		);
		assert.equal(stub.calls.length, 0, `login() must not call the token endpoint for an empty "${key}"`);
	}
});

// ---------------------------------------------------------------------------------------------
// The RETRY CADENCE of the failure path, which 7.1.2 added on top of 7.1.1's re-arm.
//
// 7.1.1 re-armed via scheduleRefresh(undefined), falling back to MIN_REFRESH_DELAY_IN_S -- a 1 s
// retry, i.e. one token request per second for the whole of an outage, in lockstep across every
// client that failed at the same moment. ondewo runs one client per call container, so that is an
// amplifier against a realm they all share rather than a bounded floor.
// ---------------------------------------------------------------------------------------------

runTestCase('consecutive failures back off exponentially and stop growing at the ceiling', async (): Promise<void> => {
	const responses: StubResponse[] = [{ body: { access_token: 'a', refresh_token: 'r', expires_in: 31 } }];
	for (let index: number = 0; index < 9; index += 1) {
		responses.push({ status: 503, body: 'down' });
	}
	const stub: FetchStub = makeFetchStub(responses);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		// randomFraction 1 puts every retry at the TOP of its window, i.e. exactly the ceiling for
		// that failure count -- which is what makes the ladder observable.
		const provider: OfflineTokenProvider = await login({
			...BASE_OPTIONS,
			fetchImpl: stub.fetchImpl,
			randomFraction: (): number => 1
		});

		mock.timers.tick(1000);
		await flushMicrotasks();
		await flushMicrotasks();
		assert.equal(stub.calls.length, 2);

		const expectedDelaysInS: number[] = [5, 10, 20, 40, 80, 160, 300, 300];
		let attempt: number = 2;
		for (const delayInS of expectedDelaysInS) {
			mock.timers.tick(delayInS * 1000 - 1);
			await flushMicrotasks();
			assert.equal(stub.calls.length, attempt, `a retry fired early at the ${delayInS}s step`);

			mock.timers.tick(1);
			await flushMicrotasks();
			await flushMicrotasks();
			attempt += 1;
			assert.equal(stub.calls.length, attempt, `no retry fired at the ${delayInS}s step`);
		}
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

runTestCase(
	'the retry delay is drawn from the jitter window rather than pinned to its edge',
	async (): Promise<void> => {
		const stub: FetchStub = makeFetchStub([
			{ body: { access_token: 'a', refresh_token: 'r', expires_in: 31 } },
			{ status: 503, body: 'down' },
			{ status: 503, body: 'down' },
			{ body: { access_token: 'b', refresh_token: 'r2', expires_in: 31 } }
		]);

		mock.timers.enable({ apis: ['setTimeout', 'Date'] });
		try {
			const provider: OfflineTokenProvider = await login({
				...BASE_OPTIONS,
				fetchImpl: stub.fetchImpl,
				randomFraction: (): number => 0.5
			});

			mock.timers.tick(1000);
			await flushMicrotasks();
			await flushMicrotasks();
			assert.equal(stub.calls.length, 2);

			// Failure 1: window [5, 5] -> 5 s regardless of the fraction.
			mock.timers.tick(5000);
			await flushMicrotasks();
			await flushMicrotasks();
			assert.equal(stub.calls.length, 3);

			// Failure 2: window [5, 10], fraction 0.5 -> 7.5 s. Neither edge of the window.
			mock.timers.tick(7499);
			await flushMicrotasks();
			assert.equal(stub.calls.length, 3, 'the jittered retry fired before its drawn delay');
			mock.timers.tick(1);
			await flushMicrotasks();
			await flushMicrotasks();
			assert.equal(stub.calls.length, 4, 'the jittered retry did not fire at its drawn delay');
			provider.stop();
		} finally {
			mock.timers.reset();
		}
	}
);

runTestCase('a successful refresh resets the backoff ladder', async (): Promise<void> => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'a', refresh_token: 'r', expires_in: 31 } },
		{ status: 503, body: 'down' },
		{ status: 503, body: 'down' },
		{ body: { access_token: 'b', refresh_token: 'r2', expires_in: 31 } },
		{ status: 503, body: 'down' },
		{ body: { access_token: 'c', refresh_token: 'r3', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({
			...BASE_OPTIONS,
			fetchImpl: stub.fetchImpl,
			randomFraction: (): number => 1
		});

		mock.timers.tick(1000);
		await flushMicrotasks();
		await flushMicrotasks();
		mock.timers.tick(5000); // failure 1 -> 5 s
		await flushMicrotasks();
		await flushMicrotasks();
		mock.timers.tick(10000); // failure 2 -> 10 s, and this attempt SUCCEEDS
		await flushMicrotasks();
		await flushMicrotasks();
		assert.equal(stub.calls.length, 4);
		assert.equal(provider.getAccessToken(), 'b');

		// Back on the success schedule: expires_in 31 - skew 30 = 1 s.
		mock.timers.tick(1000);
		await flushMicrotasks();
		await flushMicrotasks();
		assert.equal(stub.calls.length, 5, 'the success path should re-arm on the token lifetime');

		// That attempt failed again -- and because the ladder was reset it must wait 5 s, not 20 s.
		mock.timers.tick(4999);
		await flushMicrotasks();
		assert.equal(stub.calls.length, 5);
		mock.timers.tick(1);
		await flushMicrotasks();
		await flushMicrotasks();
		assert.equal(stub.calls.length, 6, 'a success must reset the backoff to its base');
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

runTestCase('a throwing onRefreshError handler still leaves the loop armed', async (): Promise<void> => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'a', refresh_token: 'r', expires_in: 31 } },
		{ status: 503, body: 'down' },
		{ body: { access_token: 'b', refresh_token: 'r2', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({
			...BASE_OPTIONS,
			fetchImpl: stub.fetchImpl,
			randomFraction: (): number => 0
		});
		provider.onRefreshError((): void => {
			throw new Error('a diagnostics handler that misbehaves');
		});

		mock.timers.tick(1000);
		await flushMicrotasks();
		await flushMicrotasks();
		assert.equal(stub.calls.length, 2);

		// The handler's own error is contained and the re-arm runs unconditionally, so a throwing
		// handler neither ends the loop nor escapes as a process-fatal unhandledRejection.
		mock.timers.tick(5000);
		await flushMicrotasks();
		await flushMicrotasks();
		assert.equal(stub.calls.length, 3, 'a throwing error handler must not kill the refresh loop');
		assert.equal(provider.getAccessToken(), 'b');
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});

/**
 * Verifies that a failed background refresh (HTTP 503) with no registered error handler is swallowed
 * silently: nothing throws and the stale-but-valid access token survives.
 */
runTestCase('a failed background refresh without a registered handler is swallowed silently', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		{ status: 503, body: 'down' }
	]);

	mock.timers.enable({ apis: ['setTimeout', 'Date'] });
	try {
		const provider: OfflineTokenProvider = await login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });

		mock.timers.tick(1000);
		await flushMicrotasks();
		await flushMicrotasks();

		// No handler -> the rejection is swallowed; the stale token survives and nothing throws.
		assert.equal(provider.getAccessToken(), 'access-1');
		provider.stop();
	} finally {
		mock.timers.reset();
	}
});
