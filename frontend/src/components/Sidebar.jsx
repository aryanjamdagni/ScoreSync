import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Users,
  User,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

const linkBase =
  "relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition select-none";
const idle = "text-white/75 hover:bg-white/6";
const active = "text-white bg-white/8 border border-white/12";

function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const a = (parts[0]?.[0] || "U").toUpperCase();
  const b = (parts[1]?.[0] || "").toUpperCase();
  return (a + b).slice(0, 2);
}

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();

  const menu = useMemo(() => {
    if (!user) return [];
    if (user.role === "ADMIN")
      return [
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/stores", label: "Stores", icon: Store },
        { to: "/admin/users", label: "Users", icon: Users },
      ];
    if (user.role === "OWNER")
      return [
        { to: "/owner", label: "Store Dashboard", icon: BarChart3 },
        { to: "/owner/profile", label: "My Profile", icon: User },
      ];
    return [
      { to: "/user", label: "Browse Stores", icon: Store },
      { to: "/user/profile", label: "My Profile", icon: User },
    ];
  }, [user]);

  const w = collapsed ? 88 : 292;

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="h-screen shrink-0 border-r border-white/10 bg-black/25 backdrop-blur"
    >
      <div className="h-full flex flex-col p-4 gap-4">
        <div className="ss-surface rounded-3xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-cyan-300/90 to-blue-500/90" />
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-base font-extrabold leading-5 truncate">
                  ScoreSync
                </div>
                <div className="text-[11px] text-white/60 mt-1">
                  Role: {user?.role || "USER"}
                </div>
              </div>
            )}

            <button
              onClick={() => setCollapsed?.((v) => !v)}
              className={[
                "ml-auto ss-iconbtn",
                "p-0 h-10 w-10 grid place-items-center",
                "hover:shadow-[0_0_0_4px_rgba(79,209,255,0.12)]",
              ].join(" ")}
              title={collapsed ? "Expand" : "Collapse"}
              aria-label="Toggle sidebar"
              type="button"
            >
              {collapsed ? (
                <ChevronRight size={18} className="text-white/80" />
              ) : (
                <ChevronLeft size={18} className="text-white/80" />
              )}
            </button>
          </div>
        </div>

        <div className="ss-surface rounded-3xl p-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/8 border border-white/12 grid place-items-center font-extrabold">
              {initials(user?.name)}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">
                  {user?.name || "Account"}
                </div>
                <div className="text-xs text-white/55 truncate">
                  {user?.email || ""}
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {menu.map((m) => {
            const Icon = m.icon;
            return (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.to === "/admin" || m.to === "/user" || m.to === "/owner"}
                className={({ isActive }) =>
                  [
                    linkBase,
                    isActive ? active : idle,
                    collapsed ? "justify-center px-2" : "",
                    isActive ? "shadow-[0_0_0_4px_rgba(79,209,255,0.10)]" : "",
                    "hover:shadow-[0_0_0_4px_rgba(79,209,255,0.06)]",
                  ].join(" ")
                }
                title={collapsed ? m.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        "absolute left-0 top-1/2 -translate-y-1/2 h-9 w-1 rounded-r-full",
                        "bg-cyan-300/70 transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                    />
                    <span className="h-10 w-10 rounded-2xl grid place-items-center bg-white/4 border border-white/10 hover:border-white/16 transition">
                      <Icon size={18} className="text-white/80" />
                    </span>
                    {!collapsed && (
                      <span className="truncate">
                        {m.label}
                        <span className="block text-[11px] font-normal text-white/45 -mt-0.5">
                          {m.to}
                        </span>
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className={[
            "ss-surface rounded-3xl px-4 py-3 flex items-center gap-3",
            "hover:bg-white/8 transition active:scale-[0.99]",
            collapsed ? "justify-center px-3" : "",
          ].join(" ")}
          type="button"
          title={collapsed ? "Logout" : undefined}
        >
          <span className="h-10 w-10 rounded-2xl grid place-items-center bg-white/4 border border-white/10">
            <LogOut size={18} className="text-white/80" />
          </span>
          {!collapsed && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
