import { useEffect, useRef } from "react";

type AdsterraSlotProps = {
  variant: "A" | "B";
  layout?: "desktop" | "mobile" | "auto";
};

type AdsterraPlacement = {
  key: string;
  format: string;
  width: number;
  height: number;
  src: string;
  useOptions: boolean;
};

const DESKTOP_PLACEMENTS: Record<"A" | "B", AdsterraPlacement> = {
  A: {
    key: "767d367a31da85b9350b9995137e8013",
    format: "iframe",
    width: 728,
    height: 90,
    src: "https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js",
    useOptions: true,
  },
  B: {
    key: "73f728d3a093655bcc741155a24e5500",
    format: "iframe",
    width: 728,
    height: 90,
    src: "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js",
    useOptions: false,
  },
};

const MOBILE_PLACEMENTS: Record<"A" | "B", AdsterraPlacement> = {
  A: {
    key: "1c2e2f123be7deb59e6e66ffcbe411b6",
    format: "iframe",
    width: 320,
    height: 50,
    src: "https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js",
    useOptions: true,
  },
  B: {
    key: "73f728d3a093655bcc741155a24e5500",
    format: "iframe",
    width: 320,
    height: 100,
    src: "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js",
    useOptions: false,
  },
};

export default function AdsterraSlot({ variant, layout = "auto" }: AdsterraSlotProps) {
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!adRef.current) return;
    adRef.current.innerHTML = "";

    const isMobile = layout === "mobile" || (layout === "auto" && window.innerWidth < 768);
    const placement = isMobile ? MOBILE_PLACEMENTS[variant] : DESKTOP_PLACEMENTS[variant];

    if (placement.useOptions) {
      const optionsScript = document.createElement("script");
      optionsScript.type = "text/javascript";
      optionsScript.text = `window.atOptions = {
        key: '${placement.key}',
        format: '${placement.format}',
        height: ${placement.height},
        width: ${placement.width},
        params: {}
      };`;
      adRef.current.appendChild(optionsScript);
    }

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = placement.src;
    invokeScript.async = false;
    adRef.current.appendChild(invokeScript);

    return () => {
      adRef.current?.querySelectorAll("script").forEach((script) => script.remove());
    };
  }, [variant, layout]);

  const maxWidth = layout === "mobile" ? "max-w-[320px]" : "max-w-[728px]";

  return (
    <div className="my-6 flex justify-center">
      <div ref={adRef} className={`w-full ${maxWidth} flex justify-center min-h-[90px]`} />
    </div>
  );
}
