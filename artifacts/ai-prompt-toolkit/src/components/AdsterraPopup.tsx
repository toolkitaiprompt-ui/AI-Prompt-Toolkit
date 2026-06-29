import { useEffect, useRef } from "react";

export default function AdsterraPopup() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js";
    script.async = true;

    containerRef.current.appendChild(script);
  }, []);

  return <div ref={containerRef} style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 99999 }} />;
}
