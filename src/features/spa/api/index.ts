import { api } from "@/lib/api/client";
import type { SpaDetail, SpaReview } from "../types";

export async function getSpaDetail(id: string): Promise<SpaDetail> {
  return api.get<SpaDetail>(`/spas/${id}`);
}

export async function getSpaReviews(
  id: string,
  page = 1,
  limit = 10,
): Promise<{ reviews: SpaReview[]; total: number }> {
  return api.get(`/spas/${id}/reviews?page=${page}&limit=${limit}`);
}

export async function searchSpas(params: {
  q?: string;
  category?: string;
  sort?: string;
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
}): Promise<{ spas: SpaDetail[]; total: number }> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  return api.get(`/spas/search?${qs}`);
}
