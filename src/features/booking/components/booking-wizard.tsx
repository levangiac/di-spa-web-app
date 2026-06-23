"use client";

import { useBookingStore } from "@/lib/stores/booking-store";
import { useAvailableSlots, useBookingPreview, useCreateBooking } from "../hooks/use-booking";
import { formatVND, formatDuration } from "@/lib/utils/format";
import { CalendarBlankIcon, ClockIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function BookingWizard() {
  const { draft, setDate, setTimeSlot, setNote, totalDuration } = useBookingStore();
  const { data: slots, isLoading: slotsLoading } = useAvailableSlots();
  const { data: preview, isLoading: previewLoading } = useBookingPreview();
  const { mutate: confirm, isPending: isConfirming } = useCreateBooking();

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "numeric" }),
      isToday: i === 0,
    };
  });

  if (draft.services.length === 0) {
    return (
      <div className="p-6 text-center space-y-2">
        <p className="text-muted-foreground text-sm">
          Bạn chưa chọn dịch vụ nào. Hãy chọn spa và dịch vụ trước.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4">
      {/* summary — giá từ API preview, không tự cộng ở FE */}
      <div className="bg-surface rounded-card p-4 shadow-card space-y-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Tóm tắt đặt lịch
        </p>
        <p className="font-semibold text-foreground">{draft.spaName}</p>
        <ul className="space-y-1">
          {draft.services.map((s) => (
            <li key={s.id} className="flex justify-between text-sm">
              <span className="text-foreground">{s.name}</span>
              <span className="text-primary font-medium">{formatVND(s.price)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <ClockIcon size={13} weight="thin" />
            {formatDuration(totalDuration())}
          </span>
          {/* Tổng tiền: luôn lấy từ API preview — không tự cộng */}
          {previewLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : preview ? (
            <div className="text-right">
              {preview.discount > 0 && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatVND(preview.subtotal)}
                </p>
              )}
              <span className="font-semibold text-primary">
                {formatVND(preview.total)}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* STEP: chọn ngày */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <CalendarBlankIcon size={16} weight="thin" className="text-primary" />
          Chọn ngày
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {dates.map((d) => (
            <button
              key={d.iso}
              onClick={() => setDate(d.iso)}
              className={cn(
                "shrink-0 flex flex-col items-center px-4 py-2.5 rounded-card border text-sm transition-all",
                "focus-visible:ring-2 focus-visible:ring-primary outline-none",
                draft.date === d.iso
                  ? "border-primary bg-primary text-primary-foreground shadow-floating"
                  : "border-border bg-surface hover:border-primary/50",
              )}
            >
              {d.isToday && (
                <span className={cn("text-[10px] font-medium mb-0.5",
                  draft.date === d.iso ? "text-white/80" : "text-primary")}>
                  Hôm nay
                </span>
              )}
              <span className="font-medium leading-none">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP: chọn giờ */}
      {draft.date && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <ClockIcon size={16} weight="thin" className="text-primary" />
            Chọn giờ
          </h3>
          {slotsLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải khung giờ...</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {(slots ?? []).map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setTimeSlot(slot.time)}
                  className={cn(
                    "py-2 rounded-pill text-sm border transition-all",
                    "focus-visible:ring-2 focus-visible:ring-primary outline-none",
                    draft.timeSlot === slot.time
                      ? "border-primary bg-primary text-primary-foreground"
                      : slot.available
                      ? "border-border bg-surface hover:border-primary/50"
                      : "border-border bg-surface-muted text-muted-foreground opacity-50 cursor-not-allowed",
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP: ghi chú và xác nhận */}
      {draft.date && draft.timeSlot && (
        <div className="space-y-3">
          <label htmlFor="booking-note" className="sr-only">
            Ghi chú đặc biệt
          </label>
          <textarea
            id="booking-note"
            placeholder="Ghi chú (dị ứng, yêu cầu đặc biệt...)"
            value={draft.note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-surface border border-border rounded-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />

          <button
            onClick={() =>
              confirm({
                spaId: draft.spaId!,
                serviceIds: draft.services.map((s) => s.id),
                date: draft.date!,
                timeSlot: draft.timeSlot!,
                note: draft.note || undefined,
              })
            }
            disabled={isConfirming}
            className="w-full h-13 rounded-pill bg-secondary text-secondary-foreground font-medium shadow-floating hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-secondary outline-none"
          >
            {isConfirming ? "Đang xử lý..." : "Xác nhận đặt lịch"}
            {!isConfirming && <ArrowRightIcon size={16} weight="bold" />}
          </button>
        </div>
      )}
    </div>
  );
}
