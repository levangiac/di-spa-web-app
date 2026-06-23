import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/features/auth/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Đăng nhập" };

export default async function LoginPage() {
  const t = await getTranslations("auth");
  return (
    <div className="w-full max-w-sm">
      {/* logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center shadow-floating mb-3">
          <span className="font-display font-bold text-3xl text-white">Di</span>
        </div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Di Spa</h1>
        <p className="text-muted-foreground text-sm mt-1">Wellness & Spa Booking</p>
      </div>

      <div className="bg-surface rounded-card shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground text-lg">{t("login")}</h2>
        <LoginForm />
      </div>
    </div>
  );
}
