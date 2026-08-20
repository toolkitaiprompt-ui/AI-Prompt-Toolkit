import { BookOpen, Lightbulb, ListOrdered } from "lucide-react";

interface Example {
  title: string;
  before: string;
  after: string;
  note?: string;
}

export function ToolGuide({
  intro,
  steps,
  example,
}: {
  intro: string;
  steps: string[];
  example?: Example;
}) {
  return (
    <div className="space-y-6 pt-2">
      {/* Intro — what it does + who it is for */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold text-white">What this tool does</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">{intro}</p>
          </div>
        </div>
      </div>

      {/* How to use — 3 to 5 steps */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-start gap-3">
          <ListOrdered className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-white">How to use it</h2>
            <ol className="mt-3 space-y-2.5">
              {steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-sm leading-7 text-slate-400">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Real example */}
      {example && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-white">Real example</h2>
              <p className="mt-1 text-sm text-slate-500">{example.title}</p>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg border border-red-500/20 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Before</p>
                  <pre className="mt-2 whitespace-pre-wrap text-xs leading-6 text-slate-400">{example.before}</pre>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">After</p>
                  <pre className="mt-2 whitespace-pre-wrap text-xs leading-6 text-slate-300">{example.after}</pre>
                </div>
              </div>
              {example.note && (
                <p className="mt-3 text-sm leading-6 text-slate-500">{example.note}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolGuide;
