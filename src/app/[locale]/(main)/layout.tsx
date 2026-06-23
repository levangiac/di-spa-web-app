import { BottomNav } from "@/components/layout/bottom-nav";
import { DesktopHeader } from "@/components/layout/desktop-header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* top header — desktop only */}
      <DesktopHeader />

      {/* content: bottom padding cho bottom-nav mobile, top padding cho header desktop */}
      <main className="flex-1 flex flex-col pb-28 lg:pb-0 lg:pt-16">
        {children}
      </main>

      {/* bottom nav — mobile/tablet only (<1024px) */}
      <BottomNav />
    </div>
  );
}
