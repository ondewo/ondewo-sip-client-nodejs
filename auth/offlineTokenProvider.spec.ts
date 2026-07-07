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

// Unit tests for the D18 offline-token helper. The token endpoint is mocked via the injectable
// `fetchImpl` option -- there is NO network access.
//   node --test --experimental-strip-types auth/offlineTokenProvider.spec.ts

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

/** Shared, valid login options reused by every test case (spread + overridden per case). */
const BASE_OPTIONS: OfflineTokenLoginOptions = {
	keycloakUrl: 'https://auth.example.com/auth',
	realm: 'ondewo-ccai-platform',
	clientId: 'ondewo-sip-cai-sdk-public',
	username: 'tech-user@example.com',
	password: 'super-secret'
};

/** The token endpoint URL {@link BASE_OPTIONS} is expected to resolve to. */
const EXPECTED_TOKEN_ENDPOINT: string =
	'https://auth.example.com/auth/realms/ondewo-ccai-platform/protocol/openid-connect/token';

/** One scripted response for the fetch stub: an optional HTTP status plus the body (object or raw string). */
interface StubResponse {
	/** The HTTP status code to return; defaults to `200` when omitted. */
	status?: number;
	/** The response body; objects are JSON-stringified, strings are returned verbatim. */
	body: unknown;
}

/** A single fetch invocation captured by the stub for later assertions. */
interface RecordedCall {
	/** The URL the stub was called with. */
	url: string;
	/** The request init (method, headers, body) the stub received. */
	init: TokenFetchInit;
	/** The parsed form parameters of the request body, for convenient assertions. */
	params: URLSearchParams;
}

/** The injectable fetch plus the list it records its calls into. */
interface FetchStub {
	/** The {@link TokenFetch} implementation to inject via the `fetchImpl` option. */
	fetchImpl: TokenFetch;
	/** The recorded calls, in invocation order. */
	calls: RecordedCall[];
}

/**
 * Build a fake fetch that returns a sequence of JSON responses (one per call) and records the
 * requests it received, so assertions can inspect the form-encoded body and the URL.
 *
 * @param responses - The scripted responses to return, one per call, in order.
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
		process.nextTick(resolve);
	});
}

/**
 * Verifies the one-time ROPC login posts `grant_type=password` + `scope=offline_access` to the realm
 * token endpoint using the public client id and, per Q1, sends no `client_secret`.
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
 * Verifies the background loop fires before expiry and exchanges the offline `refresh_token` (via
 * `grant_type=refresh_token`, still secret-less) for a fresh access token that replaces the old one.
 */
runTestCase('auto-refresh exchanges the offline refresh_token for a fresh access token before expiry', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		{ body: { access_token: 'access-2', refresh_token: 'offline-2', expires_in: 31 } }
	]);

	// expires_in 31 - 30 skew = 1s scheduled delay; drive it deterministically via fake timers.
	mock.timers.enable({ apis: ['setTimeout'] });
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
 * Verifies that once the bounded `tokenExpirationInS` deadline has passed, a fired timer performs no
 * further token-endpoint call (the loop self-terminates and the access token is left to lapse).
 */
runTestCase('the refresh loop stops after tokenExpirationInS elapses (no further renewal)', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } }
	]);

	let fakeNowInMs: number = 1_000_000;
	const nowInMs: () => number = (): number => fakeNowInMs;

	mock.timers.enable({ apis: ['setTimeout'] });
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

/** Verifies a non-2xx token-endpoint response (HTTP 401) is surfaced as a {@link TokenError}. */
runTestCase('login rejects a non-2xx token response with TokenError', async () => {
	const stub: FetchStub = makeFetchStub([{ status: 401, body: { error: 'invalid_grant' } }]);
	await assert.rejects(() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl }), TokenError);
});

/**
 * Verifies that a successful token response lacking a `refresh_token` (i.e. the client was not granted
 * `offline_access`) is rejected with a {@link TokenError} rather than yielding a non-refreshable provider.
 */
