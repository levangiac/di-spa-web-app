import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function HeroSection() {
  const t = await getTranslations("home");

  return (
    <section className="bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/*
         * Mobile/tablet: 1 cột — heading trên, ảnh dưới
         * Desktop ≥1024px: 2 cột — text trái, ảnh phải
         */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 pt-10 lg:pt-14 lg:pb-14">

          {/* ── LEFT: text block ── */}
          <div className="flex-1 text-primary-foreground space-y-5 pb-8 lg:pb-0 lg:max-w-xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {t("heroHeading")}{" "}
              {/* "glows" in italic để nhấn mạnh */}
              <em className="not-italic italic font-serif">
                {t("heroGlows")}
              </em>
              <br />
              {t("heroHeadingEnd")}
            </h1>

            <p className="text-primary-foreground/80 text-base lg:text-lg leading-relaxed max-w-md">
              {t("heroSubtext")}
            </p>

            {/* CTA pill outline */}
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill border-2 border-primary-foreground/60 text-primary-foreground text-sm font-semibold tracking-widest hover:bg-primary-foreground/15 transition-colors focus-visible:ring-2 focus-visible:ring-primary-foreground"
            >
              {t("exploreCta")}
            </Link>
          </div>

          {/* ── RIGHT: spa image in curved frame ── */}
          <div className="lg:flex-1 flex justify-center lg:justify-end">
            <div
              className="
                relative w-full max-w-sm lg:max-w-none lg:w-[440px]
                aspect-[3/4] lg:aspect-[4/5]
                rounded-[2.5rem] overflow-hidden
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
              "
            >
              <Image
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"
                alt="Không gian spa thư giãn"
                fill
                priority
                sizes="(max-width: 1023px) 80vw, 440px"
                className="object-cover"
              />
              {/* gradient overlay nhẹ phía dưới để chữ badge đọc được nếu cần */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
              />
            </div>
          </div>

        </div>
      </div>

      {/* đường cong mềm nối hero xuống phần dưới */}
      <div
        aria-hidden="true"
        className="h-8 lg:h-10 bg-background rounded-t-[2rem] -mb-1"
      />
    </section>
  );
}
