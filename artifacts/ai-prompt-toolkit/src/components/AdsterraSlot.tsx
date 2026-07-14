import { useEffect, useRef } from "react";

/**
 * AdsterraSlot — Self-contained banner ad.
 * NO external imports. Uses iframe srcDoc (safe, no conflicts).
 *
 * variant A = 728x90 (top) + 320x50 (mobile) + 468x60 (in-article)
 * variant B = 300x250 (rectangle) + 160x600 (sidebar) + 160x300 (half-banner)
 *
 * All 6 banner units show on EVERY screen (mobile + desktop).
 */

type Props = {
  variant?: "A" | "B";
  layout?: string;
};

type BannerSize = { key: string; width: number; height: number };

const VARIANT_A: BannerSize[] = [
  { key: "efb96f4493e16d22d2ab3bb6495cd81e", width: 728, height: 90 },
  { key: "46f7b6db75df38088c8ec175e2049c67", width: 320, height: 50 },
  { key: "8a30f2d66b3c55158a9fdd7e6c3d4763", width: 468, height: 60 },
];

const VARIANT_B: BannerSize[] = [
  { key: "523e38092d3627240bb849c8a280d954", width: 300, height: 250 },
  { key: "8ff47ce96b20d2f63a8ed961d42fc6f9", width: 160, height: 600 },
  { key: "d9264105487f390df9af865c43686c92", width: 160, height: 300 },
];

function AdFrame({ config }: { config: BannerSize }) {
  const iframeContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;overflow:hidden}body{display:flex;align-items:center;justify-content:center}</style></head><body><script type="text/javascript">atOptions={'key':'${config.key}','format':'iframe','height':${config.height},'width':${config.width},'params':{}};<\/script><script type="text/javascript" src="https://www.highperformanceformat.com/${config.key}/invoke.js"><\/script></body></html>`;

  return (
    <div className="flex w-full justify-center overflow-hidden" style={{ maxWidth: "100%" }}>
      <iframe
        srcDoc={iframeContent}
        width={config.width}
        height={config.height}
        style={{ border: "none", display: "block", maxWidth: "100%" }}
        title={`ad-${config.width}x${config.height}`}
        scrolling="no"
        loading="lazy"
      />
    </div>
  );
}

export default function AdsterraSlot({ variant = "A" }: Props) {
  const banners = variant === "B" ? VARIANT_B : VARIANT_A;

  return (
    <div className="my-6 space-y-4">
      <p className="text-center text-[10px] uppercase tracking-widest text-slate-600">Advertisement</p>
      {banners.map((config) => (
        <AdFrame key={config.key} config={config} />
      ))}
    </div>
  );
}
