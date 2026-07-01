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

// Minimal, idiomatic example: authenticate with the D18 Keycloak offline-token flow, construct the
// generated `SipClient`, and call the representative unary RPC `SipGetSipStatus` with the bearer
// token attached as gRPC `authorization` metadata.
//
// The reusable request-building + response-handling logic lives in `getSipStatus`, which depends only
// on a minimal structural view of the client (`SipStatusReader`) so it can be unit-tested with a fake
// -- see `sipGetStatusExample.spec.ts`. The runnable `main` wires the real generated stubs.
//
// Run it against a live stack (all inputs default to a local dev stack):
//   ONDEWO_SIP_USERNAME=... ONDEWO_SIP_PASSWORD=... ONDEWO_SIP_GRPC_HOST=localhost:50053 \
//   node .test-build/sipGetStatusExample.js

import { ChannelCredentials, credentials, Metadata, ServiceError } from '@grpc/grpc-js';

// The generated protobuf/gRPC stubs and the auth provider are imported for their TYPES only (erased at
// compile time); the runtime values are pulled in via `require` inside `main` so this file stays a
// standalone script that resolves the committed `../api` and `../auth` JS at run time.
import type { Empty } from '../api/google/protobuf/empty_pb';
import type { SipClient } from '../api/ondewo/sip/sip_grpc_pb';
import type { SipStatus } from '../api/ondewo/sip/sip_pb';
import type { OfflineTokenLoginOptions, OfflineTokenProvider } from '../auth/offlineTokenProvider';

/**
 * Minimal structural view of the generated {@link SipClient}, narrowed to the single unary RPC this
 * example calls. Depending on the interface (not the concrete client) keeps {@link getSipStatus}
 * unit-testable with a lightweight fake -- the real `SipClient` satisfies it structurally.
 */
export interface SipStatusReader {
	/**
	 * Fetch the current SIP status.
	 *
	 * @param request - The empty request message.
	 * @param metadata - The call metadata carrying the `authorization` bearer header.
	 * @param onResponse - Node-style callback invoked with a gRPC error or the resulting status.
	 * @returns The underlying gRPC unary call handle (unused by this example).
	 */
	sipGetSipStatus(
		request: Empty,
		metadata: Metadata,
		onResponse: (error: ServiceError | null, response: SipStatus) => void
	): unknown;
}

/** The gRPC metadata key carrying the `Bearer <token>` value for every authenticated call. */
const AUTHORIZATION_METADATA_KEY: string = 'authorization';

/**
 * Call `SipGetSipStatus` with the SDK bearer token attached as `authorization` metadata, adapting the
 * generated callback-style RPC into a promise.
 *
 * @param client - Any object exposing the generated `sipGetSipStatus` unary RPC.
 * @param request - The empty request message the RPC expects.
 * @param authorizationHeader - The `Bearer <token>` value from {@link OfflineTokenProvider.getAuthorizationHeader}.
 * @returns A promise resolving to the returned {@link SipStatus}, or rejecting with the gRPC {@link ServiceError}.
 */
export function getSipStatus(client: SipStatusReader, request: Empty, authorizationHeader: string): Promise<SipStatus> {
	const metadata: Metadata = new Metadata();
	metadata.set(AUTHORIZATION_METADATA_KEY, authorizationHeader);
	return new Promise<SipStatus>((resolve: (value: SipStatus) => void, reject: (reason: ServiceError) => void): void => {
		client.sipGetSipStatus(request, metadata, (error: ServiceError | null, response: SipStatus): void => {
			if (error !== null) {
				reject(error);
				return;
			}
			resolve(response);
		});
	});
}

/** Constructor view of the generated `SipClient` used to instantiate the real client at run time. */
interface SipClientConstructor {
	new (address: string, channelCredentials: ChannelCredentials): SipClient;
}

/** Constructor view of the generated google.protobuf `Empty` message used at run time. */
interface EmptyConstructor {
	new (): Empty;
}

/** The subset of the generated `sip_grpc_pb` module this example consumes at run time. */
interface SipGrpcModule {
	SipClient: SipClientConstructor;
}

/** The subset of the generated `empty_pb` module this example consumes at run time. */
interface EmptyModule {
	Empty: EmptyConstructor;
}

/** The subset of the auth provider module this example consumes at run time. */
interface AuthModule {
	/**
	 * One-time ROPC + offline_access login returning a live, auto-refreshing token provider.
	 *
	 * @param options - The Keycloak login options.
	 * @returns A promise resolving to a bootstrapped {@link OfflineTokenProvider}.
	 */
	login(options: OfflineTokenLoginOptions): Promise<OfflineTokenProvider>;
}

/**
 * Runnable entry point: log in via the D18 offline-token flow, construct the real generated
 * `SipClient`, query the SIP status, print it, then stop the background token refresh.
 *
 * @returns A promise that resolves once the status has been printed and the refresh loop stopped.
 */
async function main(): Promise<void> {
	// The compiled example lives at `.test-build/examples/sipGetStatusExample.js`, from where `../../`
	// resolves to the repo root holding the committed generated stubs (`api/`) and auth provider (`auth/`).
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const authModule: AuthModule = require('../../auth/offlineTokenProvider') as AuthModule;
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const sipGrpcModule: SipGrpcModule = require('../../api/ondewo/sip/sip_grpc_pb') as SipGrpcModule;
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const emptyModule: EmptyModule = require('../../api/google/protobuf/empty_pb') as EmptyModule;

	const loginOptions: OfflineTokenLoginOptions = {
		keycloakUrl: process.env.ONDEWO_SIP_KEYCLOAK_URL ?? 'https://auth.example.com/auth',
		realm: process.env.ONDEWO_SIP_KEYCLOAK_REALM ?? 'ondewo-ccai-platform',
		clientId: process.env.ONDEWO_SIP_KEYCLOAK_CLIENT_ID ?? 'ondewo-sip-cai-sdk-public',
		username: process.env.ONDEWO_SIP_USERNAME ?? '',
		password: process.env.ONDEWO_SIP_PASSWORD ?? ''
	};
	const tokenProvider: OfflineTokenProvider = await authModule.login(loginOptions);

	const address: string = process.env.ONDEWO_SIP_GRPC_HOST ?? 'localhost:50053';
	const channelCredentials: ChannelCredentials = credentials.createInsecure();
	const client: SipStatusReader = new sipGrpcModule.SipClient(address, channelCredentials);
	const request: Empty = new emptyModule.Empty();

	try {
		const status: SipStatus = await getSipStatus(client, request, tokenProvider.getAuthorizationHeader());
		console.log(
			`SIP status: account=${status.getAccountName()} statusType=${status.getStatusType()} ` +
				`description=${status.getDescription()}`
		);
	} finally {
		tokenProvider.stop();
	}
}

if (require.main === module) {
	void main().catch((error: unknown): void => {
		console.error(error);
		process.exitCode = 1;
	});
}
