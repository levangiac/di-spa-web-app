import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { HeroSection } from "@/features/home/components/hero-section";
import { HomeSearchBar } from "@/features/home/components/home-search-bar";
import { CategoriesSection } from "@/features/home/components/categories-section";
import { SuggestedCarousel } from "@/features/home/components/suggested-carousel";
import { NewSpasGrid } from "@/features/home/components/new-spas-grid";
import { BannerCard } from "@/components/ui/banner-card";
import { getTopRatedSpa } from "@/features/home/api";
import type { SpaCardData } from "@/components/ui/spa-card";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Di Spa — Wellness that glows from within",
    description:
      "Khám phá và đặt lịch spa đẳng cấp gần bạn. Massage, chăm sóc da, nail, wellness — tất cả trên Di Spa.",
    openGraph: {
      title: "Di Spa — Wellness that glows from within",
      description:
        "Khám phá và đặt lịch spa đẳng cấp gần bạn. Massage, chăm sóc da, nail, wellness — tất cả trên Di Spa.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Di Spa — Wellness that glows from within",
    },
  };
}

// ── Demo data dùng khi API chưa sẵn sàng ──────────────────────────────────────
const DEMO_SPAS: SpaCardData[] = [
  {
    id: "1",
    name: "Hexagone Salon & Spa",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
    rating: 4.9,
    reviewCount: 312,
    address: "15 Lê Thánh Tôn, Q.1, TP.HCM",
    distanceMeters: 420,
    priceFrom: 350000,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Blooming Spa",
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80",
    rating: 4.7,
    reviewCount: 198,
    address: "82 Nguyễn Huệ, Q.1, TP.HCM",
    distanceMeters: 870,
    priceFrom: 280000,
  },
  {
    id: "3",
    name: "Serene Wellness",
    imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
    rating: 4.8,
    reviewCount: 156,
    address: "44 Hai Bà Trưng, Q.3, TP.HCM",
    distanceMeters: 1200,
    priceFrom: 420000,
  },
  {
    id: "4",
    name: "Lotus Touch Spa",
    imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80",
    rating: 4.6,
    reviewCount: 89,
    address: "9 Đinh Tiên Hoàng, Bình Thạnh",
    distanceMeters: 2400,
    priceFrom: 210000,
  },
  {
    id: "5",
    name: "Prana Spa & Retreat",
    imageUrl: "https://images.unsplash.com/photo-1549590143-d5855148a9d5?w=600&q=80",
    rating: 4.9,
    reviewCount: 441,
    address: "120 Pasteur, Q.3, TP.HCM",
    distanceMeters: 1800,
    priceFrom: 500000,
    isFeatured: true,
  },
  {
    id: "6",
    name: "The Bliss Spa",
    imageUrl: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=80",
    rating: 4.5,
    reviewCount: 73,
    address: "33 Võ Văn Tần, Q.3, TP.HCM",
    distanceMeters: 950,
    priceFrom: 300000,
  },
  {
    id: "7",
    name: "Harmony Day Spa",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    rating: 4.7,
    reviewCount: 127,
    address: "55 Nam Kỳ Khởi Nghĩa, Q.3",
    distanceMeters: 1100,
    priceFrom: 260000,
  },
  {
    id: "8",
    name: "Zen Garden Spa",
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80",
    rating: 4.8,
    reviewCount: 203,
    address: "11 Trần Hưng Đạo, Q.5, TP.HCM",
    distanceMeters: 3200,
    priceFrom: 380000,
  },
];

const DEMO_CATEGORIES = [
  { id: "1", slug: "massage",  iconName: "massage",  name: "Massage" },
  { id: "2", slug: "facial",   iconName: "facial",   name: "Chăm Sóc Da" },
  { id: "3", slug: "body",     iconName: "body",     name: "Body Care" },
  { id: "4", slug: "nail",     iconName: "nail",     name: "Nail & Tóc" },
  { id: "5", slug: "wellness", iconName: "wellness", name: "Wellness" },
  { id: "6", slug: "special",  iconName: "hair",     name: "Đặc Biệt" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [t, locale] = await Promise.all([
    getTranslations("home"),
    getLocale(),
  ]);

  // Fetch suggested spas từ server (SSR cho SEO)
  let suggestedSpas: SpaCardData[] = [];
  try {
    suggestedSpas = await getTopRatedSpa(8);
  } catch {
    suggestedSpas = DEMO_SPAS.slice(0, 5);
  }

  // "Các Spa Mới" — endpoint riêng khi API sẵn; tạm dùng demo
  const newSpas: SpaCardData[] = DEMO_SPAS.slice(3);

  return (
    <div className="flex flex-col">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Search bar */}
      <div className="bg-background py-5">
        <HomeSearchBar
          labels={{
            areaLabel:         t("searchAreaLabel"),
            areaPlaceholder:   t("searchAreaPlaceholder"),
            serviceLabel:      t("searchServiceLabel"),
            servicePlaceholder: t("searchServicePlaceholder"),
            cta:               t("searchCta"),
          }}
        />
      </div>

      {/* 3. Category pills */}
      <div className="py-2">
        <CategoriesSection
          categories={DEMO_CATEGORIES}
          sectionTitle={t("categories")}
        />
      </div>

      {/* 4. Spa Được Gợi Ý — carousel */}
      <div className="py-6">
        <SuggestedCarousel
          title={t("suggestedSpas")}
          spas={suggestedSpas}
          locale={locale}
          viewAllHref="/search?sort=rating"
          prevLabel={t("prevSpa")}
          nextLabel={t("nextSpa")}
          viewAllLabel={t("viewAll")}
        />
      </div>

      {/* 5. Membership banner */}
      <div className="py-4 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <BannerCard
          title={t("membershipTitle")}
          subtitle={t("membershipSubtitle")}
          discountPercent={30}
          ctaLabel={t("membershipCta")}
          ctaHref="/promotions"
        />
      </div>

      {/* 6. Các Spa Mới — grid */}
      <div className="py-6">
        <NewSpasGrid
          title={t("newSpas")}
          spas={newSpas}
          locale={locale}
          viewAllHref="/search?sort=newest"
          viewAllLabel={t("viewAll")}
        />
      </div>

      {/* bottom spacer ở mobile (bottom-nav cách đáy ~12px) */}
      <div className="h-4" aria-hidden="true" />
    </div>
  );
}
