import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

function useLockBody(open) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
}

function getFocusable(container) {
  if (!container) return [];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(container.querySelectorAll(selectors.join(","))).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
  );
}

const WIDTH = {
  sm: "max-w-[520px]",
  md: "max-w-[720px]",
  lg: "max-w-[920px]",
};

export default function Modal({
  open,
  title = "Modal",
  onClose,
  width = "md",
  footer = null,
  children,
}) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useLockBody(open);

  const widthClass = useMemo(() => WIDTH[width] || WIDTH.md, [width]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusFirst = () => {
      const focusables = getFocusable(panel);
      const first = focusables[0];
      if (first && typeof first.focus === "function") first.focus();
      else panel.focus?.();
    };

    const t = setTimeout(focusFirst, 0);

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (e.key === "Tab") {
        const focusables = getFocusable(panel);
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 grid place-items-center p-4">
          <motion.button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onCloseRef.current?.()}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className={[
              "relative w-full",
              widthClass,
              "rounded-3xl overflow-hidden",
              "bg-[#0b1623]",
              "border border-white/18",
              "shadow-[0_30px_80px_rgba(0,0,0,0.75)]",
            ].join(" ")}
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.985 }}
            transition={{ duration: 0.22 }}
          >
            <div className="px-6 py-4 border-b border-white/12 flex items-center justify-between bg-[#0a141f]">
              <div className="min-w-0">
                <div className="text-lg font-extrabold truncate">{title}</div>
              </div>

              <button
                type="button"
                onClick={() => onCloseRef.current?.()}
                className="ss-iconbtn h-10 w-10 grid place-items-center p-0"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-6">{children}</div>

            {footer ? (
              <div className="px-6 py-4 border-t border-white/12 bg-[#0a141f]">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
