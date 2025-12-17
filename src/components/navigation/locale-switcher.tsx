"use client";

import { Locale } from "next-intl";
import { useTransition } from "react";
import { usePathname, getPathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
};

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const currentLocale = useLocale();

  function onValueChange(nextLocale: Locale) {
    if (nextLocale !== currentLocale) {
      startTransition(() => {
        const newPathname = getPathname({ locale: nextLocale, href: pathname });
        window.location.href = newPathname;
      });
    }
  }

  return (
    <Select
      value={currentLocale}
      onValueChange={onValueChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder={t("language")} />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            <span className="flex items-center gap-2">
              <span>{localeFlags[locale]}</span>
              <span>{localeLabels[locale]}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}