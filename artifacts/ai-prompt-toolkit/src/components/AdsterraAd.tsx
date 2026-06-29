import { useEffect, useRef } from "react";

export default function AdsterraAd() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const isMobile = window.innerWidth < 768;
    // Desktop: 728x90, Mobile: 320x50
    const key = isMobile ? "767d367a31da85b9350b9995137e8013" : "1c2e2f123be7deb59e6e66ffcbe411b6";
    const width = isMobile ? 320 : 728;
    const height = isMobile ? 50 : 90;

    const iframe = document.createElement("iframe");
    iframe.width = String(width);
    iframe.height = String(height);
    iframe.style.cssText = "border:none;display:block;margin:0 auto;max-width:100%;";
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
  }, []);

  return <div ref={ref} style={{ width: "100%", display: "flex", justifyContent: "center", padding: "16px 0" }} />;
}
