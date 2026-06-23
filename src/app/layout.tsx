// Root layout — chỉ render html wrapper, locale layout nằm trong [locale]
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Di Spa", template: "%s | Di Spa" },
  description: "Đặt lịch spa & wellness tại nhà",
  themeColor: "#B96B78",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
