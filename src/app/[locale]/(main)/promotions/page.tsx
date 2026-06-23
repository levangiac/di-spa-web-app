import { BannerCard } from "@/components/ui/banner-card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ưu đãi" };

// Demo data — sẽ fetch từ API
const PROMOS = [
  { id: "1", title: "Thành viên VIP", subtitle: "Giảm 30% tất cả dịch vụ massage", discount: 30 },
  { id: "2", title: "Sinh nhật đặc biệt", subtitle: "Tặng 1 buổi facial miễn phí", discount: 100 },
  { id: "3", title: "Combo cuối tuần", subtitle: "Massage + Facial chỉ 499k", discount: 25 },
];

export default function PromotionsPage() {
  return (
    <div className="pb-6">
      <header className="px-4 pt-6 pb-4">
        <h1 className="font-display text-2xl font-semibold text-foreground">Ưu đãi</h1>
        <p className="text-muted-foreground text-sm mt-1">Khuyến mãi đang diễn ra</p>
      </header>
      <div className="px-4 space-y-3.5">
        {PROMOS.map((p) => (
          <BannerCard
            key={p.id}
            title={p.title}
            subtitle={p.subtitle}
            discountPercent={p.discount}
            ctaLabel="Xem chi tiết →"
          />
        ))}
      </div>
    </div>
  );
}
