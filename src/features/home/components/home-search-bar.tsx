"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Sparkle, MagnifyingGlass } from "@phosphor-icons/react";

type Props = {
  labels: {
    areaLabel: string;
    areaPlaceholder: string;
    serviceLabel: string;
    servicePlaceholder: string;
    cta: string;
  };
};

export function HomeSearchBar({ labels }: Props) {
  const [area, setArea] = useState("");
  const [service, setService] = useState("");
  const router = useRouter();

  function handleSearch() {
    const params = new URLSearchParams();
    if (area.trim()) params.set("area", area.trim());
    if (service.trim()) params.set("category", service.trim());
    router.push(`/search?${params.toString()}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="px-4 max-w-3xl mx-auto w-full">
      {/*
       * Desktop: 3 phần ngang trong 1 thanh pill (Airbnb-style)
       * Mobile: xếp dọc, nút full-width
       */}

      {/* ── DESKTOP bar ── */}
      <div className="hidden lg:flex items-center bg-surface rounded-pill border border-border shadow-card overflow-hidden">
        {/* Khu vực */}
        <div className="flex items-center gap-2 px-5 py-3.5 flex-1 min-w-0">
          <MapPin size={16} weight="thin" className="text-muted-foreground shrink-0" />
          <div className="flex flex-col min-w-0">
            <label
              htmlFor="search-area-desktop"
              className="text-[10px] font-semibold text-foreground uppercase tracking-wider leading-none mb-1"
            >
              {labels.areaLabel}
            </label>
            <input
              id="search-area-desktop"
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={labels.areaPlaceholder}
              className="text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* divider */}
        <div aria-hidden="true" className="w-px h-8 bg-border shrink-0" />

        {/* Dịch vụ */}
        <div className="flex items-center gap-2 px-5 py-3.5 flex-1 min-w-0">
          <Sparkle size={16} weight="thin" className="text-muted-foreground shrink-0" />
          <div className="flex flex-col min-w-0">
            <label
              htmlFor="search-service-desktop"
              className="text-[10px] font-semibold text-foreground uppercase tracking-wider leading-none mb-1"
            >
              {labels.serviceLabel}
            </label>
            <input
              id="search-service-desktop"
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={labels.servicePlaceholder}
              className="text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Nút tìm kiếm */}
        <button
          onClick={handleSearch}
          type="button"
          className="shrink-0 flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-4 font-semibold text-sm hover:opacity-90 active:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          aria-label={labels.cta}
        >
          <MagnifyingGlass size={16} weight="regular" />
          {labels.cta}
        </button>
      </div>

      {/* ── MOBILE stack ── */}
      <div className="lg:hidden space-y-2.5">
        {/* Khu vực */}
        <div className="flex items-center gap-3 bg-surface rounded-pill border border-border px-5 py-3.5">
          <MapPin size={16} weight="thin" className="text-muted-foreground shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <label
              htmlFor="search-area-mobile"
              className="text-[10px] font-semibold text-foreground uppercase tracking-wider leading-none mb-1"
            >
              {labels.areaLabel}
            </label>
            <input
              id="search-area-mobile"
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={labels.areaPlaceholder}
              className="text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Dịch vụ */}
        <div className="flex items-center gap-3 bg-surface rounded-pill border border-border px-5 py-3.5">
          <Sparkle size={16} weight="thin" className="text-muted-foreground shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <label
              htmlFor="search-service-mobile"
              className="text-[10px] font-semibold text-foreground uppercase tracking-wider leading-none mb-1"
            >
              {labels.serviceLabel}
            </label>
            <input
              id="search-service-mobile"
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={labels.servicePlaceholder}
              className="text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Nút full-width */}
        <button
          onClick={handleSearch}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground rounded-pill py-4 font-semibold text-sm hover:opacity-90 active:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-secondary"
        >
          <MagnifyingGlass size={16} weight="regular" />
          {labels.cta}
        </button>
      </div>
    </div>
  );
}
