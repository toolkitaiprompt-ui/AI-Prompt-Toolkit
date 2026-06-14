import { useEffect, useRef } from "react";

export default function AdsterraAd() {
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.text = `window.atOptions = {
      key: '1c2e2f123be7deb59e6e66ffcbe411b6',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {}
    };`;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js";
    invokeScript.async = true;

    adRef.current.appendChild(optionsScript);
    adRef.current.appendChild(invokeScript);

    return () => {
      adRef.current?.querySelectorAll("script").forEach((script) => script.remove());
    };
  }, []);

  return (
    <section className="my-12 rounded-3xl border border-amber-500/30 bg-amber-950/10 p-5 text-slate-100 shadow-[0_24px_48px_-30px_rgba(245,158,11,0.8)]">
      <div className="mb-4 rounded-2xl bg-amber-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
        Sponsored placement
      </div>
      <div ref={adRef} className="flex justify-center" />
      <p className="mt-4 text-xs leading-5 text-amber-200/80">
        This is an Adsterra ad placement, styled separately from Google AdSense content.
      </p>
    </section>
  );
}
