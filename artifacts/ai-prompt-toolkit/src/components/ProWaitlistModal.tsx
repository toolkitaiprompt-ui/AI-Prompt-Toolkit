import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { joinWaitlist, getWaitlistStatus } from "../lib/waitlist";

interface ProWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export default function ProWaitlistModal({ isOpen, onClose, featureName }: ProWaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const { signedUp } = getWaitlistStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("loading");
    // Simulate a tiny delay for UX
    setTimeout(() => {
      joinWaitlist(trimmed);
      setStatus("success");
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md rounded-[24px] border border-white/10 bg-slate-900/95 backdrop-blur-xl p-8 shadow-2xl shadow-black/50"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5 transition text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {status === "success" || signedUp ? (
              /* Success state */
              <div className="text-center space-y-4 py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/20">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-2xl">🎉</p>
                <h3 className="text-xl font-bold text-white">You're on the list!</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We'll notify you when Pro features launch. You'll get early access + a lifetime discount.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 hover:shadow-xl transition"
                >
                  Got it! 🚀
                </button>
              </div>
            ) : (
              /* Signup form */
              <div className="space-y-5">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-400/20 mb-4">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                  <p className="text-2xl mb-2">🚀</p>
                  <h3 className="text-xl font-bold text-white">Pro is Coming Soon!</h3>
                  {featureName && (
                    <p className="text-sm text-amber-300 mt-1 font-medium">{featureName}</p>
                  )}
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Get early access + <span className="text-amber-300 font-semibold">lifetime discount</span>.
                    Be among the first to try premium AI prompt engineering features.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={status === "loading"}
                    className="w-full px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading" || !email.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[10px] text-slate-600 text-center">
                  No spam. Unsubscribe anytime. 🛡️
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
