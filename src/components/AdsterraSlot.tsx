import { useEffect, useRef } from "react";

type AdsterraSlotProps = {
  variant: "A" | "B";
  layout: "desktop" | "mobile";
};

export default function AdsterraSlot({ variant, layout }: AdsterraSlotProps) {
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!adRef.current) return;

    adRef.current.querySelectorAll("script").forEach((s) => s.remove());

    const wrapperClass = layout === "desktop" ? "w-full max-w-[728px]" : "w-full max-w-[320px]";
    if (layout === "desktop" && variant === "A") {
      const optionsScript = document.createElement("script");
      optionsScript.type = "text/javascript";
      optionsScript.text = `window.atOptions = {
        key : '767d367a31da85b9350b9995137e8013',
        format : 'iframe',
        height : 90,
        width : 728,
        params : {}
      };`;

      const invokeScript = document.createElement("script");
      invokeScript.type = "text/javascript";
      invokeScript.src = "https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js";
      invokeScript.async = true;

      adRef.current.appendChild(optionsScript);
      adRef.current.appendChild(invokeScript);
    } else if (variant === "A") {
      const optionsScript = document.createElement("script");
      optionsScript.type = "text/javascript";
      optionsScript.text = `window.atOptions = {
        key : '767d367a31da85b9350b9995137e8013',
        format : 'iframe',
        height : 50,
        width : 320,
        params : {}
      };`;

      const invokeScript = document.createElement("script");
      invokeScript.type = "text/javascript";
      invokeScript.src = "https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js";
      invokeScript.async = true;

      adRef.current.appendChild(optionsScript);
      adRef.current.appendChild(invokeScript);
    } else {
      const invokeScript = document.createElement("script");
      invokeScript.type = "text/javascript";
      invokeScript.src = "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js";
      invokeScript.async = true;
      adRef.current.appendChild(invokeScript);
    }

    return () => {
      adRef.current?.querySelectorAll("script").forEach((script) => script.remove());
    };
  }, [variant, layout]);

  return (
    <div className="my-8 flex justify-center">
      <div ref={adRef} className={layout === "desktop" ? "w-full max-w-[728px] flex justify-center" : "w-full max-w-[320px] flex justify-center"} />
    </div>
  );
}
