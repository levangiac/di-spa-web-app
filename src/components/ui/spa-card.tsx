import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "@phosphor-icons/react/dist/ssr";
import { formatVND, formatRating, formatDistance } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export type SpaCardData = {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  address: string;
  distanceMeters?: number;
  priceFrom: number;
  tags?: string[];
  isFeatured?: boolean;
};

type Props = {
  spa: SpaCardData;
  locale: string;
  className?: string;
};

export function SpaCard({ spa, locale, className }: Props) {
  return (
    <Link
      href={`/${locale !== "vi" ? locale + "/" : ""}spa/${spa.id}`}
      className={cn("block group", className)}
    >
      <article className="bg-surface rounded-card shadow-card overflow-hidden transition-transform group-hover:-translate-y-0.5 group-hover:shadow-md">
        {/* ảnh bo góc lớn */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={spa.imageUrl}
            alt={spa.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* badge rating góc trên-trái */}
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-rating text-white text-xs font-semibold px-2 py-1 rounded-pill">
            <Star size={11} weight="fill" />
            {formatRating(spa.rating)}
            <span className="opacity-75">({spa.reviewCount})</span>
          </span>

          {spa.isFeatured && (
            <span className="absolute top-2.5 right-2.5 bg-accent text-white text-[10px] font-semibold px-2 py-1 rounded-pill">
              Nổi bật
            </span>
          )}
        </div>

        {/* info */}
        <div className="p-3 space-y-1.5">
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {spa.name}
          </h3>

          <div className="flex items-start gap-1 text-muted-foreground text-xs">
            <MapPin size={12} weight="thin" className="shrink-0 mt-0.5" />
            <span className="line-clamp-1">{spa.address}</span>
            {spa.distanceMeters !== undefined && (
              <span className="ml-auto shrink-0 text-secondary font-medium">
                {formatDistance(spa.distanceMeters)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs text-muted-foreground">
              Từ{" "}
              <span className="text-primary font-semibold">
                {formatVND(spa.priceFrom)}
              </span>
            </span>

            {spa.tags && spa.tags.length > 0 && (
              <div className="flex gap-1">
                {spa.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-surface-muted text-muted-foreground px-2 py-0.5 rounded-pill"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
