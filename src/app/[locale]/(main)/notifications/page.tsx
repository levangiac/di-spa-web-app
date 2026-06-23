import type { Metadata } from "next";
export const metadata: Metadata = { title: "Thông báo" };
export default function NotificationsPage() {
  return (
    <div className="px-4 pt-6">
      <h1 className="font-display text-2xl font-semibold text-foreground">Thông báo</h1>
      <p className="text-muted-foreground text-sm mt-2">Không có thông báo mới.</p>
    </div>
  );
}
