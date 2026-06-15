import { useEffect, useRef } from "react";

function resolveIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

function injectAd(container: HTMLDivElement, isMobile: boolean) {
  container.innerHTML = "";

  const key = isMobile ? "1c2e2f123be7deb59e6e66ffcbe411b6" : "767d367a31da85b9350b9995137e8013";
  const width = isMobile ? 320 : 728;
  const height = isMobile ? 50 : 90;
  const src = isMobile
    ? "https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js"
    : "https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js";

  const opts = document.createElement("script");
  opts.type = "text/javascript";
  opts.text = `window.atOptions={key:'${key}',format:'iframe',height:${height},width:${width},params:{}};`;
  container.appendChild(opts);

  const invoke = document.createElement("script");
  invoke.type = "text/javascript";
  invoke.src = src;
  invoke.async = true;
  container.appendChild(invoke);
}

export default function AdsterraAd() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const load = () => {
      if (loaded.current || !adRef.current) return;
      loaded.current = true;
      injectAd(adRef.current, resolveIsMobile());
    };

    if (typeof IntersectionObserver === "undefined") {
      load();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          load();
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(wrap);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        display: "block",
        width: "100%",
        position: "relative",
        zIndex: 20,
        overflowX: "hidden",
        minHeight: 50,
        marginTop: 24,
        marginBottom: 24,
      }}
    >
      <div
        ref={adRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      />
    </div>
  );
}
