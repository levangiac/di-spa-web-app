"use client";

import { Plus, Minus, Clock } from "@phosphor-icons/react";
import { useBookingStore } from "@/lib/stores/booking-store";
import { formatVND, formatDuration } from "@/lib/utils/format";
import type { SpaService } from "../types";
import { cn } from "@/lib/utils";

type Props = { spaId: string; services: SpaService[] };

export function SpaServices({ spaId, services }: Props) {
  const { draft, addService, removeService } = useBookingStore();

  const isSelected = (id: string) => draft.services.some((s) => s.id === id);

  return (
    <div className="space-y-3">
      {services.map((service) => {
        const selected = isSelected(service.id);
        return (
          <div
            key={service.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-card border transition-all",
              selected
                ? "border-primary bg-surface-muted"
                : "border-border bg-surface",
            )}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground">{service.name}</p>
              {service.description && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {service.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-primary font-semibold text-sm">
                  {formatVND(service.price)}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={11} weight="thin" />
                  {formatDuration(service.duration)}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                selected
                  ? removeService(service.id)
                  : addService({
                      id: service.id,
                      name: service.name,
                      price: service.price,
                      duration: service.duration,
                      spaId,
                    })
              }
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary",
              )}
              aria-label={selected ? "Bỏ chọn" : "Chọn dịch vụ"}
            >
              {selected ? <Minus size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
            </button>
          </div>
        );
      })}
    </div>
  );
}
