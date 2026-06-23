"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { EyeIcon, EyeSlashIcon, PhoneIcon, LockIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+\s-]+$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type LoginInput = z.infer<typeof loginSchema>;

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    const result = await signIn("credentials", {
      phone: values.phone,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Số điện thoại hoặc mật khẩu không đúng");
      return;
    }
    router.push("/home");
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/home" });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* phone */}
      <div className="space-y-1.5">
        <label htmlFor="login-phone" className="text-sm font-medium text-foreground">
          {t("phone")}
        </label>
        <div
          className={cn(
            "flex items-center gap-2.5 px-4 h-12 bg-background border rounded-pill transition-all",
            errors.phone
              ? "border-destructive focus-within:ring-destructive/20"
              : "border-border focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20",
          )}
        >
          <PhoneIcon size={18} weight="thin" className="text-muted-foreground shrink-0" />
          <input
            id="login-phone"
            type="tel"
            placeholder="0912 345 678"
            aria-describedby={errors.phone ? "login-phone-error" : undefined}
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            {...register("phone")}
          />
        </div>
        {errors.phone && (
          <p id="login-phone-error" className="text-xs text-destructive">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-sm font-medium text-foreground">
            {t("password")}
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:text-primary-dark"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <div
          className={cn(
            "flex items-center gap-2.5 px-4 h-12 bg-background border rounded-pill transition-all",
            errors.password
              ? "border-destructive"
              : "border-border focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20",
          )}
        >
          <LockIcon size={18} weight="thin" className="text-muted-foreground shrink-0" />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••"
            aria-describedby={errors.password ? "login-password-error" : undefined}
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword
              ? <EyeSlashIcon size={18} weight="thin" />
              : <EyeIcon size={18} weight="thin" />
            }
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" className="text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-pill bg-primary text-primary-foreground font-medium text-sm shadow-floating hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "Đang đăng nhập..." : t("login")}
      </button>

      {/* divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">{t("or")}</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="w-full h-12 rounded-pill border border-border bg-surface hover:bg-surface-muted text-foreground text-sm font-medium flex items-center justify-center gap-2.5 transition-colors disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {isGoogleLoading ? "Đang xử lý..." : t("loginWithGoogle")}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-primary font-medium hover:text-primary-dark">
          {t("register")}
        </Link>
      </p>
    </form>
  );
}
