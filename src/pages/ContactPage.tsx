import { useEffect, useState, type FormEvent } from "react";
import { Mail, SendHorizontal } from "lucide-react";
import SectionShell from "../components/SectionShell";

const EMPTY_CONTACT_DRAFT = { name: "", email: "", message: "" };

function parseContactDraft(raw: string | null) {
  if (!raw) return EMPTY_CONTACT_DRAFT;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed) &&
      typeof (parsed as { name?: unknown }).name === "string" &&
      typeof (parsed as { email?: unknown }).email === "string" &&
      typeof (parsed as { message?: unknown }).message === "string"
    ) {
      return parsed as typeof EMPTY_CONTACT_DRAFT;
    }
  } catch {}
  return EMPTY_CONTACT_DRAFT;
}

function ContactPage() {
  const [formData, setFormData] = useState(() =>
    parseContactDraft(localStorage.getItem("contact_draft")),
  );
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "fallback">("idle");
  const [fallbackMailto, setFallbackMailto] = useState("");
  const [copiedFallback, setCopiedFallback] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("contact_draft", JSON.stringify(formData));
    } catch {}
  }, [formData]);

  const onChangeField = (field: "name" | "email" | "message", value: string) =>
    setFormData((c: any) => ({ ...c, [field]: value }));

  const buildMailto = () => {
    const subject = `Contact from ${formData.name || "AI World Hub Visitor"}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}\n\n---\nSent from aiworldhub.site contact form (fallback)`;
    return `mailto:toolkitaiprompt@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setFallbackMailto("");

    // Try web3forms primary (with 12s timeout so a hung request never leaves
    // the form stuck on "sending" — it falls through to the mailto fallback)
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "0a57b145-da61-4b05-b7c4-31c90d681d36",
          botcheck: "",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New contact form submission from ${formData.name}`,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        try { localStorage.removeItem("contact_draft"); } catch {}
        return;
      }
      throw new Error("web3forms returned failure");
    } catch {
      // Fallback: build mailto + copy to clipboard (#12 fix)
      const mailto = buildMailto();
      setFallbackMailto(mailto);
      try {
        await navigator.clipboard.writeText(`To: toolkitaiprompt@gmail.com\nFrom: ${formData.name} <${formData.email}>\n\n${formData.message}`);
      } catch {}
      setStatus("fallback");
    }
  };

  return (
    <SectionShell
      title="Contact | AI World Hub"
      description="Contact AI World Hub for prompt engineering support, partnerships, and feedback. Email toolkitaiprompt@gmail.com."
    >
      <h1 className="text-3xl font-bold tracking-tight text-white">Contact</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Connect with the AI World Hub team for enterprise onboarding, partnerships, and technical collaboration.
      </p>
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Direct Contact</p>
          <a href="mailto:toolkitaiprompt@gmail.com" className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-white transition hover:text-blue-400">
            <Mail className="h-5 w-5" />
            toolkitaiprompt@gmail.com
          </a>
          <p className="mt-4 text-sm text-slate-400">Support Window: Monday–Friday, UTC business hours.</p>
        </aside>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7">
          <div className="grid gap-5">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Name</span>
              <input value={formData.name} onChange={(e) => onChangeField("name", e.target.value)} required
                className="w-full rounded-lg border border-slate-700 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-500" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Work Email</span>
              <input type="email" value={formData.email} onChange={(e) => onChangeField("email", e.target.value)} required
                className="w-full rounded-lg border border-slate-700 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-500" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Message</span>
              <textarea value={formData.message} onChange={(e) => onChangeField("message", e.target.value)} required rows={5}
                className="w-full rounded-lg border border-slate-700 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-blue-500" />
            </label>
            <input
              type="text"
              name="botcheck"
              value=""
              onChange={() => {}}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <button type="submit" disabled={status === "sending"}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-60">
              {status === "sending" ? "Sending..." : "Send Message"} <SendHorizontal className="h-4 w-4" />
            </button>
            {status === "success" && (
              <div role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-sm text-emerald-400">✓ Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}
            {status === "fallback" && (
              <div role="status" className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-sm font-medium text-amber-300">⚠️ Web3Forms unreachable — fallback ready</p>
                <p className="text-xs leading-5 text-slate-400">
                  Your message is saved locally and copied to clipboard. Click below to send via your email app — no data lost even if third-party service is down (fixes #12).
                </p>
                <div className="flex flex-wrap gap-2">
                  {fallbackMailto && (
                    <a
                      href={fallbackMailto}
                      className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-400"
                    >
                      📧 Open Mail App
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(formData.message);
                        setCopiedFallback(true);
                        setTimeout(() => setCopiedFallback(false), 2000);
                      } catch {}
                    }}
                    className="rounded-full border border-slate-600 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
                  >
                    {copiedFallback ? "✓ Copied!" : "Copy Message"}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">Direct email: <a href="mailto:toolkitaiprompt@gmail.com" className="text-amber-400 underline break-all">toolkitaiprompt@gmail.com</a></p>
                <p className="text-[11px] text-slate-500">Draft auto-saved in browser</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </SectionShell>
  );
}

export default ContactPage;
