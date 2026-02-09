import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";

function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const a = (parts[0]?.[0] || "U").toUpperCase();
  const b = (parts[1]?.[0] || "").toUpperCase();
  return (a + b).slice(0, 2);
}

function titleFor(pathname, role) {
  if (role === "ADMIN") {
    if (pathname === "/admin") return "System Administrator Dashboard";
    if (pathname.includes("/admin/stores")) return "Manage Stores";
    if (pathname.includes("/admin/users")) return "Manage Users";
  }
  if (role === "OWNER") {
    if (pathname === "/owner") return "Store Owner Dashboard";
    if (pathname.includes("/owner/profile")) return "My Profile";
  }
  if (role === "USER") {
    if (pathname === "/user") return "Browse Stores";
    if (pathname.includes("/user/profile")) return "My Profile";
  }
  return "Dashboard";
}

export default function Topbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById("app-scroll");
    if (!el) return;

    const onScroll = () => setScrolled(el.scrollTop > 6);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const title = useMemo(() => titleFor(pathname, user?.role), [pathname, user?.role]);

  return (
    <header
      className={[
        "sticky top-0 z-50 h-18.5 w-full px-6 flex items-center justify-between",
        "backdrop-blur bg-black/18 border-b border-white/10",
        scrolled ? "shadow-[0_18px_40px_rgba(0,0,0,0.55)]" : "",
      ].join(" ")}
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="text-[11px] tracking-[0.35em] text-white/55 font-semibold">
          WELCOME
        </div>
        <div className="text-lg md:text-xl font-extrabold tracking-tight">
          {title}
        </div>
        <div className="text-xs text-white/50 mt-1">{pathname}</div>
      </motion.div>

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="relative ss-iconbtn"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={18} className="text-white/80" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold grid place-items-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </motion.button>

        <div className="ss-surface rounded-2xl px-3 py-2 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/8 border border-white/12 grid place-items-center font-bold">
            {initials(user?.name)}
          </div>
          <div className="leading-tight">
            <div className="text-xs text-white/60">Online</div>
            <div className="text-sm font-semibold">{user?.role || "USER"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
