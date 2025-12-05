"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { defaultId } from "@/protoype";
import { deleteInspection } from "@/lib/dashboard-mgt-bff/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TrashIcon } from "lucide-react";

export default function DeleteInspectionButton(props: {
  propertyId: string;
  inspectionId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const del = async () => {
    try {
      setLoading(true);
      await deleteInspection(defaultId, props.propertyId, props.inspectionId);
      toast.success("Inspection deleted successfully");
      router.push(`/property/${props.propertyId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete inspection");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button variant="destructive" disabled={loading} size="lg" onClick={del}>
      <TrashIcon className="w-4 h-4" /> Delete Inspection
    </Button>
  );
}
