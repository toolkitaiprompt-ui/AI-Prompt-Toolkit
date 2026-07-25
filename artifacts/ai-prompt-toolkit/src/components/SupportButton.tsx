import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";

const DISMISS_KEY = "aiwh_support_dismissed";
const BMC_URL = "https://buymeacoffee.com/aiworldhub";

export default function SupportButton() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [hovered, setHovered] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Pulse every 30s (once per trigger, with animation key change)
  useEffect(() => {
    if (dismissed) return;
    intervalRef.current = setInterval(() => {
      setPulseKey((k) => k + 1);
    }, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {}
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
      <AnimatePresence>
        {hovered && (
          <motion.a
            href={BMC_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 10, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "auto" }}
            exit={{ opacity: 0, x: 10, width: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap rounded-full bg-amber-500/10 border border-amber-400/20 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 transition-all"
          >
            Support Us ☕
          </motion.a>
        )}
      </AnimatePresence>

      <motion.a
        href={BMC_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={
          pulseKey > 0
            ? { scale: [1, 1.12, 1], transition: { duration: 0.5 } }
            : {}
        }
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-110 transition-all duration-300 cursor-pointer"
        aria-label="Support us on Buy Me a Coffee"
      >
        <span className="text-lg leading-none">☕</span>
      </motion.a>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-all opacity-60 hover:opacity-100"
        aria-label="Dismiss support button"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
