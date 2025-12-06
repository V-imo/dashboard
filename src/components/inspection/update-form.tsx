"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { updateInspection } from "@/lib/dashboard-mgt-bff/api";
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
import { Inspection, Property } from "@/lib/dashboard-mgt-bff";
import DeleteInspectionButton from "./delete-button";
import InspectionRoomsManager from "./rooms-manager";
import { useTranslations } from "next-intl";

export default function UpdateInspectionForm(props: {
  inspection?: Inspection;
  property?: Property;
}) {
  const router = useRouter();
  const t = useTranslations("InspectionUpdateForm");
  const [loading, setLoading] = useState(false);
  const [inspection, setInspection] = useState<Inspection>(
    props.inspection || {
      inspectionId: "",
      propertyId: "",
      agencyId: "",
      status: "TO_DO",
      date: "",
      inspectorId: "",
      rooms: [],
    }
  );

  // Only sync props to state when inspectionId changes (not on every props change)
  // This prevents overwriting user edits when parent re-renders
  const prevInspectionIdRef = useRef<string | undefined>(
    props.inspection?.inspectionId
  );
  useEffect(() => {
    if (
      props.inspection &&
      props.inspection.inspectionId !== prevInspectionIdRef.current
    ) {
      setInspection(props.inspection);
      prevInspectionIdRef.current = props.inspection.inspectionId;
    }
  }, [props.inspection]);

  const submit = async () => {
    try {
      setLoading(true);
      await updateInspection({
        ...inspection,
        inspectionId: props.inspection?.inspectionId || inspection.inspectionId,
        propertyId: props.inspection?.propertyId || inspection.propertyId,
        agencyId: props.inspection?.agencyId || inspection.agencyId,
      });
      toast.success(t("inspectionUpdatedSuccess"));
      router.refresh();
    } catch (error) {
      toast.error(t("failedToUpdateInspection"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      {/* Inspection Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("inspectionDetails")}</CardTitle>
          <CardDescription>{t("updateInspectionInfo")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
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

          <div>
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

      {/* Inspection Rooms Section */}
      {props.property && (
        <InspectionRoomsManager
          propertyRooms={props.property.rooms || []}
          inspectionRooms={inspection.rooms || []}
          onChange={(rooms) => setInspection({ ...inspection, rooms })}
        />
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        {inspection.inspectionId && inspection.propertyId && (
          <DeleteInspectionButton
            propertyId={inspection.propertyId}
            inspectionId={inspection.inspectionId}
          />
        )}
        <Button onClick={submit} size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("updating")}
            </>
          ) : (
            t("updateInspection")
          )}
        </Button>
      </div>
    </div>
  );
}
