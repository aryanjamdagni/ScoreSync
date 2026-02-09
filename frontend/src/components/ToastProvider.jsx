import { createContext, useContext, useCallback, useMemo, useState } from "react";

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

function ToastItem({ t, onClose }) {
  const tone =
    t.type === "success"
      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
      : t.type === "error"
      ? "border-red-400/40 bg-red-400/10 text-red-200"
      : "border-white/20 bg-white/10 text-white/85";

  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-xl backdrop-blur animate-slide-in ${tone}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm leading-relaxed">{t.message}</div>
        <button onClick={() => onClose(t.id)} className="text-xs opacity-70 hover:opacity-100" aria-label="Close toast">
          ✕
        </button>
      </div>
    </div>
  );
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info") => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 3500);
  }, []);

  const api = useMemo(() => ({ push }), [push]);

  const remove = (id) => setToasts((p) => p.filter((x) => x.id !== id));

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed right-5 top-5 z-200 w-90 space-y-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} t={t} onClose={remove} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
