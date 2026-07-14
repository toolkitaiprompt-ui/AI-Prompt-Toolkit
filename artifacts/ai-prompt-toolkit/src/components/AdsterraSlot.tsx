import AdsterraBanner from "./AdsterraBanner";

type Props = {
  variant?: "A" | "B";
  layout?: "desktop" | "mobile";
};

/**
 * AdsterraSlot — In-article ad. Sab screens pe dikhega.
 */
export default function AdsterraSlot({ variant = "A" }: Props) {
  if (variant === "B") {
    return (
      <div className="my-6">
        <AdsterraBanner size="300x250" />
      </div>
    );
  }
  return (
    <div className="my-6">
      <AdsterraBanner size="728x90" />
    </div>
  );
}
