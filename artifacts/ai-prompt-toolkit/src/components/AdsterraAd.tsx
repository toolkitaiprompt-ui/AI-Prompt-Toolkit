import { useEffect, useRef } from "react";

export default function AdsterraAd() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.width = "728";
    iframe.height = "90";
    iframe.style.border = "none";
    iframe.style.display = "block";
    iframe.style.margin = "16px auto";
    iframe.style.maxWidth = "100%";
    iframe.title = "ad";

    ref.current.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`<html><head><style>*{margin:0;padding:0;overflow:hidden;}</style></head><body>
<script type="text/javascript">atOptions={key:'1c2e2f123be7deb59e6e66ffcbe411b6',format:'iframe',height:90,width:728,params:{}};<\/script>
<script type="text/javascript" src="https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js"><\/script>
</body></html>`);
    doc.close();
  }, []);

  return <div ref={ref} />;
}
