import { api } from "@/lib/api/client";

export type TimeSlot = {
  time: string;   // "HH:mm"
  available: boolean;
};

export type BookingPayload = {
  spaId: string;
  serviceIds: string[];
  date: string;
  timeSlot: string;
  note?: string;
};

export type BookingResult = {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  confirmCode: string;
};

// Kết quả gọi POST /bookings/preview — giá PHẢI lấy từ đây, không tự tính FE
export type BookingPreviewResult = {
  subtotal: number;
  discount: number;
  total: number;
};

export async function getAvailableSlots(
  spaId: string,
  date: string,
): Promise<TimeSlot[]> {
  const params = new URLSearchParams({ date });
  return api.get<TimeSlot[]>(`/spas/${spaId}/slots?${params.toString()}`);
}

export async function previewBooking(params: {
  spaId: string;
  serviceIds: string[];
  voucherId?: string;
}): Promise<BookingPreviewResult> {
  return api.post<BookingPreviewResult>("/bookings/preview", params);
}

export async function createBooking(payload: BookingPayload): Promise<BookingResult> {
  return api.post<BookingResult>("/bookings", payload);
}
