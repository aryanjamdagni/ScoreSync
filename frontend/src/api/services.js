import { http } from "./http";

const MOCK = String(import.meta.env.VITE_MOCK || "false") === "true";
export const AuthService = {
  async login(email, password) {
    if (MOCK) throw new Error("Mock disabled. Set VITE_MOCK=true to use mock.");
    const { data } = await http.post("/api/auth/login", { email, password });
    return data;
  },

  async register(payload) {
    if (MOCK) throw new Error("Mock disabled. Set VITE_MOCK=true to use mock.");
    const { data } = await http.post("/api/auth/register", payload);
    return data;
  },

  async me() {
    const { data } = await http.get("/api/auth/me");
    return data;
  },

  async changePassword(payload) {
    const { data } = await http.patch("/api/auth/change-password", payload);
    return data;
  }
};

export const AdminService = {
  async stats() {
    const { data } = await http.get("/api/admin/stats");
    return {
      totalUsers: data.totalUsers,
      totalStores: data.totalStores,
      totalRatings: data.totalRatings
    };
  },

  async listUsers(params = {}) {
    const { data } = await http.get("/api/admin/users", { params });
    return data.users;
  },

  async addUser(payload) {
    const { data } = await http.post("/api/admin/users", payload);
    return data.user;
  },

  async listStores(params = {}) {
    const { data } = await http.get("/api/admin/stores", { params });
    return data.stores;
  },

  async addStore(payload) {
    const { data } = await http.post("/api/admin/stores", payload);
    return data.store;
  }
};

export const UserService = {
  async listStores(userIdIgnored) {
    const { data } = await http.get("/api/stores", { params: { q: "" } });
    return data.stores;
  },

  async rateStore(storeId, value) {
    const { data } = await http.put(`/api/stores/${storeId}/rating`, { value });
    return data;
  }
};

export const OwnerService = {
  async dashboard(ownerIdIgnored) {
    const { data } = await http.get("/api/owner/dashboard");
    return data;
  }
};

export const NotificationService = {
  async list() {
    const { data } = await http.get("/api/notifications");
    return Array.isArray(data?.items) ? data.items : [];
  },
  async markRead(id) {
    const { data } = await http.patch(`/api/notifications/${id}/read`);
    return data;
  },
  async markAllRead() {
    const { data } = await http.patch("/api/notifications/read-all");
    return data;
  },
};
