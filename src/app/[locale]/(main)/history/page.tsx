import type { Metadata } from "next";
export const metadata: Metadata = { title: "Lịch sử" };
export default function HistoryPage() {
  return (
    <div className="px-4 pt-6">
      <h1 className="font-display text-2xl font-semibold text-foreground">Lịch sử đặt lịch</h1>
      <p className="text-muted-foreground text-sm mt-2">Chưa có lịch sử đặt lịch nào.</p>
    </div>
  );
}
