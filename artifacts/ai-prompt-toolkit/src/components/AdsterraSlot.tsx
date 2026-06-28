import { useEffect, useRef } from "react";

type AdsterraSlotProps = {
  variant: "A" | "B";
  layout?: "desktop" | "mobile" | "auto";
};

type Placement = {
  key: string;
  width: number;
  height: number;
  src: string;
  useOptions: boolean;
};

const DESKTOP: Record<"A" | "B", Placement> = {
  A: { key: "767d367a31da85b9350b9995137e8013", width: 728, height: 90, src: "https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js", useOptions: true },
  B: { key: "73f728d3a093655bcc741155a24e5500", width: 728, height: 90, src: "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js", useOptions: false },
};

const MOBILE: Record<"A" | "B", Placement> = {
  A: { key: "1c2e2f123be7deb59e6e66ffcbe411b6", width: 320, height: 50, src: "https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js", useOptions: true },
  B: { key: "73f728d3a093655bcc741155a24e5500", width: 320, height: 100, src: "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js", useOptions: false },
};

export default function AdsterraSlot({ variant, layout = "auto" }: AdsterraSlotProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const useMobile = layout === "mobile" || (layout === "auto" && window.innerWidth < 768);
    const p = useMobile ? MOBILE[variant] : DESKTOP[variant];

    const iframe = document.createElement("iframe");
    iframe.width = String(p.width);
    iframe.height = String(p.height);
    iframe.style.border = "none";
    iframe.style.display = "block";
    iframe.style.margin = "0 auto";
    iframe.title = "advertisement";

    containerRef.current.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    let html = `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /><style>body{margin:0;padding:0;}</style></head><body>`;
    if (p.useOptions) {
      html += `<script type="text/javascript">atOptions={key:'${p.key}',format:'iframe',height:${p.height},width:${p.width},params:{}};</script>`;
    }
    html += `<script type="text/javascript" src="${p.src}"></script>`;
    html += `</body></html>`;
    doc.write(html);
    doc.close();

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [variant, layout]);

  return (
    <div className="my-4 flex justify-center">
      <div ref={containerRef} className="flex justify-center min-h-[50px]" />
    </div>
  );
}
