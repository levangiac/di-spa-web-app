import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  discountPercent?: number;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
};

// SVG overlay hoa văn lá cây — decorative, opacity thấp
function LeafPattern() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* lá cây đơn giản outline */}
      {[
        [320, 20],  [360, 60],  [280, 80],
        [340, 140], [380, 170], [300, 160],
      ].map(([cx, cy], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={18}
          ry={10}
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          transform={`rotate(${30 + i * 25} ${cx} ${cy})`}
        />
      ))}
    </svg>
  );
}

export function BannerCard({ title, subtitle, discountPercent, ctaLabel, ctaHref, onCtaClick, className }: Props) {
  return (
    <div
      className={cn(
        // gradient primary → accent, bo góc, overflow hidden để leaf không tràn ra
        "relative overflow-hidden rounded-card gradient-brand p-5 text-white",
        className,
      )}
    >
      <LeafPattern />

      {/* nội dung */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="font-display text-xl font-semibold leading-snug">{title}</p>
          {subtitle && (
            <p className="text-white/80 text-sm">{subtitle}</p>
          )}
          {ctaLabel && ctaHref && (
            <a
              href={ctaHref}
              className="mt-2 inline-flex items-center text-sm font-medium bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-pill transition-colors focus-visible:ring-2 focus-visible:ring-white"
            >
              {ctaLabel}
            </a>
          )}
          {ctaLabel && !ctaHref && (
            <button
              onClick={onCtaClick}
              className="mt-2 inline-flex items-center text-sm font-medium bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-pill transition-colors focus-visible:ring-2 focus-visible:ring-white"
              type="button"
            >
              {ctaLabel}
            </button>
          )}
        </div>

        {/* badge % giảm giá tròn góc phải */}
        {discountPercent !== undefined && (
          <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 shadow-floating">
            <span className="font-display font-bold text-xl leading-none">
              {discountPercent}%
            </span>
            <span className="text-[10px] text-white/80 leading-none">OFF</span>
          </div>
        )}
      </div>
    </div>
  );
}
