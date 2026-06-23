import { api } from "@/lib/api/client";
import type { HomeData } from "../types";
import type { SpaCardData } from "@/components/ui/spa-card";

export async function getHomeData(locale = "vi"): Promise<HomeData> {
  return api.get<HomeData>(`/home?locale=${locale}`);
}

export async function getNearbySpa(
  lat: number,
  lng: number,
  limit = 8,
): Promise<SpaCardData[]> {
  return api.get<SpaCardData[]>(
    `/spas/nearby?lat=${lat}&lng=${lng}&limit=${limit}`,
  );
}

export async function getTopRatedSpa(limit = 8): Promise<SpaCardData[]> {
  return api.get<SpaCardData[]>(`/spas/top-rated?limit=${limit}`);
}
