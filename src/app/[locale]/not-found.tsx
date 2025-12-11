"use client";

import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-6 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-6xl font-bold text-muted-foreground mb-4">
            404
          </div>
          <CardTitle className="text-2xl">{t("pageNotFound")}</CardTitle>
          <CardDescription>{t("pageNotFoundDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/">
                <HomeIcon className="w-4 h-4 mr-2" />
                {t("goHome")}
              </Link>
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              {t("goBack")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
