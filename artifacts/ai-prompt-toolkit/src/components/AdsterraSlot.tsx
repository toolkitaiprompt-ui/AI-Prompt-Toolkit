import { useEffect, useRef } from "react";

type AdsterraSlotProps = {
  variant: "A" | "B";
  layout?: "desktop" | "mobile" | "auto";
};

type Placement = {
  key: string;
  format: string;
  width: number;
  height: number;
  src: string;
  useOptions: boolean;
};

const DESKTOP: Record<"A" | "B", Placement> = {
  A: {
    key: "767d367a31da85b9350b9995137e8013",
    format: "iframe",
    width: 728,
    height: 90,
    src: "https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js",
    useOptions: true,
  },
  B: {
    key: "73f728d3a093655bcc741155a24e5500",
    format: "iframe",
    width: 728,
    height: 90,
    src: "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js",
    useOptions: false,
  },
};

const MOBILE: Record<"A" | "B", Placement> = {
  A: {
    key: "1c2e2f123be7deb59e6e66ffcbe411b6",
    format: "iframe",
    width: 320,
    height: 50,
    src: "https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js",
    useOptions: true,
  },
  B: {
    key: "73f728d3a093655bcc741155a24e5500",
    format: "iframe",
    width: 320,
    height: 100,
    src: "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js",
    useOptions: false,
  },
};

function resolveLayout(layout: "desktop" | "mobile" | "auto"): "desktop" | "mobile" {
  if (layout !== "auto") return layout;
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

function injectAd(container: HTMLDivElement, placement: Placement) {
  container.innerHTML = "";

  if (placement.useOptions) {
    const opts = document.createElement("script");
    opts.type = "text/javascript";
    opts.text = `window.atOptions={key:'${placement.key}',format:'${placement.format}',height:${placement.height},width:${placement.width},params:{}};`;
    container.appendChild(opts);
  }

  const invoke = document.createElement("script");
  invoke.type = "text/javascript";
  invoke.src = placement.src;
  invoke.async = true;
  container.appendChild(invoke);
}

export default function AdsterraSlot({ variant, layout = "auto" }: AdsterraSlotProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const load = () => {
      if (loaded.current || !adRef.current) return;
      loaded.current = true;
      const effective = resolveLayout(layout);
      const placement = effective === "mobile" ? MOBILE[variant] : DESKTOP[variant];
      injectAd(adRef.current, placement);
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
  }, [variant, layout]);

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
