"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { deleteInspection } from "@/lib/dashboard-mgt-bff/api";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

export default function DeleteInspectionButton(props: {
  propertyId: string;
  inspectionId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations("InspectionDeleteButton");
  const del = async () => {
    try {
      setLoading(true);
      await deleteInspection(props.propertyId, props.inspectionId, session);
      toast.success(t("inspectionDeletedSuccess"));
      router.push(`/property/${props.propertyId}`);
    } catch (error) {
      console.error(error);
      toast.error(t("failedToDeleteInspection"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button variant="destructive" disabled={loading} size="lg" onClick={del}>
      <TrashIcon className="w-4 h-4" /> {t("deleteInspection")}
    </Button>
  );
}
