"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { StarIcon, MapPinIcon, ArrowLeftIcon, HeartIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { SpaDetail } from "../types";
import { formatRating } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/stores/booking-store";

type Props = { spa: SpaDetail };

export function SpaDetailHeader({ spa }: Props) {
  const t = useTranslations("spa");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const setSpa = useBookingStore((s) => s.setSpa);

  function handleBookNow() {
    setSpa(spa.id, spa.name);
    router.push("/booking");
  }

  return (
    <div>
      {/* hero image với dot indicator */}
      <div className="relative aspect-[16/9] bg-surface-muted">
        {spa.images.length > 0 && (
          <Image
            src={spa.images[activeImg]}
            alt={spa.name}
            fill
            priority
            className="object-cover"
          />
        )}

        {/* back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-9 h-9 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-card"
          aria-label={tCommon("back")}
        >
          <ArrowLeftIcon size={18} weight="regular" />
        </button>

        {/* wishlist */}
        <button
          onClick={() => setIsWishlisted((v) => !v)}
          className="absolute top-4 right-4 w-9 h-9 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-card"
          aria-label={isWishlisted ? "Bỏ yêu thích" : "Yêu thích"}
        >
          <HeartIcon
            size={18}
            weight={isWishlisted ? "fill" : "thin"}
            className={isWishlisted ? "text-rating" : "text-muted-foreground"}
          />
        </button>

        {/* image dots */}
        {spa.images.length > 1 && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
            role="group"
            aria-label="Điều hướng ảnh"
          >
            {spa.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === activeImg ? "true" : undefined}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === activeImg ? "bg-white w-4" : "bg-white/50",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* info card nổi lên từ image */}
      <div className="px-4 pt-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h1 className="font-display text-xl font-semibold text-foreground leading-snug">
            {spa.name}
          </h1>
          <span className="flex items-center gap-1 bg-rating text-white text-xs font-semibold px-2.5 py-1 rounded-pill shrink-0">
            <StarIcon size={11} weight="fill" />
            {formatRating(spa.rating)}
          </span>
        </div>

        <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPinIcon size={14} weight="thin" className="shrink-0 mt-0.5" />
          <span>{spa.address}</span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-pill",
              spa.isOpenNow
                ? "bg-open-bg text-open"
                : "bg-surface-muted text-muted-foreground",
            )}
          >
            {spa.isOpenNow ? `● ${t("openNow")}` : t("closed")}
          </span>
          <span className="text-xs text-muted-foreground">
            {spa.reviewCount} đánh giá
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleBookNow}
          className="w-full h-12 rounded-pill bg-secondary text-secondary-foreground font-medium shadow-floating hover:opacity-90 transition-opacity"
        >
          {t("bookNow")}
        </button>
      </div>
    </div>
  );
}
