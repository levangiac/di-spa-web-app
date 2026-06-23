import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en", "ja"],
  defaultLocale: "vi",
  localePrefix: "as-needed", // vi không có prefix, /en/..., /ja/...
});
