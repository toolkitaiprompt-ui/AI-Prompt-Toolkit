import { useEffect, useRef } from "react";

export default function AdsterraPopup() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.width = "480";
    iframe.height = "300";
    iframe.style.border = "none";
    iframe.style.borderRadius = "8px";
    iframe.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
    iframe.title = "ad";

    ref.current.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`<html><head><style>*{margin:0;padding:0;overflow:hidden;}</style></head><body>
<script type="text/javascript">atOptions={key:'767d367a31da85b9350b9995137e8013',format:'iframe',height:300,width:480,params:{}};<\/script>
<script type="text/javascript" src="https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js"><\/script>
</body></html>`);
    doc.close();
  }, []);

  return <div ref={ref} style={{ position: "fixed", bottom: "16px", right: "16px", zIndex: 9999 }} />;
}