runTestCase('login rejects when the token response carries no refresh_token (missing offline_access)', async () => {
	const stub: FetchStub = makeFetchStub([{ body: { access_token: 'access-1', expires_in: 300 } }]);
	await assert.rejects(() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl }), TokenError);
});

/** Verifies that an empty required option (here `clientId`) is rejected with a {@link TokenError} before any fetch. */
runTestCase('login validates required options', async () => {
	const stub: FetchStub = makeFetchStub([]);
	await assert.rejects(() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl, clientId: '' }), TokenError);
});

/**
 * Verifies that {@link OfflineTokenProvider.getAuthorizationHeader} throws a {@link TokenError} before
 * bootstrap (no token yet) while {@link OfflineTokenProvider.getAccessToken} returns `null`.
 */
runTestCase('getAuthorizationHeader throws before bootstrap when no token is available', () => {
	const stub: FetchStub = makeFetchStub([]);
	const provider: OfflineTokenProvider = new OfflineTokenProvider({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl });
	assert.throws(() => provider.getAuthorizationHeader(), TokenError);
	assert.equal(provider.getAccessToken(), null);
});

/** Verifies a 2xx response with a non-JSON body is rejected with a {@link TokenError}. */
runTestCase('login rejects a 2xx token response whose body is not valid JSON', async () => {
	const stub: FetchStub = makeFetchStub([{ body: '<<<not-json>>>' }]);
	await assert.rejects(() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl }), TokenError);
});

/** Verifies a valid-JSON response missing the `access_token` field is rejected with a {@link TokenError}. */
runTestCase('login rejects a parseable token response that carries no access_token', async () => {
	const stub: FetchStub = makeFetchStub([{ body: { refresh_token: 'offline-1', expires_in: 300 } }]);
	await assert.rejects(() => login({ ...BASE_OPTIONS, fetchImpl: stub.fetchImpl }), TokenError);
});

/** Verifies that passing `null` or `undefined` as the options object is rejected with a {@link TokenError}. */
runTestCase('login rejects a missing options object', async () => {
	await assert.rejects(() => login(null as unknown as OfflineTokenLoginOptions), TokenError);
	await assert.rejects(() => login(undefined as unknown as OfflineTokenLoginOptions), TokenError);
});

/**
 * Verifies that a failed background refresh (HTTP 500) is delivered to the registered
 * {@link OfflineTokenProvider.onRefreshError} handler and does not clobber the still-valid access token.
 */
runTestCase('a failed background refresh is surfaced to onRefreshError and keeps the stale token', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		{ status: 500, body: 'boom' }
	]);

	mock.timers.enable({ apis: ['setTimeout'] });
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
 * Verifies that a failed background refresh (HTTP 503) with no registered error handler is swallowed
 * silently: nothing throws and the stale-but-valid access token survives.
 */
runTestCase('a failed background refresh without a registered handler is swallowed silently', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		{ status: 503, body: 'down' }
	]);

	mock.timers.enable({ apis: ['setTimeout'] });
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

/**
 * Verifies refresh-token rotation handling: when a refresh response omits a new `refresh_token`, the
 * provider keeps reusing the previously held offline token on the subsequent refresh.
 */
