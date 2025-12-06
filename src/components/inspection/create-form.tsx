"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createInspection } from "@/lib/dashboard-mgt-bff/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { defaultId } from "@/protoype";
import { Inspection, Property } from "@/lib/dashboard-mgt-bff";
import { useTranslations } from "next-intl";

export default function CreateInspectionForm(props: {
  propertyId: string;
  property?: Property;
}) {
  const router = useRouter();
  const t = useTranslations("InspectionCreateForm");
  const [loading, setLoading] = useState(false);
  const [inspection, setInspection] = useState<
    Omit<Inspection, "inspectionId">
  >({
    propertyId: props.propertyId,
    agencyId: defaultId,
    status: "TO_DO",
    date: "",
    inspectorId: "",
    rooms: [],
  });

  const submit = async () => {
    try {
      setLoading(true);
      const inspectionId = await createInspection(inspection as Inspection);
      toast.success(t("inspectionCreatedSuccess"));
      router.push(`/property/${props.propertyId}/inspection/${inspectionId}`);
    } catch (error) {
      toast.error(t("failedToCreateInspection"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      {/* Property Display Section */}
      {props.property && (
        <Card>
          <CardHeader>
            <CardTitle>{t("property")}</CardTitle>
            <CardDescription>{t("inspectionForProperty")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <span className="font-medium">{t("owner")}: </span>
                {props.property.owner?.firstName}{" "}
                {props.property.owner?.lastName}
              </div>
              <div>
                <span className="font-medium">{t("address")}: </span>
                {props.property.address.number} {props.property.address.street},{" "}
                {props.property.address.city} {props.property.address.zipCode},{" "}
                {props.property.address.country}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inspection Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("inspectionDetails")}</CardTitle>
          <CardDescription>{t("enterInspectionInfo")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="date">{t("date")}</Label>
              <Input
                id="date"
                type="datetime-local"
                value={
                  inspection.date
                    ? new Date(inspection.date).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setInspection({
                    ...inspection,
                    date: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : "",
                  })
                }
                placeholder={t("date")}
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="status">{t("status")}</Label>
              <Select
                value={inspection.status}
                onValueChange={(
                  value: "TO_DO" | "IN_PROGRESS" | "DONE" | "CANCELED"
                ) =>
                  setInspection({
                    ...inspection,
                    status: value,
                  })
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TO_DO">{t("toDo")}</SelectItem>
                  <SelectItem value="IN_PROGRESS">{t("inProgress")}</SelectItem>
                  <SelectItem value="DONE">{t("done")}</SelectItem>
                  <SelectItem value="CANCELED">{t("canceled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="inspectorId">{t("inspectorIdOptional")}</Label>
            <Input
              id="inspectorId"
              type="text"
              value={inspection.inspectorId || ""}
              onChange={(e) =>
                setInspection({
                  ...inspection,
                  inspectorId: e.target.value,
                })
              }
              placeholder={t("inspectorId")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={submit} size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("creating")}
            </>
          ) : (
            t("createInspection")
          )}
        </Button>
      </div>
    </div>
  );
}
