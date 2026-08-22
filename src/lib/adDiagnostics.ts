/**
 * Ad Diagnostics (dev/test only) — NEVER sent anywhere, NEVER public.
 *
 * Purpose: answer "why do ad networks report zero impressions?" from the
 * browser itself. Collects DOM/network facts about the Monetag + Adsterra
 * tags on the current page. No telemetry, no network requests, no fake
 * impressions — everything stays in this tab (window.__AD_DIAG + console
 * when the URL contains ?diag=1).
 */

export type AdScriptDiag = {
  id: string;
  zone: string | null;
  present: boolean;          // script tag exists in DOM (or data-zone marker)
  fetched: boolean;          // resource timing entry exists (script was requested)
  loaded: boolean;           // fetched AND transferSize > 0 OR onload fired
  cspBlocked: boolean;       // a securitypolicyviolation matched this URL
};

export type AdDiagSnapshot = {
  url: string;
  timestamp: string;
  device: "mobile" | "tablet" | "desktop";
  viewport: { w: number; h: number };
  monetag: AdScriptDiag[];
  adsterra: AdScriptDiag[];
  cspViolations: { blockedUri: string; directive: string; count: number }[];
  jsErrors: { message: string; count: number }[];
  containers: { total: number; visible: number; totalHeightPx: number };
  redirects: { from: string; to: string }[];
};

const MONETAG_SCRIPTS = [
  { id: "monetag-popunder", srcPart: "quge5.com/88/tag.min.js", zone: "270208" },
  { id: "monetag-inpage-push", srcPart: "nap5k.com/tag.min.js", zone: "11579225" },
  { id: "monetag-vignette", srcPart: "n6wxm.com/vignette.min.js", zone: "11579226" },
  { id: "monetag-push", srcPart: "nap5k.com/tag.min.js", zone: "11579227" },
];

const ADSTERRA_SCRIPTS = [
  { id: "adsterra-banner-1", srcPart: "tremblingsauna.com/3f/57/c6/3f57c6c4a1cf92823800e36ff3e1b363.js", zone: null },
  { id: "adsterra-banner-2", srcPart: "tremblingsauna.com/81/ba/7d/81ba7d2609c3d121773bc39aac133595.js", zone: null },
];

function detectDevice(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia?.("(max-width: 767px)").matches) return "mobile";
  if (window.matchMedia?.("(min-width: 768px) and (max-width: 1023px)").matches) return "tablet";
  return "desktop";
}

function scriptPresent(srcPart: string, zone: string | null): boolean {
  if (typeof document === "undefined") return false;
  const bySrc = document.querySelector<HTMLScriptElement>(`script[src*="${srcPart}"]`);
  if (bySrc) return true;
  // Vignette is created dynamically with data-zone — check dataset markers.
  if (zone) {
    return Array.from(document.querySelectorAll<HTMLScriptElement>("script[data-zone]")).some(
      (s) => s.dataset.zone === zone,
    );
  }
  return false;
}

function scriptFetched(srcPart: string): boolean {
  if (typeof performance === "undefined") return false;
  return performance.getEntriesByType("resource").some((e) => e.name.includes(srcPart));
}

export function snapshotAdDiagnostics(): AdDiagSnapshot {
  const res = performance.getEntriesByType("resource");
  const monetag = MONETAG_SCRIPTS.map((s) => {
    const present = scriptPresent(s.srcPart, s.zone);
    const entry = res.find((e) => e.name.includes(s.srcPart));
    const fetched = !!entry;
    const loaded = fetched && (entry as PerformanceResourceTiming).transferSize > 0;
    return { id: s.id, zone: s.zone, present, fetched, loaded, cspBlocked: false };
  });
  const adsterra = ADSTERRA_SCRIPTS.map((s) => {
    const present = scriptPresent(s.srcPart, s.zone);
    const entry = res.find((e) => e.name.includes(s.srcPart));
    const fetched = !!entry;
    const loaded = fetched && (entry as PerformanceResourceTiming).transferSize > 0;
    return { id: s.id, zone: s.zone, present, fetched, loaded, cspBlocked: false };
  });

  // Containers (.promo-wrap) visibility
  let containers = { total: 0, visible: 0, totalHeightPx: 0 };
  if (typeof document !== "undefined") {
    const wraps = Array.from(document.querySelectorAll<HTMLElement>(".promo-wrap"));
    containers.total = wraps.length;
    for (const w of wraps) {
      const r = w.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        containers.visible += 1;
        containers.totalHeightPx += Math.round(r.height);
      }
    }
  }

  return {
    url: typeof location !== "undefined" ? location.href : "",
    timestamp: new Date().toISOString(),
    device: detectDevice(),
    viewport: { w: window.innerWidth, h: window.innerHeight },
    monetag,
    adsterra,
    cspViolations: [..._cspViolations.entries()].map(([k, v]) => {
      const [blockedUri, directive] = k.split("||");
      return { blockedUri, directive, count: v };
    }),
    jsErrors: [..._jsErrors.entries()].map(([message, count]) => ({ message, count })),
    containers,
    redirects: [..._redirects.entries()].map(([from, to]) => ({ from, to })),
  };
}

