import { redirect } from "next/navigation";

// redirect / → /home
export default function LocaleRootPage() {
  redirect("/home");
}
