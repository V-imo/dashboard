"use server";

import { Suspense } from "react";
import { getModels } from "@/lib/dashboard-mgt-bff/api";
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
import LoadingBar from "@/components/ui/loading-bar";
import { auth } from "@/lib/auth";

async function ModelPageContent() {
  const session = await auth();
  const [models, t] = await Promise.all([
    getModels(defaultId, session),
    getTranslations("ModelPage"),
  ]);

  if (!models || models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {t("noModelsFound")}
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
          <CardTitle>{t("models")}</CardTitle>
          <CardDescription>{t("listOfAllModels")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead className="text-right">{t("rooms")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow
                  key={model.modelId}
                  className="cursor-pointer hover:bg-muted/50 group"
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/model/${model.modelId}`}
                      className="block w-full group-hover:underline"
                    >
                      {model.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/model/${model.modelId}`}
                      className="block w-full"
                    >
                      {model.rooms?.length || 0}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function ModelPage() {
  return (
    <Suspense fallback={<LoadingBar />}>
      <ModelPageContent />
    </Suspense>
  );
}
