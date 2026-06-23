"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  HouseIcon,
  MagnifyingGlassIcon,
  CalendarBlankIcon,
  TagIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  labelVi: string;
  icon: React.ElementType;
  isCenter?: boolean;
};

const navItems: NavItem[] = [
  { href: "/home", labelVi: "Trang chủ", icon: HouseIcon },
  { href: "/search", labelVi: "Tìm kiếm", icon: MagnifyingGlassIcon },
  {
    href: "/booking",
    labelVi: "Đặt lịch",
    icon: CalendarBlankIcon,
    isCenter: true,
  },
  { href: "/promotions", labelVi: "Ưu đãi", icon: TagIcon },
  { href: "/account", labelVi: "Cá nhân", icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    // pill nổi lưng chừng — không dính sát viền
    <nav className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-surface rounded-pill shadow-floating px-2 py-2 flex items-center justify-around">
        {navItems.map(({ href, labelVi, icon: Icon, isCenter }) => {
          const isActive = pathname.includes(href);

          if (isCenter) {
            return (
              <Link key={href} href={href} aria-label={labelVi}>
                {/* nút giữa nổi hẳn lên, to hơn, màu secondary */}
                <span
                  className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-pill shadow-floating -mt-6",
                    "bg-secondary text-secondary-foreground transition-transform active:scale-95",
                  )}
                >
                  <Icon size={26} weight="thin" />
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              aria-label={labelVi}
              className="flex flex-col items-center gap-0.5 px-3 py-1 group"
            >
              <span
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-pill transition-colors",
                  isActive
                    ? "bg-surface-muted text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                <Icon size={22} weight={isActive ? "regular" : "thin"} />
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {labelVi}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
