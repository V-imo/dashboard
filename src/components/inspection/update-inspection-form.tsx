"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import DeleteInspectionButton from "./delete-inspection-button";
import InspectionRoomsManager from "./inspection-rooms-manager";

export default function UpdateInspectionForm(props: {
  inspection?: Inspection;
  property?: Property;
}) {
  const router = useRouter();
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
      toast.success("Inspection updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update inspection");
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
          <CardTitle>Inspection Details</CardTitle>
          <CardDescription>Update the inspection information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
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
              placeholder="Date"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
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
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TO_DO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
                <SelectItem value="CANCELED">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="inspectorId">Inspector ID (Optional)</Label>
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
              placeholder="Inspector ID"
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
              Updating...
            </>
          ) : (
            "Update Inspection"
          )}
        </Button>
      </div>
    </div>
  );
}
