import { useEffect, useRef } from "react";

export default function AdsterraSlot({ variant }: { variant: "A" | "B" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const key = variant === "A"
      ? "767d367a31da85b9350b9995137e8013"
      : "73f728d3a093655bcc741155a24e5500";
    const src = variant === "A"
      ? "https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js"
      : "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js";

    const iframe = document.createElement("iframe");
    iframe.width = "728";
    iframe.height = "90";
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
        doc.write('atOptions={key:"' + key + '",format:"iframe",height:90,width:728,params:{}};');
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
