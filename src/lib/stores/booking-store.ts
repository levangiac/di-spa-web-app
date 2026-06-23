"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookingService = {
  id: string;
  name: string;
  price: number;
  duration: number; // phút
  spaId: string;
};

type BookingDraft = {
  spaId: string | null;
  spaName: string | null;
  services: BookingService[];
  date: string | null;     // ISO date string
  timeSlot: string | null; // "HH:mm"
  note: string;
};

type BookingStore = {
  draft: BookingDraft;
  setSpa: (id: string, name: string) => void;
  addService: (service: BookingService) => void;
  removeService: (id: string) => void;
  setDate: (date: string) => void;
  setTimeSlot: (slot: string) => void;
  setNote: (note: string) => void;
  reset: () => void;
  totalDuration: () => number;
};

const initialDraft: BookingDraft = {
  spaId: null,
  spaName: null,
  services: [],
  date: null,
  timeSlot: null,
  note: "",
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,

      setSpa: (id, name) =>
        set((s) => ({ draft: { ...s.draft, spaId: id, spaName: name, services: [] } })),

      addService: (service) =>
        set((s) => ({
          draft: {
            ...s.draft,
            services: s.draft.services.some((sv) => sv.id === service.id)
              ? s.draft.services
              : [...s.draft.services, service],
          },
        })),

      removeService: (id) =>
        set((s) => ({
          draft: { ...s.draft, services: s.draft.services.filter((sv) => sv.id !== id) },
        })),

      setDate: (date) => set((s) => ({ draft: { ...s.draft, date, timeSlot: null } })),
      setTimeSlot: (slot) => set((s) => ({ draft: { ...s.draft, timeSlot: slot } })),
      setNote: (note) => set((s) => ({ draft: { ...s.draft, note } })),
      reset: () => set({ draft: initialDraft }),

      // totalDuration chỉ là ước tính thời gian — hiển thị UX, không dùng cho giá
      totalDuration: () => get().draft.services.reduce((sum, s) => sum + s.duration, 0),
    }),
    { name: "dispa-booking-draft" },
  ),
);
