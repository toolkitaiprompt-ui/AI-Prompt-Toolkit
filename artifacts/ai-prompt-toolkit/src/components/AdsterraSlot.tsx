export default function AdsterraSlot({ variant }: { variant: "A" | "B" }) {
  const src = variant === "A"
    ? "https://www.highperformanceformat.com/767d367a31da85b9350b9995137e8013/invoke.js"
    : "https://pl29743330.effectivecpmnetwork.com/73/f7/28/73f728d3a093655bcc741155a24e5500.js";

  return (
    <iframe
      src={src}
      width="100%"
      height="90"
      style={{ border: "none", maxWidth: "728px", margin: "16px auto", display: "block" }}
      title="Advertisement"
    />
  );
}
