# Release History

*****************

## Release ONDEWO SIP Nodejs Client 5.5.0

### New Features

* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) Tracking API Version [5.5.0](https://github.com/ondewo/ondewo-sip-api/releases/tag/5.5.0) ( [Documentation](https://ondewo.github.io/ondewo-sip-api/) ), regenerated with ondewo-proto-compiler 5.15.5. The generated `SipClient` and messages now cover:
  * Answering machine detection: status `OUTGOING_CALL_ANSWERING_MACHINE_DETECTED`, `AnsweringMachineDetectionResult`, `SipStatus.amd_result`, `SipEndCallRequest.end_reason` (`ANSWERING_MACHINE`, `ANSWERING_MACHINE_VOICE_MESSAGE_LEFT`) with `SipEndCallRequest.amd_result`, and the `SipReportAnsweringMachineDetected` RPC.
  * Call identity: `SipStatus.call_id`; requests are scoped to a call with the `x-ondewo-expected-call-id` gRPC metadatum.
  * `SipSetCallMediaControl`: call-scoped operator media control (mute the bot, pause its listening) as per-owner holds, incl. `participants_present`; the effective level is reported in `SipStatus.bot_muted` / `SipStatus.listening_paused`.
  * `SipStreamCallAudio`: bidirectional live call audio (LISTEN, or TALK with a bot take-over), counted in `SipStatus.call_audio_streams`.
  * Truthful transfers: `SipTransferCallRequest.outcome_timeout_ms`, `SipStatus.sip_response_code` and `EndCallReason.END_CALL_REASON_TRANSFERRED`.
  * `SipGetSipStatus` and `SipGetSipStatusHistory` declare `idempotency_level = NO_SIDE_EFFECTS` in the proto.
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) `tests/entryPoint.spec.ts` pins that the package root exports the new messages and that `SipClient` carries every `Sip` RPC of API 5.5.0.

The API change is purely additive: a client built against 5.4.x stays wire-compatible.

*****************

## Release ONDEWO SIP Nodejs Client 5.4.2

### Improvements

* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) New TLS / mutual TLS helper `auth/grpcChannel`, exported from the package root: `GrpcClientConfig`, `createChannelCredentials` and `createGrpcClient` build `@grpc/grpc-js` credentials and channel options from PEM **content** (`grpcCert`, `grpcClientCert`, `grpcClientKey`), never a file path. An empty `grpcCert` trusts the system roots. Same contract as the Python SDKs (ondewo-client-utils 4.1.x).
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) Refused before gRPC sees them: half a client identity (certificate without key or key without certificate), a value that is not PEM content (e.g. a path), and `useSecureChannel: false` together with a client identity. Empty strings on both mean plain TLS. Error messages name the field and `host:port`, never a PEM, a key or the config object.
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) A plaintext channel logs a warning naming `host:port`; bare IPv6 hosts are bracketed (`[::1]:50051`); CRLF PEMs work; the client key renders as `***REDACTED***` in `toString`, `util.inspect` and `JSON.stringify`.
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) Channel defaults: max message length `2**31 - 1` in both directions, `grpc.max_reconnect_backoff_ms` 5000, `grpc.keepalive_timeout_ms` 20000, `grpc.keepalive_permit_without_calls` 0. `grpc.keepalive_time_ms` is deliberately left unset: grpc-js has no `grpc.http2.max_pings_without_data`, so keepalive pings on a silent stream make a grpc-core server answer GOAWAY `too_many_pings`.
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) README section "TLS, mutual TLS and certificates": modes, loading PEMs from files, a test PKI with openssl, security notes and troubleshooting.
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) Tests: real handshakes against an in-process grpc-js server with an openssl test PKI generated at test time (TLS, mutual TLS, missing or foreign client identity rejected, wrong CA, CRLF PEMs, IPv6 where available), plus the refusal and redaction cases. CI runs on Node 20, 22 and 24 with `npm ci`, and fails when the committed `auth/` build output drifts from its source.

### Bug Fixes

* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) Regenerated with ondewo-proto-compiler 5.15.5: `public-api.js` (the package `main`) is now a CommonJS barrel, so `require('@ondewo/sip-client-nodejs')` works. With earlier compilers it contained `export * from` lines and failed with `ERR_MODULE_NOT_FOUND`. CI now `require()`s the package root.
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) The committed `auth/offlineTokenProvider.js` / `.d.ts` were an older es2015-target build; they are rebuilt from the current source (same behaviour).
* [[OND211-2443]](https://ondewo.atlassian.net/browse/OND211-2443) `tests/releaseNotes.spec.ts` pins the release-notes slice: every heading's spelling, every section's `*****` separator, `src/RELEASE.md` == `RELEASE.md` and non-empty notes for the current version.

API unchanged: tracking API Version [5.4.0](https://github.com/ondewo/ondewo-sip-api/releases/tag/5.4.0) ( [Documentation](https://ondewo.github.io/ondewo-sip-api/) )

*****************

## Release ONDEWO SIP Nodejs Client 5.4.1

### Bug Fixes

* [[OND221-2830]](https://ondewo.atlassian.net/browse/OND221-2830) Regenerated with [ondewo-proto-compiler 5.13.0](https://github.com/ondewo/ondewo-proto-compiler/releases/tag/5.13.0).
* [[OND221-2830]](https://ondewo.atlassian.net/browse/OND221-2830) The hand-written `auth/` surface is now re-exported from the generated public-api barrel. It was compiled and shipped inside the package but nothing re-exported it, so importing a symbol from the package root did not resolve and consumers could only deep-import the module. The re-export is emitted by the compiler, so it survives the regeneration that rewrites the barrel on every build.
* [[OND221-2830]](https://ondewo.atlassian.net/browse/OND221-2830) Tooling: `conventional-pre-commit` now runs before `giticket` at the commit-msg stage - with giticket first, its `[OND221-2830] fix: ...` rewrite was no longer valid Conventional Commits and every commit on a ticket branch failed. `README.md` is prettier-ignored where `.prettierrc` sets `useTabs` and markdownlint's MD010 de-tabs the same blocks, and the codegen `docker run` invocations no longer pass `-it`, which fails outside a TTY.

*****************

## Release ONDEWO SIP Nodejs Client 5.4.0

### Improvements

* Tracking API Version [5.4.0](https://github.com/ondewo/ondewo-sip-api/releases/tag/5.4.0) ( [Documentation](https://ondewo.github.io/ondewo-sip-api/) )

*****************

## Release ONDEWO SIP Nodejs Client 5.3.0

### Improvements

* Tracking API Version [5.3.0](https://github.com/ondewo/ondewo-sip-api/releases/tag/5.3.0) ( [Documentation](https://ondewo.github.io/ondewo-sip-api/) )

*****************

## Release ONDEWO SIP Nodejs Client 5.2.0

### Improvements

* Tracking API Version [5.2.0](https://github.com/ondewo/ondewo-sip-api/releases/tag/5.2.0) ( [Documentation](https://ondewo.github.io/ondewo-sip-api/) )

*****************

## Release ONDEWO SIP Nodejs Client 5.1.0

### Improvements

* Tracking API Version [5.1.0](https://github.com/ondewo/ondewo-sip-api/releases/tag/5.1.0) ( [Documentation](https://ondewo.github.io/ondewo-sip-api/) )

*****************

## Release ONDEWO SIP Nodejs Client 5.0.0

### Improvements

* Tracking API Version [5.0.0](https://github.com/ondewo/ondewo-sip-api/releases/tag/5.0.0) ( [Documentation](https://ondewo.github.io/ondewo-sip-api/) )

*****************

## Release ONDEWO SIP Nodejs Client 4.0.0

### Improvements

* Tracking API Version [4.0.0](https://github.com/ondewo/ondewo-sip-api/releases/tag/4.0.0) ( [Documentation](https://ondewo.github.io/ondewo-sip-api/) )

*****************

## Release ONDEWO SIP Nodejs Client 3.1.0

### Improvements

* Track version 3.1.0 of [ONDEWO SIP API](https://github.com/ondewo/ondewo-sip-api/releases/3.1.0)
* [[OND211-2039]](https://ondewo.atlassian.net/browse/OND211-2039) - Implemented automated release for GitHub and NPM
* [[OND211-2039]](https://ondewo.atlassian.net/browse/OND211-2039) - Added pre-commit hooks and adjusted files to them

*****************
