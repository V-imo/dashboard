"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { defaultId } from "@/protoype";
import { deleteProperty } from "@/lib/dashboard-mgt-bff/api";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DeletePropertyButton(props: { propertyId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("PropertyDeleteButton");
  const del = async () => {
    try {
      setLoading(true);
      await deleteProperty(defaultId, props.propertyId);
      toast.success(t("propertyDeletedSuccess"));
      router.push("/property");
    } catch (error) {
      console.error(error);
      toast.error(t("failedToDeleteProperty"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button variant="destructive" disabled={loading} size="lg" onClick={del}>
      {" "}
      <TrashIcon className="w-4 h-4" /> {t("deleteProperty")}
    </Button>
  );
}
