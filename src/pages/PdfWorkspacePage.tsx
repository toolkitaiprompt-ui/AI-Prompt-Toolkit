import { ChangeEvent, useMemo, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { ArrowRight, Copy, Download, FileText, FileUp, Languages, LockKeyhole, MessageSquareText, NotebookPen, TableProperties } from "lucide-react";

GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_PROMPT_CHARS = 24_000;

type Workflow = "summary" | "questions" | "notes" | "quiz" | "key-points" | "tables" | "translation";

const WORKFLOWS: { id: Workflow; label: string; description: string; icon: typeof FileText }[] = [
  { id: "summary", label: "Summary", description: "Executive summary with evidence", icon: FileText },
  { id: "questions", label: "Ask questions", description: "Question-answering prompt", icon: MessageSquareText },
  { id: "notes", label: "Notes", description: "Structured study or work notes", icon: NotebookPen },
  { id: "quiz", label: "Quiz", description: "Recall questions with answers", icon: NotebookPen },
  { id: "key-points", label: "Key points", description: "Claims, facts and actions", icon: FileText },
  { id: "tables", label: "Tables", description: "Structured table-recovery prompt", icon: TableProperties },
  { id: "translation", label: "Translate", description: "Hindi or English translation prompt", icon: Languages },
];

function makeWorkflowPrompt(workflow: Workflow, text: string, question: string, language: string) {
  const source = text.length > MAX_PROMPT_CHARS
    ? `${text.slice(0, MAX_PROMPT_CHARS)}\n\n[The browser preview is truncated here. Ask the user to provide the remaining pages before making claims about them.]`
    : text;

  const instructions: Record<Workflow, string> = {
    summary: "Write a concise, factual executive summary. State the document purpose, key findings, decisions, risks and action items. Do not invent information; flag missing information.",
    questions: `Answer this question using only the document: ${question.trim() || "[Add your question before copying.]"} Cite the page number where possible. If the document does not answer it, say so clearly.`,
    notes: "Turn this document into structured notes with headings, definitions, key evidence, examples, open questions and a short next-actions section. Preserve important numbers and do not invent details.",
    quiz: "Create a practical quiz with 10 questions of mixed difficulty. Give the answer and a short explanation after each question. Use only facts supported by the document.",
    "key-points": "List the most important facts, claims, decisions, deadlines, figures and action items. Separate confirmed facts from recommendations or opinions in the document.",
    tables: "Recover any tables from this extracted PDF text into Markdown tables. Preserve headers and values exactly where possible. When table structure is ambiguous, state the ambiguity instead of guessing.",
    translation: `Translate the supplied text into ${language}. Preserve headings, lists, names, numbers and terminology. Do not summarize or add information.`,
  };

  return `You are a careful document analyst. ${instructions[workflow]}\n\nDOCUMENT TEXT (extracted locally in the user's browser):\n---\n${source}\n---`;
}

export default function PdfWorkspacePage() {
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Upload a text-based PDF to begin. The file stays in this browser.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflow, setWorkflow] = useState<Workflow>("summary");
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("Hindi");
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => makeWorkflowPrompt(workflow, text, question, language), [language, question, text, workflow]);
  const activeWorkflow = WORKFLOWS.find((item) => item.id === workflow)!;

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setStatus("Please choose a PDF file.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setStatus("This local preview accepts PDFs up to 20 MB.");
      return;
    }

    setIsProcessing(true);
    setText("");
    setPageCount(0);
    setFileName(file.name);
    setStatus("Extracting text locally—nothing is uploaded.");

    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await getDocument({ data }).promise;
      const pages: string[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        pages.push(`[Page ${pageNumber}]\n${pageText}`);
      }

      const extracted = pages.join("\n\n").trim();
      setText(extracted);
      setPageCount(pdf.numPages);
      setStatus(extracted
        ? `Ready: ${pdf.numPages} page${pdf.numPages === 1 ? "" : "s"} extracted locally. Choose a workflow below.`
        : "No selectable text was found. This appears to be a scanned PDF; OCR requires the future server-side AI workflow.");
    } catch {
      setStatus("This PDF could not be read. Try a non-password-protected, text-based PDF.");
      setFileName("");
    } finally {
      setIsProcessing(false);
    }
  }

  async function copyPrompt() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setStatus("Copy was blocked by the browser. Select the prompt text manually.");
    }
  }

  function downloadText() {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(/\.pdf$/i, "") || "document"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-[#0a0a0f] text-slate-100">
      <section className="border-b border-cyan-300/15 bg-[radial-gradient(circle_at_16%_20%,rgba(34,211,238,0.13),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(168,85,247,0.15),transparent_28%)]">
        <div className="site-container py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-cyan-100"><LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />LOCAL-FIRST PDF PREVIEW</p>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl">AI PDF → Everything</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300 sm:text-xl">Start with browser-local PDF text extraction, then create accurate prompts for summaries, questions, notes, quizzes, key points, tables and Hindi/English translation.</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">This preview does not upload your PDF or call an AI provider. Automatic AI answers, OCR, paid quotas and account access require the secure backend that is not connected yet.</p>
          </div>
        </div>
      </section>

      <main className="site-container py-10 sm:py-14">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-xl font-bold text-white">1. Extract PDF text locally</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Text-based PDFs only, up to 20 MB. Scanned pages need OCR, which will be part of the authenticated server version.</p>
            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-cyan-200/30 bg-cyan-200/[0.035] px-5 py-9 text-center transition hover:border-cyan-200/60 hover:bg-cyan-200/[0.07]">
              <FileUp className="h-8 w-8 text-cyan-200" aria-hidden="true" />
              <span className="mt-3 font-semibold text-white">Choose a PDF from this device</span>
              <span className="mt-1 text-xs text-slate-400">The file is read in this browser and is not uploaded.</span>
              <input className="sr-only" type="file" accept="application/pdf" onChange={handleFileChange} disabled={isProcessing} />
            </label>
            <p className="mt-4 rounded-lg bg-black/20 px-3 py-3 text-sm leading-6 text-slate-300" role="status">{status}</p>
            {text && <button type="button" onClick={downloadText} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.05]"><Download className="h-4 w-4" aria-hidden="true" />Download extracted .txt</button>}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#11111a] p-6">
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="text-xl font-bold text-white">2. Choose an AI workflow</h2><p className="mt-2 text-sm leading-6 text-slate-400">Create a document-grounded prompt for your preferred AI model. No results are fabricated in the browser.</p></div>
              {pageCount > 0 && <span className="shrink-0 rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300">{pageCount} pages</span>}
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {WORKFLOWS.map((item) => {
                const Icon = item.icon;
                const selected = workflow === item.id;
                return <button key={item.id} type="button" onClick={() => setWorkflow(item.id)} className={`rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-200 ${selected ? "border-cyan-200/60 bg-cyan-200/10" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}><span className="flex items-center gap-2 font-semibold text-white"><Icon className="h-4 w-4 text-cyan-200" aria-hidden="true" />{item.label}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{item.description}</span></button>;
              })}
            </div>

            {workflow === "questions" && <label className="mt-5 block text-sm font-medium text-slate-200">Your question<textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="For example: What decision does this document recommend?" className="mt-2 min-h-20 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-200/60" /></label>}
            {workflow === "translation" && <label className="mt-5 block text-sm font-medium text-slate-200">Translate into<select value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-[#151520] px-3 py-2 text-sm text-white outline-none focus:border-cyan-200/60"><option>Hindi</option><option>English</option></select></label>}

            <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-100">{activeWorkflow.label} prompt preview</p>
              <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap break-words font-sans text-xs leading-6 text-slate-300">{text ? prompt : "Upload a text-based PDF to generate a document-grounded prompt."}</pre>
            </div>
            <button type="button" onClick={copyPrompt} disabled={!text} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-45"><Copy className="h-4 w-4" aria-hidden="true" />{copied ? "Copied" : "Copy workflow prompt"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-300/[0.055] p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white">Paid product path: useful, but only after secure backend setup</h2>
          <p className="mt-3 max-w-4xl leading-7 text-slate-300">The intended launch pricing is <strong>$5 for 50 PDFs</strong> and <strong>$10 for 150 PDFs</strong>, with a small free allowance. Those limits will not be presented as active until a payment provider, authenticated entitlements, abuse controls and server-side AI credentials are configured. That prevents an insecure browser-only quota from being sold as a paid service.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 text-sm leading-6 text-slate-300"><div className="rounded-xl border border-white/10 bg-black/15 p-4"><strong className="block text-white">Free preview</strong>Browser-local text extraction and copy-ready prompts.</div><div className="rounded-xl border border-white/10 bg-black/15 p-4"><strong className="block text-white">$5 plan</strong>Planned 50 secure AI document runs after backend launch.</div><div className="rounded-xl border border-white/10 bg-black/15 p-4"><strong className="block text-white">$10 plan</strong>Planned 150 secure AI document runs after backend launch.</div></div>
        </section>
      </main>
    </div>
  );
}
