"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchInput } from "@/components/ui/search-input";
import { SpaCard, type SpaCardData } from "@/components/ui/spa-card";
import { CategoryPill } from "@/components/ui/category-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { searchSpas } from "@/features/spa/api";
import type { SpaDetail } from "@/features/spa/types";
import {
  LeafIcon,
  HandsPrayingIcon,
  SparkleIcon,
  DropIcon,
  SunIcon,
  HeartbeatIcon,
} from "@phosphor-icons/react";
import { useLocale } from "next-intl";

// SpaDetail (search result) → SpaCardData (card component)
// priceFrom = giá thấp nhất trong danh sách service của spa
function toSpaCardData(spa: SpaDetail): SpaCardData {
  const priceFrom =
    spa.services.length > 0
      ? Math.min(...spa.services.map((s) => s.price))
      : 0;
  return {
    id: spa.id,
    name: spa.name,
    imageUrl: spa.images[0] ?? "",
    rating: spa.rating,
    reviewCount: spa.reviewCount,
    address: spa.address,
    priceFrom,
    tags: spa.tags,
  };
}

const CATEGORIES = [
  { slug: "all",      label: "Tất cả",      icon: <LeafIcon size={16} weight="thin" /> },
  { slug: "massage",  label: "Massage",     icon: <HandsPrayingIcon size={16} weight="thin" /> },
  { slug: "facial",   label: "Chăm sóc da", icon: <SparkleIcon size={16} weight="thin" /> },
  { slug: "nail",     label: "Nail",        icon: <DropIcon size={16} weight="thin" /> },
  { slug: "hair",     label: "Tóc",         icon: <SunIcon size={16} weight="thin" /> },
  { slug: "wellness", label: "Wellness",    icon: <HeartbeatIcon size={16} weight="thin" /> },
];

export default function SearchPage() {
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["search", query, category],
    queryFn: () =>
      searchSpas({
        q: query || undefined,
        category: category === "all" ? undefined : category,
        limit: 20,
      }),
    staleTime: 30 * 1000,
  });

  return (
    <div className="pb-6 space-y-4">
      <header className="px-4 pt-6 space-y-3">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Tìm kiếm
        </h1>
        <SearchInput
          placeholder="Tên spa, dịch vụ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </header>

      {/* category filter */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
        {CATEGORIES.map((c) => (
          <CategoryPill
            key={c.slug}
            label={c.label}
            icon={c.icon}
            isActive={category === c.slug}
            onClick={() => setCategory(c.slug)}
          />
        ))}
      </div>

      {/* results */}
      <div className="px-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/3] rounded-card" />
                <div className="pt-2 space-y-1.5">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.spas?.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-12">
            Không tìm thấy kết quả phù hợp
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {data?.spas?.map((spa) => (
              <SpaCard key={spa.id} spa={toSpaCardData(spa)} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
