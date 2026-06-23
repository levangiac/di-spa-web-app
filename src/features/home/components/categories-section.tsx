"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HandsPrayingIcon,
  SparkleIcon,
  LeafIcon,
  DropIcon,
  SunIcon,
  HeartbeatIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  slug: string;
  name: string;
  iconName: string;
};

const ICON_MAP: Record<string, React.ReactNode> = {
  massage:  <HandsPrayingIcon size={20} weight="thin" />,
  facial:   <SparkleIcon size={20} weight="thin" />,
  body:     <LeafIcon size={20} weight="thin" />,
  nail:     <DropIcon size={20} weight="thin" />,
  hair:     <SunIcon size={20} weight="thin" />,
  wellness: <HeartbeatIcon size={20} weight="thin" />,
};

type Props = {
  categories: Category[];
  sectionTitle: string;
};

export function CategoriesSection({ categories, sectionTitle }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();

  function handleSelect(cat: Category) {
    setActiveId(cat.id === activeId ? null : cat.id);
    router.push(`/search?category=${cat.slug}`);
  }

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 space-y-3">
      <h2 className="font-semibold text-foreground text-base">{sectionTitle}</h2>

      <ul
        className="
          flex gap-2.5 list-none p-0 m-0
          overflow-x-auto pb-1 no-scrollbar
          lg:overflow-visible lg:flex-wrap
        "
      >
        {categories.map((cat) => {
          const isActive = activeId === cat.id;
          const icon = ICON_MAP[cat.iconName] ?? <LeafIcon size={20} weight="thin" />;

          return (
            <li key={cat.id} className="shrink-0 lg:shrink">
              <button
                type="button"
                onClick={() => handleSelect(cat)}
                aria-pressed={isActive}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-pill border text-sm font-medium",
                  "transition-all duration-150",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  "lg:hover:scale-[1.04]",
                  isActive
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-surface border-border text-foreground lg:hover:bg-primary/10 lg:hover:border-primary/40 lg:hover:text-primary",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground")}
                >
                  {icon}
                </span>
                {cat.name}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