runTestCase('a refresh response without a rotated refresh_token keeps reusing the previous one', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } },
		// First refresh succeeds but Keycloak does NOT rotate the offline token.
		{ body: { access_token: 'access-2', expires_in: 31 } },
		{ body: { access_token: 'access-3', refresh_token: 'offline-3', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout'] });
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
 * Verifies that a token response with no `expires_in` clamps the refresh delay to
 * `MIN_REFRESH_DELAY_IN_S` (1s) rather than scheduling an immediate hot loop.
 */
runTestCase('an absent/zero expires_in falls back to the minimum refresh delay', async () => {
	const stub: FetchStub = makeFetchStub([
		// No expires_in -> the scheduler must clamp to MIN_REFRESH_DELAY_IN_S (1s), not spin a hot loop.
		{ body: { access_token: 'access-1', refresh_token: 'offline-1' } },
		{ body: { access_token: 'access-2', refresh_token: 'offline-2', expires_in: 31 } }
	]);

	mock.timers.enable({ apis: ['setTimeout'] });
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
 * Verifies that `tokenExpirationInS = 0` makes the deadline equal "now" at bootstrap, so
 * `scheduleRefresh` arms no timer and no refresh ever fires.
 */
runTestCase('a non-positive tokenExpirationInS lapses the loop immediately at schedule time', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 31 } }
	]);

	let fakeNowInMs: number = 5_000_000;
	const nowInMs: () => number = (): number => fakeNowInMs;

	mock.timers.enable({ apis: ['setTimeout'] });
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
 * By default (flag omitted) the default transport uses the plain global `fetch` with NO dispatcher, so
 * TLS certificate verification stays ON.
 */
runTestCase('keycloakVerifySsl default: the default transport attaches no dispatcher (TLS verify ON)', async () => {
	let capturedInit: TokenFetchInit | undefined;
	const originalFetch: typeof globalThis.fetch = globalThis.fetch;
	// Override the global fetch so the default-transport branch is exercised without network.
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
		assert.ok(capturedInit !== undefined);
		// No undici dispatcher => undici's global dispatcher with TLS verification ON.
		assert.equal(capturedInit.dispatcher, undefined);
		assert.equal(provider.getAccessToken(), 'access-secure');
		provider.stop();
	} finally {
		globalThis.fetch = originalFetch;
	}
});

/**
 * With `keycloakVerifySsl: false` the default transport attaches an undici `Agent` dispatcher, disabling
 * TLS certificate verification for the token call.
 */
runTestCase(
	'keycloakVerifySsl false: the default transport attaches an undici Agent dispatcher (TLS verify OFF)',
	async () => {
		let capturedInit: TokenFetchInit | undefined;
		const originalFetch: typeof globalThis.fetch = globalThis.fetch;
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
			const provider: OfflineTokenProvider = await login({
				...BASE_OPTIONS,
				keycloakVerifySsl: false,
				nowInMs: (): number => 0
			});
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const undici: { Agent: new (options: unknown) => unknown } = require('undici') as {
				Agent: new (options: unknown) => unknown;
			};
			assert.ok(capturedInit !== undefined);
			// The insecure undici Agent (rejectUnauthorized:false) reached the token POST.
			assert.ok(capturedInit.dispatcher instanceof undici.Agent);
			assert.equal(provider.getAccessToken(), 'access-insecure');
			provider.stop();
		} finally {
			globalThis.fetch = originalFetch;
		}
	}
);

/**
 * An injected `fetchImpl` is used verbatim, so `keycloakVerifySsl: false` is a no-op (no dispatcher) for
 * custom transports.
 */
runTestCase('keycloakVerifySsl false is ignored when a custom fetchImpl is injected', async () => {
	const stub: FetchStub = makeFetchStub([
		{ body: { access_token: 'access-1', refresh_token: 'offline-1', expires_in: 300 } }
	]);
	const provider: OfflineTokenProvider = await login({
		...BASE_OPTIONS,
		keycloakVerifySsl: false,
		fetchImpl: stub.fetchImpl,
		nowInMs: (): number => 0
	});
	assert.equal(stub.calls.length, 1);
	// The injected transport receives the request unchanged -- the flag never touches it.
	assert.equal(stub.calls[0].init.dispatcher, undefined);
	assert.equal(provider.getAccessToken(), 'access-1');
	provider.stop();
});

/**
 * Verifies the default-fetch branch: when no `fetchImpl` is provided, the provider uses
 * `globalThis.fetch` (here overridden to avoid real network) for the token-endpoint call.
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

	mock.timers.enable({ apis: ['setTimeout'] });
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
 * Verifies that calling {@link OfflineTokenProvider.stop} while a refresh is in flight lets that refresh
 * complete (updating the token) but suppresses re-arming any further timer, so no extra fetch occurs.
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

	mock.timers.enable({ apis: ['setTimeout'] });
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
