/**
 * Minimal structural type of the fetch Response fields this helper reads. Keeps the module
 * self-contained (no DOM lib dependency) while still typing the injectable `fetchImpl`.
 */
export interface TokenFetchResponse {
    ok: boolean;
    status: number;
    text(): Promise<string>;
}
/** Init object passed to the injectable fetch. */
export interface TokenFetchInit {
    method: string;
    headers: Record<string, string>;
    body: string;
}
/** Injectable fetch signature (a subset of the global `fetch`) used by the token endpoint call. */
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
    constructor(options: OfflineTokenLoginOptions);
    /** Perform the one-time ROPC login and arm the first refresh. Awaited by {@link login}. */
    bootstrap(username: string, password: string): Promise<void>;
    /** Exchange the offline refresh token for a fresh access token and re-arm the next refresh. */
    private refresh;
    /**
     * Arm a single timer for the next refresh, clamped to the bounded deadline. Stops silently once
     * `tokenExpirationInS` has elapsed (no further renewal -> access lapses -> re-login required).
     */
    private scheduleRefresh;
    /** Register a callback invoked with the error of a failed background refresh (optional diagnostics). */
    onRefreshError(handler: (error: unknown) => void): void;
    /** The current access token, or null before bootstrap / after the bounded loop has lapsed. */
    getAccessToken(): string | null;
    /** The value for an `Authorization` gRPC metadata header: `Bearer <access_token>`. */
    getAuthorizationHeader(): string;
    /** Stop the auto-refresh loop. Idempotent; safe to call from any state. */
    stop(): void;
}
/**
 * One-time ROPC + offline_access login against the PUBLIC SDK client, returning a live token provider
 * whose access token is auto-refreshed in the background until `tokenExpirationInS` elapses.
 */
export declare function login(options: OfflineTokenLoginOptions): Promise<OfflineTokenProvider>;
