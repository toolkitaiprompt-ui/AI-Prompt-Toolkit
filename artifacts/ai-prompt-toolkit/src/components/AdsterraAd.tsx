import { useEffect, useRef } from "react";

export default function AdsterraAd() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const isMobile = window.innerWidth < 768;
    const height = isMobile ? 50 : 90;
    const width = isMobile ? 320 : 728;

    const iframe = document.createElement("iframe");
    iframe.width = String(width);
    iframe.height = String(height);
    iframe.style.border = "none";
    iframe.style.display = "block";
    iframe.style.margin = "0 auto";
    iframe.title = "advertisement";

    containerRef.current.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;}</style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            key: '1c2e2f123be7deb59e6e66ffcbe411b6',
            format: 'iframe',
            height: ${height},
            width: ${width},
            params: {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/1c2e2f123be7deb59e6e66ffcbe411b6/invoke.js"></script>
      </body>
      </html>
    `);
    doc.close();

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="my-4 flex justify-center">
      <div ref={containerRef} className="flex justify-center min-h-[50px]" />
    </div>
  );
}