// ── Collectors (module-scoped, never transmitted) ──────────────────────────
const _cspViolations = new Map<string, number>();
const _jsErrors = new Map<string, number>();
const _redirects = new Map<string, string>();
let _initialized = false;

export function initAdDiagnostics(): void {
  if (_initialized || typeof window === "undefined") return;
  _initialized = true;

  // CSP violations (securitypolicyviolation fires when a blocked request happens)
  window.addEventListener("securitypolicyviolation", (e: SecurityPolicyViolationEvent) => {
    const key = `${e.blockedURI}||${e.effectiveDirective}`;
    _cspViolations.set(key, (_cspViolations.get(key) || 0) + 1);
  });

  // JavaScript errors (capped, message-only — no stack, no user data)
  window.addEventListener("error", (e) => {
    const msg = e.message?.slice(0, 120) || "unknown error";
    _jsErrors.set(msg, (_jsErrors.get(msg) || 0) + 1);
  });
  window.addEventListener("unhandledrejection", (e) => {
    const msg = String(e.reason).slice(0, 120) || "unhandledrejection";
    _jsErrors.set(msg, (_jsErrors.get(msg) || 0) + 1);
  });

  // Document-level redirects observed during this session (same-tab only)
  const lastPath = location.pathname;
  window.addEventListener("pageshow", () => {
    if (location.pathname !== lastPath) {
      _redirects.set(lastPath, location.pathname);
    }
  });

  // Expose snapshot ONLY on the window object (console-accessible, not public)
  (window as unknown as Record<string, unknown>).__AD_DIAG = {
    snapshot: () => snapshotAdDiagnostics(),
  };

  // Console + mini-panel when the URL explicitly asks for it (?diag=1)
  if (new URLSearchParams(location.search).get("diag") === "1") {
    setTimeout(() => {
      const snap = snapshotAdDiagnostics();
      console.table([
        ...snap.monetag.map((s) => ({ network: "Monetag", id: s.id, zone: s.zone, present: s.present, fetched: s.fetched, loaded: s.loaded })),
        ...snap.adsterra.map((s) => ({ network: "Adsterra", id: s.id, zone: s.zone, present: s.present, fetched: s.fetched, loaded: s.loaded })),
      ]);
      console.log("AD-DIAG:", JSON.stringify(snap, null, 2));
      renderDiagPanel(snap);
    }, 4000);
  }
}

function renderDiagPanel(snap: AdDiagSnapshot): void {
  const panel = document.createElement("div");
  panel.id = "ad-diag-panel";
  panel.style.cssText =
    "position:fixed;bottom:12px;right:12px;z-index:99999;background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:10px;padding:10px 12px;font:11px/1.5 monospace;max-width:340px;box-shadow:0 8px 30px rgba(0,0,0,.5)";
  const row = (name: string, ok: boolean, extra = "") =>
    `<div style="display:flex;justify-content:space-between;gap:8px"><span>${name}</span><span style="color:${ok ? "#34d399" : "#f87171"}">${ok ? "OK" : "NO"}${extra ? " · " + extra : ""}</span></div>`;
  const rows = [
    `<div style="font-weight:700;margin-bottom:4px">AD DIAG — ${snap.device} · ${snap.url.slice(0, 40)}</div>`,
    ...snap.monetag.map((s) => row(`Monetag ${s.id} (${s.zone})`, s.present && s.fetched, s.present ? (s.loaded ? "loaded" : "empty/blocked") : "missing")),
    ...snap.adsterra.map((s) => row(`Adsterra ${s.id}`, s.present && s.fetched, s.present ? (s.loaded ? "loaded" : "empty/blocked") : "missing")),
    row(`CSP violations`, snap.cspViolations.length === 0, snap.cspViolations.length ? String(snap.cspViolations.length) : ""),
    row(`JS errors`, snap.jsErrors.length === 0, snap.jsErrors.length ? String(snap.jsErrors.length) : ""),
    row(`Ad containers (${snap.containers.visible}/${snap.containers.total})`, snap.containers.total > 0, snap.containers.totalHeightPx + "px"),
  ];
  panel.innerHTML = rows.join("");
  document.body.appendChild(panel);
}
