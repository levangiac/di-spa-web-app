"use client";

type Props = { error: Error & { digest?: string }; reset: () => void };

export default function PromotionsError({ reset }: Props) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
      <p className="text-3xl" aria-hidden="true">😔</p>
      <h2 className="font-semibold text-foreground text-lg">Không thể tải khuyến mãi</h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        Vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-pill bg-primary text-primary-foreground text-sm font-medium shadow-floating"
      >
        Thử lại
      </button>
    </div>
  );
}
