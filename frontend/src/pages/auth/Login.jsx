import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { isValidEmail } from "../../utils/validators";
import { normalizeApiError } from "../../utils/apiError";
import { useToast } from "../../components/ToastProvider";

function Badge({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white/90">{value}</div>
    </div>
  );
}

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("Admin@123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const mockCreds = useMemo(
    () => [
      { role: "ADMIN", email: "admin@test.com", pass: "Admin@123" },
      { role: "USER", email: "user@test.com", pass: "User@1234" },
      { role: "OWNER", email: "owner@test.com", pass: "Owner@123" },
    ],
    []
  );

  const fill = (c) => {
    setEmail(c.email);
    setPassword(c.pass);
    toast.push(`${c.role} credentials filled.`, "success");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!isValidEmail(email)) {
      setErr("Enter a valid email.");
      toast.push("Enter a valid email.", "error");
      return;
    }
    if (!password) {
      setErr("Password is required.");
      toast.push("Password is required.", "error");
      return;
    }

    setLoading(true);
    try {
      const u = await login(email, password);
      toast.push("Welcome to ScoreSync.", "success");

      if (u.role === "ADMIN") nav("/admin");
      else if (u.role === "OWNER") nav("/owner");
      else nav("/user");
    } catch (ex) {
      const n = normalizeApiError(ex);
      setErr(n.message);
      toast.push(n.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 md:py-14 grid place-items-center">
      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-6xl"
      >
        <div className="ss-surface rounded-[28px] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Brand Panel */}
            <div className="p-7 md:p-10 border-b md:border-b-0 md:border-r border-white/10 bg-black/15">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, duration: 0.28 }}
                className="flex items-center gap-3"
              >
                <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-cyan-300 to-blue-500 shadow-lg" />
                <div className="min-w-0">
                  <div className="text-2xl font-extrabold tracking-tight">
                    ScoreSync
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    Role-based store ratings platform
                  </div>
                </div>
              </motion.div>

              <div className="mt-8 space-y-4">
                <div className="card p-5">
                  <div className="text-base font-semibold">What you can do</div>
                  <ul className="mt-3 text-sm text-white/70 list-disc pl-5 space-y-1">
                    <li>Admins manage users & stores</li>
                    <li>Users rate stores (1–5) & update ratings</li>
                    <li>Store owners view average + raters list</li>
                  </ul>
                </div>

                <div className="card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold">Mock accounts</div>
                    <div className="text-xs text-white/55">
                      (VITE_MOCK=true)
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {mockCreds.map((c) => (
                      <button
                        key={c.role}
                        type="button"
                        onClick={() => fill(c)}
                        className="text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 transition px-4 py-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold">{c.role}</div>
                          <div className="text-xs text-white/55">Tap to fill</div>
                        </div>
                        <div className="mt-1 text-xs text-white/70">
                          {c.email} / {c.pass}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-white/50">
                    Tip: switch to real backend using <b>VITE_MOCK=false</b>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Badge label="Security" value="RBAC + Validations" />
                  <Badge label="UX" value="Transitions + Toasts" />
                </div>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="p-7 md:p-10">
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08, duration: 0.28 }}
              >
                <div className="text-3xl font-extrabold tracking-tight">
                  Sign in
                </div>
                <div className="mt-1 text-sm text-white/60">
                  Access your dashboard.
                </div>

                {err ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {err}
                  </motion.div>
                ) : null}

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm text-white/70">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full input px-4 py-3"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white/70">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 w-full input px-4 py-3"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>

                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full btn-primary rounded-2xl px-4 py-3 disabled:opacity-60"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </motion.button>

                  <div className="text-sm text-white/60">
                    Normal user?{" "}
                    <Link
                      className="text-cyan-300 font-semibold hover:underline"
                      to="/signup"
                    >
                      Create account
                    </Link>
                  </div>

                  <div className="text-xs text-white/45">
                    If you see “Validation failed”, your backend is rejecting the
                    request. (Mock Mode bypasses backend.)
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
 