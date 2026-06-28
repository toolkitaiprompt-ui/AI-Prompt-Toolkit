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
    iframe.style.border = "none";
    iframe.style.display = "block";
    iframe.style.margin = "16px auto";
    iframe.style.maxWidth = "100%";
    iframe.title = "ad";

    ref.current.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    if (variant === "A") {
      doc.write(`<html><head><style>*{margin:0;padding:0;overflow:hidden;}</style></head><body>
<script type="text/javascript">atOptions={key:'${key}',format:'iframe',height:90,width:728,params:{}};<\/script>
<script type="text/javascript" src="${src}"><\/script>
</body></html>`);
    } else {
      doc.write(`<html><head><style>*{margin:0;padding:0;overflow:hidden;}</style></head><body>
<script type="text/javascript" src="${src}"><\/script>
</body></html>`);
    }
    doc.close();
  }, [variant]);

  return <div ref={ref} />;
}
