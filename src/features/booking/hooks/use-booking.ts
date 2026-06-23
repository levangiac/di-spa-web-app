"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAvailableSlots,
  previewBooking,
  createBooking,
  type BookingPayload,
} from "../api";
import { useBookingStore } from "@/lib/stores/booking-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAvailableSlots() {
  const { draft } = useBookingStore();
  return useQuery({
    queryKey: ["slots", draft.spaId, draft.date],
    queryFn: () => getAvailableSlots(draft.spaId!, draft.date!),
    enabled: !!draft.spaId && !!draft.date,
    staleTime: 60 * 1000,
  });
}

// Giá phải lấy từ API preview — không tự tính ở FE
export function useBookingPreview() {
  const { draft } = useBookingStore();
  return useQuery({
    queryKey: ["booking-preview", draft.spaId, draft.services.map((s) => s.id)],
    queryFn: () =>
      previewBooking({
        spaId: draft.spaId!,
        serviceIds: draft.services.map((s) => s.id),
      }),
    enabled: !!draft.spaId && draft.services.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBooking() {
  const router = useRouter();
  const reset = useBookingStore((s) => s.reset);

  return useMutation({
    mutationFn: (payload: BookingPayload) => createBooking(payload),
    onSuccess: (result) => {
      toast.success(`Đặt lịch thành công! Mã: ${result.confirmCode}`);
      reset();
      router.push("/history");
    },
    onError: () => {
      toast.error("Đặt lịch thất bại. Vui lòng thử lại.");
    },
  });
}
