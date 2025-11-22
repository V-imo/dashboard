"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateInspectionForm(props: {
  propertyId: string;
  property?: Property;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inspection, setInspection] = useState<
    Omit<Inspection, "inspectionId">
  >({
    propertyId: props.propertyId,
    agencyId: defaultId,
    status: "TO_DO",
    date: "",
    inspectorId: "",
  });

  // Validate that all required fields are filled
  const isFormValid = useMemo(() => {
    return inspection.date.trim() !== "" && inspection.status.trim() !== "";
  }, [inspection]);

  const submit = async () => {
    try {
      setLoading(true);
      const inspectionId = await createInspection(inspection as Inspection);
      toast.success("Inspection created successfully");
      router.push(`/property/${props.propertyId}/inspection/${inspectionId}`);
    } catch (error) {
      toast.error("Failed to create inspection");
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
            <CardTitle>Property</CardTitle>
            <CardDescription>
              This inspection will be created for the following property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <span className="font-medium">Owner: </span>
                {props.property.owner?.firstName}{" "}
                {props.property.owner?.lastName}
              </div>
              <div>
                <span className="font-medium">Address: </span>
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
          <CardTitle>Inspection Details</CardTitle>
          <CardDescription>Enter the inspection information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
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

            <div className="flex-1">
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

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={submit} disabled={!isFormValid || loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Inspection"
          )}
        </Button>
      </div>
    </div>
  );
}
