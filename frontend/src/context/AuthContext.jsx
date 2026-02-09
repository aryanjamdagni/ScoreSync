import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthService } from "../api/services";
import { normalizeApiError } from "../utils/apiError";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const token = localStorage.getItem("scoresync_token");
      if (!token) {
        if (alive) setBooting(false);
        return;
      }
      try {
        const res = await AuthService.me();
        if (alive) setUser(res.user);
      } catch {
        localStorage.removeItem("scoresync_token");
        if (alive) setUser(null);
      } finally {
        if (alive) setBooting(false);
      }
    })();
    return () => (alive = false);
  }, []);

  const login = async (email, password) => {
    const res = await AuthService.login(email, password);
    if (!res?.token || !res?.user) throw new Error("Login failed");
    localStorage.setItem("scoresync_token", res.token);
    setUser(res.user);
    return res.user;
  };

  const signup = async (payload) => {
    const res = await AuthService.register(payload);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("scoresync_token");
    setUser(null);
    window.location.href = "/login";
  };

  const changePassword = async (payload) => {
    try {
      await AuthService.changePassword(payload);
    } catch (e) {
      throw normalizeApiError(e);
    }
  };

  const value = useMemo(
    () => ({
      user,
      booting,
      isAuthed: !!user,
      login,
      signup,
      logout,
      changePassword,
    }),
    [user, booting]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
