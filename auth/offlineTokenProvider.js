"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineTokenProvider = exports.TokenError = void 0;
exports.login = login;
// D18 headless-SDK auth helper (keycloak-migration-plan §7.8 + D18).
//
// One-time ROPC login (grant_type=password, scope=offline_access) against the PUBLIC SDK client
// `ondewo-sip-cai-sdk-public` (no client_secret -- Q1), then a bounded background loop that refreshes
// the short-lived access token from the offline refresh token before it expires. The current access
// token is exposed for an `Authorization: Bearer <token>` gRPC metadata header. The refresh loop stops
// after `tokenExpirationInS` (if given) has elapsed since login.
/**
 * Seconds of head-room subtracted from a token's `expires_in` so the refresh fires before the access
 * token actually lapses (covers clock skew + the round-trip to Keycloak).
 */
const REFRESH_SKEW_IN_S = 30;
/**
 * Lower bound (in seconds) for the scheduled refresh delay so a tiny/zero `expires_in` cannot spin a
 * hot loop.
 */
const MIN_REFRESH_DELAY_IN_S = 1;
/** Error raised on any token-endpoint or token-shape failure. */
class TokenError extends Error {
    /**
     * Construct a new {@link TokenError}.
     *
     * @param message - A human-readable description of the token failure.
     */
    constructor(message) {
        super(message);
        this.name = 'TokenError';
    }
}
exports.TokenError = TokenError;
/**
 * Build the OIDC token endpoint URL for a realm, tolerating a trailing slash on `keycloakUrl` and an
 * optional `/auth` relative path already baked into it.
 *
 * @param keycloakUrl - The base Keycloak URL (a trailing slash is tolerated and stripped).
 * @param realm - The realm name, which is URL-encoded into the path.
 * @returns The fully-qualified OIDC `openid-connect/token` endpoint URL for the realm.
 */
function buildTokenEndpoint(keycloakUrl, realm) {
    const base = keycloakUrl.replace(/\/+$/, '');
    return `${base}/realms/${encodeURIComponent(realm)}/protocol/openid-connect/token`;
}
/**
 * POST an `application/x-www-form-urlencoded` body to the token endpoint and return the parsed JSON.
 *
 * @param tokenEndpoint - The absolute token-endpoint URL to POST to.
 * @param params - The form parameters (grant type, client id, credentials, scope, etc.).
 * @param fetchImpl - The fetch implementation used to perform the request.
 * @returns A promise resolving to the parsed {@link KeycloakTokenResponse}.
 * @throws {TokenError} On a non-2xx response, an unparseable body, or a missing `access_token`.
 */
function postTokenRequest(tokenEndpoint, params, fetchImpl) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = new URLSearchParams(params).toString();
        const response = yield fetchImpl(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            },
            body
        });
        const text = yield response.text();
        if (!response.ok) {
            throw new TokenError(`Keycloak token endpoint returned HTTP ${response.status}: ${text}`);
        }
        let parsed;
        try {
            parsed = JSON.parse(text);
        }
        catch (_a) {
            throw new TokenError(`Keycloak token endpoint returned a non-JSON body: ${text}`);
        }
        if (typeof parsed.access_token !== 'string' || parsed.access_token.length === 0) {
            throw new TokenError('Keycloak token response did not contain an access_token');
        }
        return parsed;
    });
}
/**
 * A live access-token holder backed by a bounded auto-refresh loop. Obtain one from {@link login};
 * read {@link getAuthorizationHeader} for the gRPC `Authorization` metadata and call {@link stop} when done.
 */
