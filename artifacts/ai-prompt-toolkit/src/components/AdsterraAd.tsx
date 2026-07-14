/**
 * AdsterraAd — Self-contained banner ad.
 * HeroSection ise call karta hai homepage pe.
 * NO imports needed. Works standalone.
 */
export default function AdsterraAd() {
  const keyId = "efb96f4493e16d22d2ab3bb6495cd81e";
  const w = 728;
  const h = 90;

  const iframeContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;overflow:hidden}body{display:flex;align-items:center;justify-content:center}</style></head><body><script type="text/javascript">atOptions={'key':'${keyId}','format':'iframe','height':${h},'width':${w},'params':{}};<\/script><script type="text/javascript" src="https://www.highperformanceformat.com/${keyId}/invoke.js"><\/script></body></html>`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
      <p className="text-center text-[10px] uppercase tracking-widest text-slate-600 mb-2">Advertisement</p>
      <div className="flex w-full justify-center overflow-hidden" style={{ maxWidth: "100%" }}>
        <iframe
          srcDoc={iframeContent}
          width={w}
          height={h}
          style={{ border: "none", display: "block", maxWidth: "100%" }}
          title="advertisement-728x90"
          scrolling="no"
          loading="lazy"
        />
      </div>
    </div>
  );
}
