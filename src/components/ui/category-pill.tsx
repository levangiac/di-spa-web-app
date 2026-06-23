"use client";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

export function CategoryPill({ label, icon, isActive, onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        // pill tròn lớn, line-art icon mảnh
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-pill text-sm font-medium transition-colors whitespace-nowrap",
        isActive
          ? "bg-primary text-primary-foreground shadow-floating"
          : "bg-surface text-foreground border border-border hover:border-primary/40 hover:bg-surface-muted",
        className,
      )}
      type="button"
    >
      {icon && (
        <span className={cn("w-5 h-5 flex items-center justify-center", isActive ? "opacity-100" : "opacity-70")}>
          {icon}
        </span>
      )}
      {label}
    </button>
  );
}
