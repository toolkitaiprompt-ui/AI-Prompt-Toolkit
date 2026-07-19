import { useEffect, useRef } from "react";

/**
 * AdsterraBanner — Sabhi 6 banner sizes ke liye.
 * Har screen (mobile + desktop) pe dikhega, kuch nahi chhupaya jaayega.
 */

type BannerSize = "728x90" | "320x50" | "468x60" | "300x250" | "160x600" | "160x300";

const BANNER_CONFIG: Record<BannerSize, { key: string; width: number; height: number }> = {
  "728x90": { key: "efb96f4493e16d22d2ab3bb6495cd81e", width: 728, height: 90 },
  "320x50": { key: "46f7b6db75df38088c8ec175e2049c67", width: 320, height: 50 },
  "468x60": { key: "8a30f2d66b3c55158a9fdd7e6c3d4763", width: 468, height: 60 },
  "300x250": { key: "523e38092d3627240bb849c8a280d954", width: 300, height: 250 },
  "160x600": { key: "8ff47ce96b20d2f63a8ed961d42fc6f9", width: 160, height: 600 },
  "160x300": { key: "d9264105487f390df9af865c43686c92", width: 160, height: 300 },
};

export default function AdsterraBanner({
  size,
  className = "",
}: {
  size: BannerSize;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = BANNER_CONFIG[size];

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    // atOptions ko window pe set karo
    (window as any).atOptions = {
      key: config.key,
      format: "iframe",
      height: config.height,
      width: config.width,
      params: {},
    };

    // Invoke script load karo
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;

    containerRef.current.appendChild(script);
  }, [config.key, config.height, config.width]);

  return (
    <div
      className={`flex w-full justify-center overflow-hidden ${className}`}
      style={{ maxWidth: "100%" }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: `${config.width}px`,
          minHeight: `${config.height}px`,
          display: "flex",
          justifyContent: "center",
        }}
      />
    </div>
  );
}
