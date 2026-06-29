import { useEffect, useRef } from "react";

export default function AdsterraSlot({ variant }: { variant: "A" | "B" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const isMobile = window.innerWidth < 768;

    // Banner A: Use 1c2e2f... (This is the official 728x90 / 320x50 banner key)
    // Banner B: Use 73f728... (This is the official 728x90 / 320x100 banner key)
    const key = variant === "A"
      ? "1c2e2f123be7deb59e6e66ffcbe411b6"
      : "73f728d3a093655bcc741155a24e5500";

    const src = variant === "A"
      ? "https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js"
      : "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js";

    const width = isMobile ? 320 : 728;
    const height = isMobile ? (variant === "A" ? 50 : 100) : 90;

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
      if (variant === "A") {
        doc.write('<scr' + 'ipt type="text/javascript">');
        doc.write('atOptions={key:"' + key + '",format:"iframe",height:' + height + ',width:' + width + ',params:{}};');
        doc.write('</scr' + 'ipt>');
      }
      doc.write('<scr' + 'ipt type="text/javascript" src="' + src + '">');
      doc.write('</scr' + 'ipt>');
      doc.write('</body></html>');
      doc.close();
    };

    setTimeout(writeAd, 50);
  }, [variant]);

  return <div ref={ref} style={{ width: "100%", display: "flex", justifyContent: "center", padding: "12px 0" }} />;
}
