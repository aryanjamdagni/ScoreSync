import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { validateSignup } from "../../utils/validators";
import { normalizeApiError } from "../../utils/apiError";
import { useToast } from "../../components/ToastProvider";

export default function Signup() {
  const nav = useNavigate();
  const { signup } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerErr("");

    const eMap = validateSignup(form);
    setErrors(eMap);
    if (Object.keys(eMap).length) {
      toast.push("Fix the highlighted fields.", "error");
      return;
    }

    setLoading(true);
    try {
      await signup(form);
      toast.push("Account created. Please sign in.", "success");
      nav("/login");
    } catch (ex) {
      const n = normalizeApiError(ex);
      setServerErr(n.message);
      toast.push(n.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ msg }) =>
    msg ? <div className="mt-1 text-xs text-red-300">{msg}</div> : null;

  return (
    <div className="min-h-screen px-4 py-10 md:py-14 grid place-items-center">
      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        <div className="ss-surface rounded-[28px] p-7 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.25 }}
            className="flex items-center gap-3"
          >
            <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-cyan-300 to-blue-500 shadow-lg" />
            <div>
              <div className="text-2xl font-extrabold tracking-tight">
                Create ScoreSync account
              </div>
              <div className="text-sm text-white/60 mt-1">
                Only Normal Users can sign up here (per challenge).
              </div>
            </div>
          </motion.div>

          {serverErr ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {serverErr}
            </motion.div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-7 grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm text-white/70">Name (20–60 chars)</label>
              <input
                value={form.name}
                onChange={onChange("name")}
                className="mt-2 w-full input px-4 py-3"
                placeholder="Enter full name"
              />
              <FieldError msg={errors.name} />
            </div>

            <div>
              <label className="text-sm text-white/70">Email</label>
              <input
                value={form.email}
                onChange={onChange("email")}
                className="mt-2 w-full input px-4 py-3"
                placeholder="user@email.com"
                autoComplete="email"
              />
              <FieldError msg={errors.email} />
            </div>

            <div>
              <label className="text-sm text-white/70">Address (max 400 chars)</label>
              <textarea
                value={form.address}
                onChange={onChange("address")}
                rows={3}
                className="mt-2 w-full input px-4 py-3"
                placeholder="Enter address"
              />
              <FieldError msg={errors.address} />
            </div>

            <div>
              <label className="text-sm text-white/70">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={onChange("password")}
                className="mt-2 w-full input px-4 py-3"
                placeholder="Hello@123"
                autoComplete="new-password"
              />
              <FieldError msg={errors.password} />
              <div className="mt-1 text-xs text-white/50">
                8–16 chars, 1 uppercase, 1 special
              </div>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="mt-2 w-full btn-primary rounded-2xl px-4 py-3 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </motion.button>

            <div className="text-sm text-white/60">
              Already have an account?{" "}
              <Link className="text-cyan-300 font-semibold hover:underline" to="/login">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
