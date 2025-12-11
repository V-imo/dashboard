"use client";

import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar } from "lucide-react";
import { Inspection } from "@/lib/dashboard-mgt-bff";
import { Link } from "@/i18n/navigation";
import InspectionStatusBadge from "../inspection/status-badge";
import { useTranslations, useLocale } from "next-intl";

interface InspectionsCarouselProps {
  inspections: Inspection[];
  propertyId: string;
}

export default function InspectionsCarousel({
  inspections,
  propertyId,
}: InspectionsCarouselProps) {
  const t = useTranslations("PropertyInspectionsCarousel");
  const locale = useLocale();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sort inspections by date (oldest first, latest at the right)
  const sortedInspections = [...inspections].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  // Scroll to the end (right) to show the latest inspection by default
  useEffect(() => {
    if (scrollContainerRef.current && sortedInspections.length > 0) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [sortedInspections.length]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-base sm:text-lg">
            {t("inspections")}
          </CardTitle>
        </div>
        <CardDescription>{t("recentInspections")}</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedInspections.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t("noInspectionsFound")}
          </p>
        ) : (
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent scroll-smooth"
          >
            <div className="flex gap-4 min-w-max">
              {sortedInspections.map((inspection) => {
                const inspectionDate = new Date(inspection.date);
                const formattedDate = inspectionDate.toLocaleDateString(
                  locale,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                );

                return (
                  <Link
                    key={inspection.inspectionId}
                    href={`/property/${propertyId}/inspection/${inspection.inspectionId}`}
                    className="flex-shrink-0 w-64 sm:w-72"
                  >
                    <Card className="h-full hover:shadow-md transition-all cursor-pointer border-2 hover:border-primary/50 hover:scale-[1.02]">
                      <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <InspectionStatusBadge status={inspection.status} />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">{formattedDate}</span>
                        </div>
                        {inspection.rooms && inspection.rooms.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {inspection.rooms.length}{" "}
                            {inspection.rooms.length !== 1
                              ? t("rooms")
                              : t("room")}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
