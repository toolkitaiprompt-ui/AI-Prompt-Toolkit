import { useEffect, useRef } from "react";

export default function AdsterraAd() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

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
      doc.write('<scr' + 'ipt type="text/javascript">');
      doc.write('atOptions={key:"1c2e2f123be7deb59e6e66ffcbe411b6",format:"iframe",height:90,width:728,params:{}};');
      doc.write('</scr' + 'ipt>');
      doc.write('<scr' + 'ipt type="text/javascript" src="https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js">');
      doc.write('</scr' + 'ipt>');
      doc.write('</body></html>');
      doc.close();
    };

    setTimeout(writeAd, 50);
  }, []);

  return <div ref={ref} style={{ width: "100%", display: "flex", justifyContent: "center", padding: "12px 0" }} />;
}
