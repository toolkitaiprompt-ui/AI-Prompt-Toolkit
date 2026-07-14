import { useEffect, useRef } from "react";

/**
 * AdsterraNative — Native Banner ad.
 * Best placement: after articles, between blog posts, after content sections.
 * Blends with content for higher click-through rate.
 */
export default function AdsterraNative({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous content
    containerRef.current.innerHTML = "";

    // Create the invoke script
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src =
      "https://pl30219169.effectivecpmnetwork.com/6fdb0391425063c2d44f3d3088543b4b/invoke.js";

    // Create the container div for the ad
    const adDiv = document.createElement("div");
    adDiv.id = "container-6fdb0391425063c2d44f3d3088543b4b";

    containerRef.current.appendChild(script);
    containerRef.current.appendChild(adDiv);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={containerRef} className={`w-full ${className}`} />;
}
