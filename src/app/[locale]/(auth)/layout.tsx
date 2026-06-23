// Layout trang auth — không có nav, background gradient nhẹ
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-brand-soft p-4">
      {children}
    </div>
  );
}
