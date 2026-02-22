"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getInspectionPdfUrl } from "@/lib/report-generator/api";

interface ExportPdfButtonProps {
  agencyId: string;
  propertyId: string;
  inspectionId: string;
}

export default function ExportPdfButton({
  agencyId,
  propertyId,
  inspectionId,
}: ExportPdfButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const t = useTranslations("InspectionDisplay");

  const handleExport = async () => {
    try {
      setIsDownloading(true);
      const url = await getInspectionPdfUrl(agencyId, propertyId, inspectionId);
      window.open(url, "_blank");
    } catch {
      toast.error(t("exportPdfError"));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" disabled={isDownloading} onClick={handleExport}>
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {t("exportPdfLoading")}
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4" />
          {t("exportPdf")}
        </>
      )}
    </Button>
  );
}
