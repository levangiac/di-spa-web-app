import { getTranslations } from "next-intl/server";
import { BookingWizard } from "@/features/booking/components/booking-wizard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Đặt lịch" };

export default async function BookingPage() {
  const t = await getTranslations("booking");
  return (
    <div className="pb-8">
      <header className="px-4 pt-6 pb-4">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Chọn ngày, giờ và xác nhận
        </p>
      </header>
      <BookingWizard />
    </div>
  );
}
