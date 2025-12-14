"use server";

import { Suspense } from "react";
import UpdateAgencyForm from "@/components/agency/update-form";
import AgencyDisplay from "@/components/agency/display";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAgency } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PencilIcon, XIcon } from "lucide-react";
import { unauthorized } from "next/navigation";
import { getTranslations } from "next-intl/server";
import LoadingBar from "@/components/ui/loading-bar";
import { auth } from "@/lib/auth";

async function AgencyPageContent({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await auth();
  const [agency, t, { edit }] = await Promise.all([
    getAgency(defaultId, session),
    getTranslations("AgencyPage"),
    searchParams,
  ]);
  const isEditMode = edit === "true";

  if (!agency) {
    unauthorized();
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <div className="flex justify-end w-full max-w-4xl">
        {isEditMode ? (
          <Button asChild variant="outline" size="lg">
            <Link href="/agency">
              <XIcon className="w-4 h-4 mr-2" />
              {t("cancel")}
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg">
            <Link href="/agency?edit=true">
              <PencilIcon className="w-4 h-4 mr-2" />
              {t("edit")}
            </Link>
          </Button>
        )}
      </div>
      {isEditMode ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("updateAgency")}</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateAgencyForm agency={agency} />
          </CardContent>
        </Card>
      ) : (
        <AgencyDisplay agency={agency} />
      )}
    </div>
  );
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  return (
    <Suspense fallback={<LoadingBar />}>
      <AgencyPageContent searchParams={searchParams} />
    </Suspense>
  );
}