class OfflineTokenProvider {
    /**
     * Construct a provider from the login options. Does not perform any network I/O; call
     * {@link bootstrap} (or the module-level {@link login}) to actually authenticate.
     *
     * @param options - The D18 offline-token login options (URL, realm, client id, credentials, overrides).
     */
    constructor(options) {
        this.tokenEndpoint = buildTokenEndpoint(options.keycloakUrl, options.realm);
        this.clientId = options.clientId;
        this.tokenExpirationInS = options.tokenExpirationInS;
        this.fetchImpl = options.fetchImpl !== undefined ? options.fetchImpl : globalThis.fetch;
        this.nowInMs = options.nowInMs !== undefined ? options.nowInMs : Date.now;
        this.accessToken = null;
        this.refreshToken = null;
        this.timer = null;
        this.stopped = false;
        this.deadlineInMs = null;
        this.onRefreshErrorHandler = null;
    }
    /**
     * Perform the one-time ROPC login and arm the first refresh. Awaited by {@link login}.
     *
     * @param username - The 2FA-exempt technical-user email.
     * @param password - The technical-user password.
     * @returns A promise that resolves once the access token is stored and the first refresh is armed.
     * @throws {TokenError} If the token endpoint fails or the response carries no `refresh_token`
     *   (the SDK client lacks `directAccessGrants` + the `offline_access` scope).
     */
    bootstrap(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenResponse = yield postTokenRequest(this.tokenEndpoint, {
                grant_type: 'password',
                client_id: this.clientId,
                username,
                password,
                scope: 'offline_access'
            }, this.fetchImpl);
            this.accessToken = tokenResponse.access_token;
            this.refreshToken = typeof tokenResponse.refresh_token === 'string' ? tokenResponse.refresh_token : null;
            if (this.refreshToken === null) {
                throw new TokenError('Keycloak token response did not contain a refresh_token; the SDK client must have ' +
                    'directAccessGrants + the offline_access scope (ondewo-sip-cai-sdk-public)');
            }
            if (this.tokenExpirationInS !== undefined) {
                const expirationInMs = this.tokenExpirationInS * 1000;
                this.deadlineInMs = this.nowInMs() + expirationInMs;
            }
            this.scheduleRefresh(tokenResponse.expires_in);
        });
    }
    /**
     * Exchange the offline refresh token for a fresh access token and re-arm the next refresh.
     * No-ops once {@link stop} has been called or the bounded deadline has elapsed.
     *
     * @returns A promise that resolves once the token is refreshed (or the loop has lapsed/stopped).
     * @throws {TokenError} If the refresh token-endpoint call fails or returns an invalid body.
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            /* c8 ignore next 3 -- unreachable: stop() always clears the only timer that calls refresh() */
            if (this.stopped) {
                return;
            }
            // Re-check the bounded deadline at fire time (not just at schedule time): once it has elapsed the
            // loop stops with no further renewal -> the access token lapses -> re-login is required.
            if (this.deadlineInMs !== null && this.nowInMs() >= this.deadlineInMs) {
                this.stop();
                return;
            }
            const tokenResponse = yield postTokenRequest(this.tokenEndpoint, {
                grant_type: 'refresh_token',
                client_id: this.clientId,
                refresh_token: this.refreshToken
            }, this.fetchImpl);
            this.accessToken = tokenResponse.access_token;
            // Keycloak may rotate the offline refresh token; keep the newest one when present.
            if (typeof tokenResponse.refresh_token === 'string' && tokenResponse.refresh_token.length > 0) {
                this.refreshToken = tokenResponse.refresh_token;
            }
            this.scheduleRefresh(tokenResponse.expires_in);
        });
    }
    /**
     * Arm a single timer for the next refresh, clamped to the bounded deadline. Stops silently once
     * `tokenExpirationInS` has elapsed (no further renewal -> access lapses -> re-login required).
     *
     * @param expiresInRaw - The access token lifetime in seconds from the token response, or
     *   `undefined`/non-positive to fall back to {@link MIN_REFRESH_DELAY_IN_S}.
     */
    scheduleRefresh(expiresInRaw) {
        if (this.stopped) {
            return;
        }
        const expiresInS = typeof expiresInRaw === 'number' && expiresInRaw > 0 ? expiresInRaw : MIN_REFRESH_DELAY_IN_S;
        let delayInS = Math.max(expiresInS - REFRESH_SKEW_IN_S, MIN_REFRESH_DELAY_IN_S);
        if (this.deadlineInMs !== null) {
            const remainingInMs = this.deadlineInMs - this.nowInMs();
            if (remainingInMs <= 0) {
                this.stop();
                return;
            }
            delayInS = Math.min(delayInS, remainingInMs / 1000);
        }
        this.timer = setTimeout(() => {
            this.refresh().catch((refreshError) => {
                // Swallow a transient refresh failure but surface it so the caller can react; the next
                // gRPC call gets the stale (possibly expired) token and re-logs in on UNAUTHENTICATED.
                if (this.onRefreshErrorHandler !== null) {
                    this.onRefreshErrorHandler(refreshError);
                }
            });
        }, delayInS * 1000);
        // Do not keep the event loop alive solely for the refresh timer.
        /* c8 ignore next 3 -- the else branch is unreachable: Node's Timeout always exposes unref() */
        if (typeof this.timer.unref === 'function') {
            this.timer.unref();
        }
    }
    /**
     * Register a callback invoked with the error of a failed background refresh (optional diagnostics).
     *
     * @param handler - The callback receiving the error thrown by a failed background refresh.
     * @returns Nothing.
     */
    onRefreshError(handler) {
        this.onRefreshErrorHandler = handler;
    }
    /**
     * Read the current access token.
     *
     * @returns The current access token, or `null` before bootstrap / after the bounded loop has lapsed.
     */
    getAccessToken() {
        return this.accessToken;
    }
    /**
     * Build the value for an `Authorization` gRPC metadata header.
     *
     * @returns The header value `Bearer <access_token>`.
     * @throws {TokenError} If no access token is available (login has not completed or has lapsed).
     */
    getAuthorizationHeader() {
        if (this.accessToken === null) {
            throw new TokenError('No access token available; login() has not completed or has lapsed');
        }
        return `Bearer ${this.accessToken}`;
    }
    /**
     * Stop the auto-refresh loop. Idempotent; safe to call from any state.
     *
     * @returns Nothing.
     */
    stop() {
        this.stopped = true;
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
exports.OfflineTokenProvider = OfflineTokenProvider;
/**
 * One-time ROPC + offline_access login against the PUBLIC SDK client, returning a live token provider
 * whose access token is auto-refreshed in the background until `tokenExpirationInS` elapses.
 *
 * @param options - The D18 offline-token login options (URL, realm, client id, credentials, overrides).
 * @returns A promise resolving to a bootstrapped {@link OfflineTokenProvider} with a live access token.
 * @throws {TokenError} If `options` is missing, a required string option is empty, or the token
 *   endpoint / response is invalid.
 */
function login(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options === undefined || options === null) {
            throw new TokenError('login() requires an options object');
        }
        const requiredKeys = ['keycloakUrl', 'realm', 'clientId', 'username', 'password'];
        for (const key of requiredKeys) {
            const value = options[key];
            if (typeof value !== 'string' || value.length === 0) {
                throw new TokenError(`login() option "${key}" is required and must be a non-empty string`);
            }
        }
        const provider = new OfflineTokenProvider(options);
        yield provider.bootstrap(options.username, options.password);
        return provider;
    });
}
