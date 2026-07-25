import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

const BUTTONDOWN_USERNAME = "aiworldhub";
const BUTTONDOWN_URL = `https://buttondown.email/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`;
const HOSTED_URL = `https://buttondown.email/${BUTTONDOWN_USERNAME}`;

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("loading");

    try {
      const res = await fetch(BUTTONDOWN_URL, {
        method: "POST",
        mode: "no-cors", // Required for cross-origin submission
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: trimmed }),
      });

      // With no-cors, we can't read the response status reliably
      // So we assume success after a short delay
      setStatus("success");
      setEmail("");
    } catch {
      // Fallback: show error with link to hosted form
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-slate-950/90 p-8 sm:p-12 shadow-2xl overflow-hidden relative"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

      <div className="relative max-w-xl mx-auto text-center space-y-6">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-400/20 mb-2">
          <Sparkles className="w-6 h-6 text-amber-300" />
        </div>

        {/* Heading */}
        <h3 className="text-2xl sm:text-3xl font-bold text-white">
          Get Smarter at Prompting{" "}
          <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
            🧠
          </span>
        </h3>

        {/* Subtext */}
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Weekly tips &amp; templates to level up your prompt engineering game.
          <br />
          <span className="text-amber-300 font-medium">Free forever. No spam. Unsubscribe anytime.</span>
        </p>

        {/* Form */}
        {status === "success" ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-base font-semibold text-emerald-300">🎉 Welcome aboard! Check your email.</p>
            <p className="text-xs text-slate-500 mt-2">We just sent you a confirmation. See you in your inbox! 📬</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
              placeholder="you@example.com"
              required
              disabled={status === "loading"}
              className="flex-1 px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/10 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || !email.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe Free
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Error fallback */}
        {status === "error" && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
            <p className="text-sm text-rose-300 font-medium">😅 Oops! Something went wrong.</p>
            <p className="text-xs text-slate-400 mt-1">
              Try subscribing directly:{" "}
              <a
                href={HOSTED_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 underline hover:text-amber-300"
              >
                Subscribe here
              </a>
            </p>
          </div>
        )}

        {/* Social proof */}
        {status !== "success" && (
          <p className="text-xs text-slate-600 flex items-center justify-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Join <span className="text-slate-400 font-semibold">500+</span> prompt engineers
          </p>
        )}
      </div>
    </motion.div>
  );
}
