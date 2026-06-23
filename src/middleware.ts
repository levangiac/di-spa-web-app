import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Routes yêu cầu đăng nhập (Guest không được vào)
// /home, /search, /spa/[id] — public (Guest xem được theo domain-model.md)
const PROTECTED_PREFIXES = [
  "/booking",
  "/account",
  "/history",
  "/notifications",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Bỏ locale prefix (/en, /ja) để match path thực
  const pathWithoutLocale =
    pathname.replace(/^\/(en|ja)(?=\/|$)/, "") || "/";

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) =>
      pathWithoutLocale === prefix ||
      pathWithoutLocale.startsWith(prefix + "/"),
  );

  if (isProtected && !req.auth) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",
    "/(vi|en|ja)/:path*",
  ],
};
