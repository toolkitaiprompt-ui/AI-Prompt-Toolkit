import { ArrowRight, Check, CircleCheck, FileText, LockKeyhole, Sparkles } from "lucide-react";

const CHECKOUT_URL = import.meta.env.VITE_CREATOR_PROMPT_KIT_CHECKOUT_URL?.trim();
const CONTACT_URL = "mailto:toolkitaiprompt@gmail.com?subject=Creator%20%26%20Freelancer%20Prompt%20Kit%20launch%20link";

const COVERAGE = [
  { title: "YouTube", detail: "Video ideas, titles, hooks, scripts, descriptions, chapters and repurposing." },
  { title: "Thumbnails", detail: "Briefs, visual concepts, text hierarchy, A/B variations and image-model prompts." },
  { title: "Instagram & Reels", detail: "Reel frameworks, carousels, captions, content calendars and community replies." },
  { title: "Freelancing", detail: "Proposals, discovery questions, scope documents, follow-ups and client updates." },
  { title: "Client email", detail: "Onboarding, revisions, project status, handoffs, difficult conversations and renewals." },
  { title: "SEO", detail: "Keyword briefs, outlines, on-page optimization, internal links and content refreshes." },
  { title: "Coding", detail: "Feature briefs, debugging, code review, documentation, tests and release notes." },
  { title: "Business", detail: "Offer positioning, research plans, SOPs, sales enablement and decision frameworks." },
  { title: "Content", detail: "Blogs, newsletters, social repurposing, editorial calendars and brand voice systems." },
  { title: "AI workflows", detail: "Step-by-step workflows for ChatGPT, Claude and Gemini with inputs and outputs." },
];

const DELIVERY_STEPS = [
  "A secure digital checkout link is configured before launch.",
  "The buyer receives a protected download or purchase-library access from the selected payment platform.",
  "The delivered kit includes an update policy, version date and clear model-specific usage notes.",
];

export default function CreatorPromptKitPage() {
  const actionHref = CHECKOUT_URL || CONTACT_URL;
  const actionLabel = CHECKOUT_URL ? "Buy securely for $19" : "Request the launch link";

  return (
    <div className="bg-[#0a0a0f] text-slate-100">
      <section className="relative overflow-hidden border-b border-amber-400/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(245,158,11,0.16),transparent_32%),radial-gradient(circle_at_82%_35%,rgba(168,85,247,0.14),transparent_28%)]" aria-hidden="true" />
        <div className="site-container relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-amber-200">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              DIGITAL PRODUCT — IN PREPARATION
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              AI Creator &amp; Freelancer Prompt Kit
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              A paid, practical prompt library for creators and freelancers who need clearer outputs, faster client work and repeatable AI workflows.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={actionHref}
                target={CHECKOUT_URL ? "_blank" : undefined}
                rel={CHECKOUT_URL ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
              >
                {actionLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="text-sm text-slate-400">Planned launch price: <strong className="font-semibold text-slate-200">$19</strong></span>
            </div>
            <a href="/pdf-workspace" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100">Try the local PDF workspace preview <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <main className="site-container py-12 sm:py-16">
        <section className="grid gap-5 md:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">What is being built</p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">A real prompt product, not a copied list</h2>
            <p className="mt-4 leading-7 text-slate-300">
              The kit will be built from AI World Hub&apos;s existing 225 structured prompts, then expanded with creator and freelancer-specific workflows. Every included prompt must state its goal, required inputs and expected output so buyers can adapt it instead of receiving vague one-line ideas.
            </p>
            <p className="mt-4 leading-7 text-slate-400">
              The package is intentionally not advertised as “tested” until its prompts have been quality-checked across the stated models and the final count is complete. This page therefore describes the product scope truthfully while checkout and protected delivery are prepared.
            </p>
          </div>

          <aside className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-purple-500/10 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-amber-200">
              <FileText className="h-5 w-5" aria-hidden="true" />
              <span className="font-semibold">Launch deliverable</span>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-200">
              <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />500+ ready-to-use prompts after the final quality pass.</li>
              <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />Model-aware workflows for ChatGPT, Claude and Gemini.</li>
              <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />Clear variables, use cases and copy-ready formatting.</li>
              <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />Versioned product delivery—not a public repository download.</li>
            </ul>
          </aside>
        </section>

        <section className="mt-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">Planned coverage</p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Built for the work people actually sell</h2>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {COVERAGE.map((area) => (
              <article key={area.title} className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <h3 className="font-bold text-white">{area.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{area.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-white/10 bg-[#11111a] p-6 sm:p-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-slate-100"><LockKeyhole className="h-5 w-5 text-amber-300" aria-hidden="true" /><h2 className="text-2xl font-bold">Secure delivery is a launch requirement</h2></div>
              <p className="mt-3 leading-7 text-slate-400">Premium prompts will not be embedded in the public website source, because browser-only gating would expose them. Checkout and the product file will be connected through a real payment and delivery platform before the page claims that buying is available.</p>
            </div>
            <ol className="max-w-xl space-y-3 text-sm leading-6 text-slate-300">
              {DELIVERY_STEPS.map((step) => <li key={step} className="flex gap-3"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />{step}</li>)}
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}
