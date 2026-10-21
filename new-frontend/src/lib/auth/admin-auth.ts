import api from "../axios";

export interface AdminUser {
  id: string;
  username: string;
  role: string;
}

export const adminAuth = {
  async login(username: string, password: string): Promise<{ user: AdminUser; token: string }> {
    const res = await api.post("/api/admin/login", { username, password });
    const token = res.data?.accessToken || res.data?.token;
    const user = res.data?.user || { id: "admin", username, role: "admin" };

    if (typeof window !== "undefined" && token) {
      localStorage.setItem("token", token);
      sessionStorage.setItem("token", token);
      localStorage.setItem("admin-user", JSON.stringify(user));
    }

    return { user, token };
  },

  async logout(): Promise<void> {
    try {
      await api.post("/api/admin/logout");
    } catch {
      // Ignore
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("admin-user");
      }
    }
  },

  getCurrentUser(): AdminUser | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("admin-user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("token") || sessionStorage.getItem("token"));
  },
};
