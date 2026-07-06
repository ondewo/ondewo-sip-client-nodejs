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

The compiled entry point resolves the committed generated stubs at the repo root. Configure it by
editing `examples/environment.env` (loaded automatically via dotenv) or by exporting the canonical
environment variables (defaults point at a local dev stack):

| Variable                    | Default                         |
| --------------------------- | ------------------------------- |
| `ONDEWO_HOST`               | `localhost`                     |
| `ONDEWO_PORT`               | `50053`                         |
| `ONDEWO_USE_SECURE_CHANNEL` | `false`                         |
| `ONDEWO_GRPC_CERT`          | _(empty; system roots)_         |
| `KEYCLOAK_URL`              | `https://auth.example.com/auth` |
| `KEYCLOAK_REALM`            | `ondewo-ccai-platform`          |
| `KEYCLOAK_CLIENT_ID`        | `ondewo-sip-cai-sdk-public`     |
| `KEYCLOAK_USER_NAME`        | _(required)_                    |
| `KEYCLOAK_PASSWORD`         | _(required)_                    |

```shell
npm run pretest:examples
KEYCLOAK_USER_NAME=tech-user@example.com \
KEYCLOAK_PASSWORD=... \
ONDEWO_HOST=localhost \
ONDEWO_PORT=50053 \
node .test-build/examples/sipGetStatusExample.js
```
