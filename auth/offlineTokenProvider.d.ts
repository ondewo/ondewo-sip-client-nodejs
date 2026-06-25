/**
 * Minimal structural type of the fetch Response fields this helper reads. Keeps the module
 * self-contained (no DOM lib dependency) while still typing the injectable `fetchImpl`.
 */
export interface TokenFetchResponse {
    /** Whether the HTTP status is in the 2xx success range. */
    ok: boolean;
    /** The numeric HTTP status code of the response. */
    status: number;
    /**
     * Read the full response body as text.
     *
     * @returns A promise resolving to the raw response body string.
     */
    text(): Promise<string>;
}
/** Init object passed to the injectable fetch. */
export interface TokenFetchInit {
    /** The HTTP method, always `"POST"` for the token endpoint. */
    method: string;
    /** The request headers (content type + accept) sent to the token endpoint. */
    headers: Record<string, string>;
    /** The form-encoded request body. */
    body: string;
}
/**
 * Injectable fetch signature (a subset of the global `fetch`) used by the token endpoint call.
 *
 * @param url - The absolute token-endpoint URL to POST to.
 * @param init - The request method, headers, and form-encoded body.
 * @returns A promise resolving to the minimal {@link TokenFetchResponse} the helper reads.
 */
export type TokenFetch = (url: string, init: TokenFetchInit) => Promise<TokenFetchResponse>;
/** Options for the D18 headless-SDK offline-token login. */
export interface OfflineTokenLoginOptions {
    /** Base Keycloak URL, e.g. "https://auth.example.com/auth" (trailing slash tolerated). */
    keycloakUrl: string;
    /** Realm name, e.g. "ondewo-ccai-platform". */
    realm: string;
    /** Public SDK client id, e.g. "ondewo-sip-cai-sdk-public". NO client_secret (Q1). */
    clientId: string;
    /** 2FA-exempt technical-user email. */
    username: string;
    /** Technical-user password. */
    password: string;
    /** Optional cap (seconds) on how long the auto-refresh loop runs after login. */
    tokenExpirationInS?: number;
    /** Optional fetch override (tests inject a mock); defaults to the global fetch. */
    fetchImpl?: TokenFetch;
    /** Optional clock override returning epoch ms (tests); defaults to Date.now. */
    nowInMs?: () => number;
}
/** Error raised on any token-endpoint or token-shape failure. */
export declare class TokenError extends Error {
    /**
     * Construct a new {@link TokenError}.
     *
     * @param message - A human-readable description of the token failure.
     */
    constructor(message: string);
}
/**
 * A live access-token holder backed by a bounded auto-refresh loop. Obtain one from {@link login};
 * read {@link getAuthorizationHeader} for the gRPC `Authorization` metadata and call {@link stop} when done.
 */
export declare class OfflineTokenProvider {
    private readonly tokenEndpoint;
    private readonly clientId;
    private readonly tokenExpirationInS;
    private readonly fetchImpl;
    private readonly nowInMs;
    private accessToken;
    private refreshToken;
    private timer;
    private stopped;
    private deadlineInMs;
    private onRefreshErrorHandler;
    /**
     * Construct a provider from the login options. Does not perform any network I/O; call
     * {@link bootstrap} (or the module-level {@link login}) to actually authenticate.
     *
     * @param options - The D18 offline-token login options (URL, realm, client id, credentials, overrides).
     */
    constructor(options: OfflineTokenLoginOptions);
    /**
     * Perform the one-time ROPC login and arm the first refresh. Awaited by {@link login}.
     *
     * @param username - The 2FA-exempt technical-user email.
     * @param password - The technical-user password.
     * @returns A promise that resolves once the access token is stored and the first refresh is armed.
     * @throws {TokenError} If the token endpoint fails or the response carries no `refresh_token`
     *   (the SDK client lacks `directAccessGrants` + the `offline_access` scope).
     */
    bootstrap(username: string, password: string): Promise<void>;
    /**
     * Exchange the offline refresh token for a fresh access token and re-arm the next refresh.
     * No-ops once {@link stop} has been called or the bounded deadline has elapsed.
     *
     * @returns A promise that resolves once the token is refreshed (or the loop has lapsed/stopped).
     * @throws {TokenError} If the refresh token-endpoint call fails or returns an invalid body.
     */
    private refresh;
    /**
     * Arm a single timer for the next refresh, clamped to the bounded deadline. Stops silently once
     * `tokenExpirationInS` has elapsed (no further renewal -> access lapses -> re-login required).
     *
     * @param expiresInRaw - The access token lifetime in seconds from the token response, or
     *   `undefined`/non-positive to fall back to {@link MIN_REFRESH_DELAY_IN_S}.
     */
    private scheduleRefresh;
    /**
     * Register a callback invoked with the error of a failed background refresh (optional diagnostics).
     *
     * @param handler - The callback receiving the error thrown by a failed background refresh.
     * @returns Nothing.
     */
    onRefreshError(handler: (error: unknown) => void): void;
    /**
     * Read the current access token.
     *
     * @returns The current access token, or `null` before bootstrap / after the bounded loop has lapsed.
     */
    getAccessToken(): string | null;
    /**
     * Build the value for an `Authorization` gRPC metadata header.
     *
     * @returns The header value `Bearer <access_token>`.
     * @throws {TokenError} If no access token is available (login has not completed or has lapsed).
     */
    getAuthorizationHeader(): string;
    /**
     * Stop the auto-refresh loop. Idempotent; safe to call from any state.
     *
     * @returns Nothing.
     */
    stop(): void;
}
/**
 * One-time ROPC + offline_access login against the PUBLIC SDK client, returning a live token provider
 * whose access token is auto-refreshed in the background until `tokenExpirationInS` elapses.
 *
 * @param options - The D18 offline-token login options (URL, realm, client id, credentials, overrides).
 * @returns A promise resolving to a bootstrapped {@link OfflineTokenProvider} with a live access token.
 * @throws {TokenError} If `options` is missing, a required string option is empty, or the token
 *   endpoint / response is invalid.
 */
export declare function login(options: OfflineTokenLoginOptions): Promise<OfflineTokenProvider>;
