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

// Unit tests for the `getSipStatus` example logic. The gRPC client is a hand-written fake -- there is
// NO network access and no live SIP server. The real generated protobuf messages are used so the test
// exercises the same request/response types the example does at run time.
//   node --test .test-build/examples/sipGetStatusExample.spec.js

import { test as runTestCase } from 'node:test';
import assert from 'node:assert/strict';

import { Metadata, MetadataValue, ServiceError } from '@grpc/grpc-js';

import type { Empty } from '../api/google/protobuf/empty_pb';
import type { SipStatus } from '../api/ondewo/sip/sip_pb';
import { getSipStatus, type SipStatusReader } from './sipGetStatusExample';

/** The lowercase gRPC metadata key the example must attach the bearer token under. */
const AUTHORIZATION_KEY: string = 'authorization';
/** The bearer header value fed to `getSipStatus` and expected on the wire. */
const BEARER_HEADER: string = 'Bearer test-access-token';
/** The account name the fake backend reports back. */
const EXPECTED_ACCOUNT: string = 'sip-account-1';
/** The status description the fake backend reports back. */
const EXPECTED_DESCRIPTION: string = 'ready to accept calls';
/** The status-type enum value the fake backend reports back (SipStatus.StatusType.READY). */
const EXPECTED_STATUS_TYPE: number = 2;

/** Constructor view of the generated google.protobuf `Empty` message. */
interface EmptyConstructor {
	new (): Empty;
}

/** Constructor view of the generated `SipStatus` message. */
interface SipStatusConstructor {
	new (): SipStatus;
}

/** The subset of the generated `empty_pb` module the test instantiates. */
interface EmptyModule {
	Empty: EmptyConstructor;
}

/** The subset of the generated `sip_pb` module the test instantiates. */
interface SipPbModule {
	SipStatus: SipStatusConstructor;
}

// The generated stubs are plain JS with no typings, so pull them in via `require` and cast to the
// minimal constructor views above. The compiled spec lives at `.test-build/examples/*.js`, from where
// `../../api` resolves to the committed generated stubs at the repo root.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const emptyModule: EmptyModule = require('../../api/google/protobuf/empty_pb') as EmptyModule;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sipPbModule: SipPbModule = require('../../api/ondewo/sip/sip_pb') as SipPbModule;

/** A single captured invocation of the fake client's `sipGetSipStatus`. */
interface RecordedCall {
	/** The request message the example sent. */
	request: Empty;
	/** The metadata (carrying the bearer header) the example sent. */
	metadata: Metadata;
}

/** A fake {@link SipStatusReader} plus the list of calls it recorded. */
interface SipClientStub {
	/** The injectable fake client. */
	client: SipStatusReader;
	/** The recorded calls, in invocation order. */
	calls: RecordedCall[];
}

/**
 * Build a fake client whose `sipGetSipStatus` records the call and immediately succeeds with `response`.
 *
 * @param response - The status to hand back through the success path of the callback.
 * @returns A {@link SipClientStub} exposing the injectable `client` and its recorded `calls`.
 */
function makeSuccessClient(response: SipStatus): SipClientStub {
	const calls: RecordedCall[] = [];
	const client: SipStatusReader = {
		sipGetSipStatus(
			request: Empty,
			metadata: Metadata,
			onResponse: (error: ServiceError | null, response: SipStatus) => void
		): unknown {
			calls.push({ request, metadata });
			onResponse(null, response);
			return null;
		}
	};
	return { client, calls };
}

/**
 * Build a fake client whose `sipGetSipStatus` fails with `serviceError` through the callback error path.
 *
 * @param serviceError - The gRPC error to surface to the caller.
 * @returns A {@link SipClientStub} exposing the injectable `client` and its recorded `calls`.
 */
function makeErrorClient(serviceError: ServiceError): SipClientStub {
	const calls: RecordedCall[] = [];
	const client: SipStatusReader = {
		sipGetSipStatus(
			request: Empty,
			metadata: Metadata,
			onResponse: (error: ServiceError | null, response: SipStatus) => void
		): unknown {
			calls.push({ request, metadata });
			onResponse(serviceError, new sipPbModule.SipStatus());
			return null;
		}
	};
	return { client, calls };
}

/**
 * Verifies the happy path: the bearer token is attached as `authorization` metadata, the empty request
 * is forwarded unchanged, and the returned {@link SipStatus} is resolved back to the caller.
 */
runTestCase('getSipStatus attaches the bearer header, forwards the request, and resolves the status', async () => {
	const response: SipStatus = new sipPbModule.SipStatus();
	response.setAccountName(EXPECTED_ACCOUNT);
	response.setDescription(EXPECTED_DESCRIPTION);
	response.setStatusType(EXPECTED_STATUS_TYPE);

	const stub: SipClientStub = makeSuccessClient(response);
	const request: Empty = new emptyModule.Empty();

	const status: SipStatus = await getSipStatus(stub.client, request, BEARER_HEADER);

	assert.equal(stub.calls.length, 1);
	assert.equal(stub.calls[0].request, request);
	assert.deepEqual(stub.calls[0].metadata.get(AUTHORIZATION_KEY), [BEARER_HEADER]);
	// The bearer token MUST be attached under the lowercase 'authorization' key: native gRPC
	// transports normalize/expect lowercase ASCII metadata keys. Assert the stored key is lowercase.
	const metadataMap: { [key: string]: MetadataValue } = stub.calls[0].metadata.getMap();
	assert.equal(metadataMap[AUTHORIZATION_KEY], BEARER_HEADER);
	assert.equal(metadataMap['Authorization'], undefined);

	assert.equal(status.getAccountName(), EXPECTED_ACCOUNT);
	assert.equal(status.getDescription(), EXPECTED_DESCRIPTION);
	assert.equal(status.getStatusType(), EXPECTED_STATUS_TYPE);
});

/** Verifies a gRPC failure is propagated: `getSipStatus` rejects with the exact {@link ServiceError}. */
runTestCase('getSipStatus rejects with the gRPC ServiceError when the call fails', async () => {
	const serviceError: ServiceError = Object.assign(new Error('sip backend unavailable'), {
		code: 14,
		details: 'sip backend unavailable',
		metadata: new Metadata()
	}) as ServiceError;

	const stub: SipClientStub = makeErrorClient(serviceError);
	const request: Empty = new emptyModule.Empty();

	await assert.rejects(
		() => getSipStatus(stub.client, request, BEARER_HEADER),
		(thrown: unknown): boolean => {
			assert.equal(thrown, serviceError);
			return true;
		}
	);
	assert.equal(stub.calls.length, 1);
});
