"use client";

import Link from "next/link";

type Props = { error: Error & { digest?: string }; reset: () => void };

export default function BookingError({ reset }: Props) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
      <p className="text-3xl" aria-hidden="true">📋</p>
      <h2 className="font-semibold text-foreground text-lg">Đã xảy ra lỗi khi đặt lịch</h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        Giao dịch của bạn chưa bị mất, vui lòng kiểm tra Lịch sử đặt lịch trước khi đặt lại.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/history"
          className="px-5 py-2.5 rounded-pill border border-border text-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
        >
          Lịch sử đặt lịch
        </Link>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-pill bg-primary text-primary-foreground text-sm font-medium shadow-floating"
        >
          Đặt lại
        </button>
      </div>
    </div>
  );
}
