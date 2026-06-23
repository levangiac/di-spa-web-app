import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSpaDetail } from "@/features/spa/api";
import { SpaDetailHeader } from "@/features/spa/components/spa-detail-header";
import { SpaServices } from "@/features/spa/components/spa-services";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const spa = await getSpaDetail(id);
    return { title: spa.name, description: spa.description };
  } catch {
    return { title: "Di Spa" };
  }
}

export default async function SpaDetailPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("spa");

  let spa;
  try {
    spa = await getSpaDetail(id);
  } catch {
    notFound();
  }

  return (
    <div className="pb-6">
      <SpaDetailHeader spa={spa} />

      <Tabs defaultValue="services" className="mt-4 px-4">
        <TabsList className="w-full bg-surface-muted rounded-pill p-1">
          <TabsTrigger value="services" className="flex-1 rounded-pill data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-card">
            {t("services")}
          </TabsTrigger>
          <TabsTrigger value="about" className="flex-1 rounded-pill data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-card">
            {t("about")}
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1 rounded-pill data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-card">
            {t("reviews")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-4">
          <SpaServices spaId={spa.id} services={spa.services} />
        </TabsContent>

        <TabsContent value="about" className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{spa.description}</p>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Suspense fallback={<Skeleton className="h-32 rounded-card" />}>
            <p className="text-sm text-muted-foreground">Đang tải đánh giá...</p>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
