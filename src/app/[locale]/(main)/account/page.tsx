import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import {
  User, Bell, CreditCard, ShieldCheck, Globe, CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tài khoản" };

const menuItems = [
  { icon: User,         label: "Thông tin cá nhân",  href: "/account/profile" },
  { icon: Bell,         label: "Thông báo",          href: "/notifications" },
  { icon: CreditCard,   label: "Phương thức thanh toán", href: "/account/payment" },
  { icon: ShieldCheck,  label: "Bảo mật",            href: "/account/security" },
  { icon: Globe,        label: "Ngôn ngữ",           href: "/account/language" },
];

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const initials = session.user.name
    ?.split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() ?? "?";

  return (
    <div className="pb-6">
      <header className="px-4 pt-6 pb-6">
        <h1 className="font-display text-2xl font-semibold text-foreground mb-4">
          Tài khoản
        </h1>
        {/* avatar + info */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? ""} />
            <AvatarFallback className="bg-surface-muted text-primary font-semibold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{session.user.name}</p>
            <p className="text-muted-foreground text-sm">{session.user.email}</p>
          </div>
        </div>
      </header>

      <div className="px-4 space-y-1">
        {menuItems.map(({ icon: Icon, label, href }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-3.5 rounded-card hover:bg-surface-muted transition-colors"
          >
            <Icon size={18} weight="thin" className="text-muted-foreground shrink-0" />
            <span className="flex-1 text-sm text-foreground">{label}</span>
            <CaretRight size={14} weight="regular" className="text-muted-foreground" />
          </a>
        ))}

        <Separator className="my-2" />

        <SignOutButton />
      </div>
    </div>
  );
}
