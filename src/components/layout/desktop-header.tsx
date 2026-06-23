"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { BellIcon, UserIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

const navItems: NavItem[] = [
  { href: "/home",       label: "Trang chủ" },
  { href: "/search",     label: "Tìm kiếm"  },
  { href: "/booking",    label: "Booking"   },
  { href: "/promotions", label: "Danh mục"  },
  { href: "/account",    label: "Tài khoản" },
];

export function DesktopHeader() {
  const pathname = usePathname();

  return (
    <header className="hidden lg:flex fixed top-0 inset-x-0 h-16 z-40 bg-surface/95 backdrop-blur-sm border-b border-border items-center px-6 gap-8">
      {/* logo */}
      <Link href="/home" className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-display font-bold text-sm leading-none">
            Di
          </span>
        </div>
        <span className="font-display font-semibold text-xl text-foreground">
          Di Spa
        </span>
      </Link>

      {/* nav */}
      <nav className="flex items-center gap-0.5 flex-1" aria-label="Menu chính">
        {navItems.map(({ href, label }) => {
          const isActive = pathname.includes(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-4 py-2 rounded-pill text-sm font-medium transition-colors",
                isActive
                  ? "bg-surface-muted text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-muted/60",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* right actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/notifications"
          aria-label="Thông báo"
          className="relative w-9 h-9 flex items-center justify-center rounded-pill hover:bg-surface-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        >
          <BellIcon size={20} weight="thin" className="text-foreground" />
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rating rounded-full"
          />
        </Link>
        <Link
          href="/account"
          aria-label="Tài khoản"
          className="w-9 h-9 flex items-center justify-center rounded-pill bg-surface-muted text-primary hover:bg-primary hover:text-primary-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        >
          <UserIcon size={20} weight="thin" />
        </Link>
      </div>
    </header>
  );
}
