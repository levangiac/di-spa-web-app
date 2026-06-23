import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { SpaCard, type SpaCardData } from "@/components/ui/spa-card";

type Props = {
  title: string;
  spas: SpaCardData[];
  locale: string;
  viewAllHref?: string;
  viewAllLabel: string;
};

export function NewSpasGrid({ title, spas, locale, viewAllHref, viewAllLabel }: Props) {
  if (spas.length === 0) return null;

  return (
    <section className="space-y-4 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12">
      <div className="flex items-center justify-between">
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

      {/*
       * Mobile: 2 cột
       * Tablet: 3 cột
       * Desktop: 4 cột
       */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {spas.map((spa) => (
          <SpaCard key={spa.id} spa={spa} locale={locale} />
        ))}
      </div>
    </section>
  );
}
