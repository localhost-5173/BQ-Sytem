import axios from "axios";

const getBaseUrl = () => {
  if (typeof window !== "undefined" && (window as any).__API_URL__) {
    return (window as any).__API_URL__;
  }
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof process !== "undefined" && process.env) {
    return process.env.VITE_API_URL || process.env.BACKEND_URL || "http://localhost:5001";
  }
  return "http://localhost:5001";
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

const REFRESH_ENDPOINT = "/api/admin/refresh-token";

// Auth failures the backend emits for a missing/expired/invalid access token.
// These are the only 401s that justify trying to refresh (see backend CLAUDE.md).
const EXPIRED_SESSION_MESSAGES = ["jwt expired", "Invalid token", "No token"];

// Single-flight refresh: concurrent 401s share one refresh call instead of each
// firing their own (which can race and rotate the refresh cookie out from under
// one another), and a hard failure is handled exactly once.
let refreshInFlight: Promise<string | null> | null = null;
let redirectingToLogin = false;

function clearStoredSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("admin-user");
  } catch {
    // Storage can be unavailable (private mode, SSR) — nothing to clear.
  }
}

function hasStoredSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(localStorage.getItem("token") || sessionStorage.getItem("token"));
  } catch {
    return false;
  }
}

function redirectToLogin() {
  if (typeof window === "undefined" || redirectingToLogin) return;
  if (window.location.pathname === "/login") return;
  redirectingToLogin = true;
  window.location.assign("/login");
}

function requestNewAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = api
      .post(REFRESH_ENDPOINT, undefined, { _skipAuthRefresh: true } as any)
      .then((res) =>
        res.status === 200 && res.data?.accessToken ? (res.data.accessToken as string) : null,
      )
      .catch(() => null)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

// Request interceptor to attach bearer token (browser only — the server has no
// session, so it must never send one).
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle 401 & token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.error;

    const isExpiredSession = status === 401 && EXPIRED_SESSION_MESSAGES.includes(message);

    const canRefresh =
      typeof window !== "undefined" &&
      isExpiredSession &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRefresh &&
      !originalRequest.url?.includes("/refresh-token");

    if (canRefresh) {
      originalRequest._retry = true;
      const hadSession = hasStoredSession();

      const newToken = await requestNewAccessToken();

      if (newToken) {
        try {
          if (localStorage.getItem("token")) localStorage.setItem("token", newToken);
          if (sessionStorage.getItem("token")) sessionStorage.setItem("token", newToken);
        } catch {
          // Ignore storage failures; the retried request still carries the token.
        }
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      // Refresh failed: the refresh cookie is missing, expired, revoked, or was
      // issued by a different backend/database than the one we're now calling.
      // Drop the dead session so nothing keeps replaying it, and — only if we
      // actually had a session — send the user back to sign in rather than
      // surfacing the raw "Invalid refresh token" error to every caller.
      clearStoredSession();
      if (hadSession) {
        redirectToLogin();
      }

      const sessionError: any = new Error("Your session has expired. Please sign in again.");
      sessionError.isSessionExpired = true;
      sessionError.config = originalRequest;
      return Promise.reject(sessionError);
    }

    return Promise.reject(error);
  },
);

export default api;
