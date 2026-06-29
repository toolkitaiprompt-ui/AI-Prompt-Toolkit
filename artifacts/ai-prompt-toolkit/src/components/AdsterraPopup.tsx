import { useEffect, useRef, useState } from "react";

export default function AdsterraPopup() {
  const ref = useRef<HTMLDivElement>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed || !ref.current) return;
    ref.current.innerHTML = "";

    const isMobile = window.innerWidth < 768;
    // Desktop: 728x90, Mobile: 320x50
    const key = isMobile ? "767d367a31da85b9350b9995137e8013" : "1c2e2f123be7deb59e6e66ffcbe411b6";
    const width = isMobile ? 320 : 728;
    const height = isMobile ? 50 : 90;

    const iframe = document.createElement("iframe");
    iframe.width = String(width);
    iframe.height = String(height);
    iframe.style.cssText = "border:none;display:block;";
    iframe.title = "advertisement";

    ref.current.appendChild(iframe);

    const writeAd = () => {
      const doc = iframe.contentWindow?.document;
      if (!doc) return;
      doc.open();
      doc.write('<html><head><meta name="viewport" content="width=device-width,initial-scale=1.0">');
      doc.write('<style>*{margin:0;padding:0;overflow:hidden;}</style></head><body>');
      doc.write('<scr' + 'ipt type="text/javascript">');
      doc.write('atOptions={key:"' + key + '",format:"iframe",height:' + height + ',width:' + width + ',params:{}};');
      doc.write('</scr' + 'ipt>');
      doc.write('<scr' + 'ipt type="text/javascript" src="https://www.highperformanceformat.com/' + key + '/invoke.js">');
      doc.write('</scr' + 'ipt>');
      doc.write('</body></html>');
      doc.close();
    };

    setTimeout(writeAd, 50);
  }, [closed]);

  if (closed) return null;

  return (
    <>
      <style>{`@keyframes popupSlide { from { top: -100px; opacity: 0; } to { top: 0; opacity: 1; } }`}</style>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        margin: "0 auto",
        width: "fit-content",
        zIndex: 99999,
        animation: "popupSlide 0.4s ease-out",
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        borderRadius: "0 0 8px 8px",
        overflow: "hidden",
      }}>
        <button
          onClick={() => setClosed(true)}
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            zIndex: 100000,
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 22,
            height: 22,
            cursor: "pointer",
            fontSize: 12,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          ✕
        </button>
        <div ref={ref} />
      </div>
    </>
  );
}
