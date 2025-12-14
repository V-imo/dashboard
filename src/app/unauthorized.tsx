import { useLocale } from "next-intl";
import { redirect } from "@/i18n/navigation";

export default function Unauthorized() {
  const locale = useLocale();
  
  return redirect({ href: "/login", locale });
}