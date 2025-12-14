"use server";

import { Suspense } from "react";
import { getInspections, getProperties } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { Link } from "@/i18n/navigation";
import InspectionStatusBadge from "@/components/inspection/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations, getLocale } from "next-intl/server";
import LoadingBar from "@/components/ui/loading-bar";
import { auth } from "@/lib/auth";

async function InspectionPageContent() {
  const session = await auth();
  const [inspections, properties, t, tPropertyPage, locale] = await Promise.all([
    getInspections(defaultId, session),
    getProperties(defaultId, session),
    getTranslations("InspectionPage"),
    getTranslations("PropertyPage"),
    getLocale(),
  ]);

  if (!inspections || inspections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {t("noInspectionsFound")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("inspections")}</CardTitle>
          <CardDescription>{t("listOfAllInspections")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{tPropertyPage("address")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => {
                const property = properties?.find(
                  (property) => property.propertyId === inspection.propertyId
                );
                const inspectionDate = inspection.date
                  ? new Date(inspection.date).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : tPropertyPage("nA");
                const propertyAddress = property
                  ? `${property.address.number} ${property.address.street}, ${property.address.city}`
                  : tPropertyPage("nA");
                return (
                  <TableRow
                    key={inspection.inspectionId}
                    className="cursor-pointer hover:bg-muted/50 group"
                  >
                    <TableCell>
                      <Link
                        href={`/property/${inspection.propertyId}/inspection/${inspection.inspectionId}`}
                        className="block w-full"
                      >
                        <InspectionStatusBadge status={inspection.status} />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/property/${inspection.propertyId}/inspection/${inspection.inspectionId}`}
                        className="block w-full group-hover:underline"
                      >
                        {inspectionDate}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/property/${inspection.propertyId}/inspection/${inspection.inspectionId}`}
                        className="block w-full group-hover:underline"
                      >
                        {propertyAddress}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function InspectionPage() {
  return (
    <Suspense fallback={<LoadingBar />}>
      <InspectionPageContent />
    </Suspense>
  );
}
