"use client";

import { useRef } from "react";
import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { SpaCard, type SpaCardData } from "@/components/ui/spa-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  spas: SpaCardData[];
  locale: string;
  viewAllHref?: string;
  prevLabel: string;
  nextLabel: string;
  viewAllLabel: string;
};

export function SuggestedCarousel({
  title,
  spas,
  locale,
  viewAllHref,
  prevLabel,
  nextLabel,
  viewAllLabel,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "prev" | "next") {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 256 + 14; // w-64 + gap-3.5
    el.scrollBy({ left: direction === "next" ? cardWidth * 2 : -cardWidth * 2, behavior: "smooth" });
  }

  return (
    <section className="space-y-4">
      {/* header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <h2 className="font-semibold text-foreground text-base lg:text-lg">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-primary text-sm font-medium hover:gap-1.5 transition-all focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            {viewAllLabel}
            <ArrowRightIcon size={14} weight="regular" />
          </Link>
        )}
      </div>

      {/* carousel container — group để arrow hiện khi hover desktop */}
      <div className="relative group">
        {/* prev button — chỉ hiện desktop khi hover */}
        <button
          onClick={() => scroll("prev")}
          aria-label={prevLabel}
          type="button"
          className={cn(
            "hidden lg:flex",
            "absolute left-2 top-1/2 -translate-y-1/2 z-10",
            "w-10 h-10 rounded-full bg-surface shadow-card border border-border",
            "items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-surface-muted focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary",
          )}
        >
          <CaretLeftIcon size={18} weight="regular" className="text-foreground" />
        </button>

        {/* scroll track */}
        <div
          ref={scrollRef}
          className="flex gap-3.5 overflow-x-auto px-4 sm:px-6 lg:px-12 pb-2 no-scrollbar scroll-smooth"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {spas.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-64 shrink-0" style={{ scrollSnapAlign: "start" }}>
                  <Skeleton className="aspect-[4/3] rounded-card" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                </div>
              ))
            : spas.map((spa) => (
                <div key={spa.id} className="shrink-0 w-64" style={{ scrollSnapAlign: "start" }}>
                  <SpaCard spa={spa} locale={locale} />
                </div>
              ))}
        </div>

        {/* next button */}
        <button
          onClick={() => scroll("next")}
          aria-label={nextLabel}
          type="button"
          className={cn(
            "hidden lg:flex",
            "absolute right-2 top-1/2 -translate-y-1/2 z-10",
            "w-10 h-10 rounded-full bg-surface shadow-card border border-border",
            "items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-surface-muted focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary",
          )}
        >
          <CaretRightIcon size={18} weight="regular" className="text-foreground" />
        </button>
      </div>
    </section>
  );
}
