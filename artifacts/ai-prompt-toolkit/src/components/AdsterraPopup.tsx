import { useEffect, useRef } from "react";

export default function AdsterraPopup() {
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!popupRef.current) return;
    popupRef.current.innerHTML = "";

    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.text = `window.atOptions_popup = {
      key: '767d367a31da85b9350b9995137e8013',
      format: 'iframe',
      height: 300,
      width: 480,
      params: {}
    };`;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js";
    invokeScript.async = false;

    popupRef.current.appendChild(optionsScript);
    popupRef.current.appendChild(invokeScript);

    return () => {
      popupRef.current?.querySelectorAll("script").forEach((script) => script.remove());
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div ref={popupRef} className="w-full max-w-[320px] sm:max-w-[480px] min-h-[200px] sm:min-h-[300px] rounded-xl overflow-hidden shadow-2xl" />
    </div>
  );
}
