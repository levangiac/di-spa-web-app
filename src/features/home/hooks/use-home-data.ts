"use client";

import { useQuery } from "@tanstack/react-query";
import { getTopRatedSpa, getNearbySpa } from "../api";

export function useTopRatedSpa(limit = 8) {
  return useQuery({
    queryKey: ["spas", "top-rated", limit],
    queryFn: () => getTopRatedSpa(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useNearbySpa(lat?: number, lng?: number, limit = 8) {
  return useQuery({
    queryKey: ["spas", "nearby", lat, lng, limit],
    queryFn: () => getNearbySpa(lat!, lng!, limit),
    enabled: lat !== undefined && lng !== undefined,
    staleTime: 2 * 60 * 1000,
  });
}
