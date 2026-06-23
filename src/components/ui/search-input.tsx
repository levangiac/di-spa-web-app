"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, Props>(
  ({ className, containerClassName, ...props }, ref) => (
    <div
      className={cn(
        // pill shape, border brand, icon mảnh bên trái
        "flex items-center gap-2.5 px-4 h-12 bg-surface border border-border rounded-pill",
        "focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all",
        containerClassName,
      )}
    >
      <MagnifyingGlass size={18} weight="thin" className="text-muted-foreground shrink-0" />
      <input
        ref={ref}
        className={cn(
          "flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none",
          className,
        )}
        {...props}
      />
    </div>
  ),
);
SearchInput.displayName = "SearchInput";
