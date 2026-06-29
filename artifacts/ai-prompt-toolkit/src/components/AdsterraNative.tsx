import { useEffect, useRef } from "react";

export default function AdsterraNative() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl30122636.effectivecpmnetwork.com/ce03bfaf4335313dc2e5661d5febf45d/invoke.js";

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div 
      id="container-ce03bfaf4335313dc2e5661d5febf45d" 
      ref={containerRef} 
      style={{ width: "100%", margin: "24px 0", display: "flex", justifyContent: "center" }} 
    />
  );
}
