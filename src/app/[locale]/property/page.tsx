"use server";

import { getProperties } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { Link } from "@/i18n/navigation";
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
import { getTranslations } from "next-intl/server";

export default async function PropertyPage() {
  const properties = await getProperties(defaultId);
  const t = await getTranslations("PropertyPage");

  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {t("noPropertiesFound")}
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
          <CardTitle>{t("properties")}</CardTitle>
          <CardDescription>{t("listOfAllProperties")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("owner")}</TableHead>
                <TableHead>{t("address")}</TableHead>
                <TableHead className="text-right">{t("rooms")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => {
                const ownerName = property.owner
                  ? `${property.owner.firstName} ${property.owner.lastName}`
                  : t("nA");
                const address = `${property.address.number} ${property.address.street}, ${property.address.city} ${property.address.zipCode}`;
                return (
                  <TableRow
                    key={property.propertyId}
                    className="cursor-pointer hover:bg-muted/50 group"
                  >
                    <TableCell className="font-medium">
                      <Link
                        href={`/property/${property.propertyId}`}
                        className="block w-full group-hover:underline"
                      >
                        {ownerName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/property/${property.propertyId}`}
                        className="block w-full group-hover:underline"
                      >
                        {address}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/property/${property.propertyId}`}
                        className="block w-full"
                      >
                        {property.rooms?.length || 0}
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
