# Examples

Minimal, self-contained usage examples for `@ondewo/sip-client-nodejs`.

## `sipGetStatusExample.ts`

Authenticate with the D18 Keycloak offline-token flow (`login` → `OfflineTokenProvider`), construct the
generated `SipClient`, and call the representative unary RPC `SipGetSipStatus` with the bearer token
attached as gRPC `authorization` metadata.

The reusable request-building + response-handling logic is `getSipStatus`, which depends only on a
minimal structural view of the client so it can be unit-tested with a fake — see
`sipGetStatusExample.spec.ts` (no network, no live server).

### Run the mock test

```shell
npm run test:examples
```

### Run against a live stack

The compiled entry point resolves the committed generated stubs at the repo root. Configure it via
environment variables (defaults point at a local dev stack):

| Variable                        | Default                         |
| ------------------------------- | ------------------------------- |
| `ONDEWO_SIP_KEYCLOAK_URL`       | `https://auth.example.com/auth` |
| `ONDEWO_SIP_KEYCLOAK_REALM`     | `ondewo-ccai-platform`          |
| `ONDEWO_SIP_KEYCLOAK_CLIENT_ID` | `ondewo-sip-cai-sdk-public`     |
| `ONDEWO_SIP_USERNAME`           | _(required)_                    |
| `ONDEWO_SIP_PASSWORD`           | _(required)_                    |
| `ONDEWO_SIP_GRPC_HOST`          | `localhost:50053`               |

```shell
npm run pretest:examples
ONDEWO_SIP_USERNAME=tech-user@example.com \
ONDEWO_SIP_PASSWORD=... \
ONDEWO_SIP_GRPC_HOST=localhost:50053 \
node .test-build/examples/sipGetStatusExample.js
```
