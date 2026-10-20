import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Fine-line gold illustrations shown until real product photos are added.
const drawings: Record<string, ReactNode> = {
  bags: (
    <>
      <path d="M38 42c0-12 8-20 22-20s22 8 22 20" />
      <path d="M24 44h72l-6 52H30z" />
      <path d="M24 44l8 14h56l8-14" />
      <circle cx="60" cy="66" r="3" />
    </>
  ),
  rings: (
    <>
      <circle cx="60" cy="68" r="26" />
      <circle cx="60" cy="68" r="21" />
      <path d="M50 42l10-14 10 14-10 6z" />
      <path d="M50 42h20" />
    </>
  ),
  chains: (
    <>
      <path d="M22 30c6 40 70 40 76 0" strokeDasharray="1 5" />
      <ellipse cx="34" cy="58" rx="8" ry="5" transform="rotate(35 34 58)" />
      <ellipse cx="47" cy="66" rx="8" ry="5" transform="rotate(15 47 66)" />
      <ellipse cx="60" cy="69" rx="8" ry="5" />
      <ellipse cx="73" cy="66" rx="8" ry="5" transform="rotate(-15 73 66)" />
      <ellipse cx="86" cy="58" rx="8" ry="5" transform="rotate(-35 86 58)" />
      <path d="M60 74v10" />
      <circle cx="60" cy="90" r="6" />
    </>
  ),
  earrings: (
    <>
      <circle cx="42" cy="34" r="2" />
      <circle cx="42" cy="62" r="22" />
      <circle cx="80" cy="34" r="2" />
      <path d="M80 36v14" />
      <path d="M80 54l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
    </>
  ),
  bracelets: (
    <>
      <ellipse cx="60" cy="62" rx="36" ry="16" />
      <ellipse cx="60" cy="58" rx="36" ry="16" />
      <circle cx="40" cy="72" r="2.5" />
      <circle cx="60" cy="74" r="2.5" />
      <circle cx="80" cy="72" r="2.5" />
    </>
  ),
};

const tones: Record<string, string> = {
  bags: "from-[#ece2d1] via-sand to-[#e4d7c2]",
  rings: "from-ivory via-sand to-[#eadfcc]",
  chains: "from-[#efe6d6] via-ivory to-sand",
  earrings: "from-sand via-[#f3ece0] to-[#e6dac6]",
  bracelets: "from-[#f1e9dc] via-sand to-ivory",
};

export function ProductArt({
  category,
  className,
}: {
  // Category slug; categories without their own drawing fall back to the ring
  category: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br",
        tones[category] ?? tones.rings,
        className,
      )}
    >
      <div className="absolute size-[70%] rounded-full bg-gold/10 blur-2xl" />
      <div className="absolute size-[78%] rounded-full border border-gold/20" />
      <svg
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="relative w-1/2 text-gold-dark"
      >
        {drawings[category] ?? drawings.rings}
      </svg>
    </div>
  );
}
