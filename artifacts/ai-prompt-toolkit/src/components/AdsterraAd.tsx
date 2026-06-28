import { useEffect, useRef } from "react";

export default function AdsterraAd() {
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!adRef.current) return;
    adRef.current.innerHTML = "";

    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.text = `window.atOptions = {
      key: '1c2e2f123be7deb59e6e66ffcbe411b6',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {}
    };`;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js";
    invokeScript.async = false;

    adRef.current.appendChild(optionsScript);
    adRef.current.appendChild(invokeScript);

    return () => {
      adRef.current?.querySelectorAll("script").forEach((script) => script.remove());
    };
  }, []);

  return (
    <div className="my-6 flex justify-center">
      <div ref={adRef} className="w-full max-w-[728px] flex justify-center min-h-[90px]" />
    </div>
  );
}
