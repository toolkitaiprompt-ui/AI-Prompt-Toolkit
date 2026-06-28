import { useEffect, useRef, useState } from "react";

export default function AdsterraAd() {
  const adRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!adRef.current) return;
    adRef.current.innerHTML = "";

    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";

    if (isMobile) {
      optionsScript.text = `window.atOptions_1 = {
        key: '1c2e2f123be7deb59e6e66ffcbe411b6',
        format: 'iframe',
        height: 50,
        width: 320,
        params: {}
      };`;
    } else {
      optionsScript.text = `window.atOptions_1 = {
        key: '1c2e2f123be7deb59e6e66ffcbe411b6',
        format: 'iframe',
        height: 90,
        width: 728,
        params: {}
      };`;
    }

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js";
    invokeScript.async = false;

    adRef.current.appendChild(optionsScript);
    adRef.current.appendChild(invokeScript);

    return () => {
      adRef.current?.querySelectorAll("script").forEach((script) => script.remove());
    };
  }, [isMobile]);

  return (
    <div className="my-4 flex justify-center">
      <div ref={adRef} className="flex justify-center min-h-[50px]" />
    </div>
  );
}
