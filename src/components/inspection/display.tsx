"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Inspection, Property } from "@/lib/dashboard-mgt-bff";
import { Calendar, UserCheck, Home } from "lucide-react";
import InspectionStatusBadge from "./status-badge";
import ElementStateBadge from "../shared/element-state-badge";
import { getElementTypeConfig } from "../shared/element-type-icon";
import { Badge } from "../ui/badge";
import { getTranslations, getLocale } from "next-intl/server";

interface InspectionDisplayProps {
  inspection: Inspection;
  property?: Property;
}

export default async function InspectionDisplay({
  inspection,
  property,
}: InspectionDisplayProps) {
  const t = await getTranslations("InspectionDisplay");
  const locale = await getLocale();
  const inspectionDate = inspection.date
    ? new Date(inspection.date).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : t("notSet");

  // Create a map of property elements by room name for reference
  const propertyElementsByRoom = new Map<string, Map<string, string>>();
  if (property) {
    property.rooms.forEach((room) => {
      const elementMap = new Map<string, string>();
      room.elements?.forEach((element) => {
        elementMap.set(element.name, element.type);
      });
      propertyElementsByRoom.set(room.name, elementMap);
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl w-full px-4 sm:px-6">
      {/* Inspection Details */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base sm:text-lg">
                {t("inspectionDetails")}
              </CardTitle>
            </div>
            <InspectionStatusBadge status={inspection.status} />
          </div>
          <CardDescription>{t("inspectionInfo")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Label className="text-xs text-muted-foreground">
                {t("date")}
              </Label>
              <p className="text-sm font-medium break-words">
                {inspectionDate}
              </p>
            </div>
          </div>
          {inspection.inspectorId && (
            <div className="flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Label className="text-xs text-muted-foreground">
                  {t("inspectorId")}
                </Label>
                <p className="text-sm font-medium break-words">
                  {inspection.inspectorId}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inspection Rooms */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base sm:text-lg">
                {t("inspectionRooms")}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm w-fit">
              {inspection.rooms?.length || 0}{" "}
              {inspection.rooms?.length !== 1 ? t("rooms") : t("room")}
            </Badge>
          </div>
          <CardDescription>{t("roomsAndElementsInspected")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:gap-6">
          {inspection.rooms && inspection.rooms.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {inspection.rooms.map((room, roomIndex) => {
                const propertyElementTypes = propertyElementsByRoom.get(
                  room.name
                );
                return (
                  <div
                    key={roomIndex}
                    className="border rounded-lg p-4 space-y-3 bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base break-words">
                          {room.name}
                        </h4>
                        {room.description && (
                          <p className="text-sm text-muted-foreground break-words">
                            {room.description}
                          </p>
                        )}
                      </div>
                      {room.elements && room.elements.length > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs flex-shrink-0"
                        >
                          {room.elements.length}{" "}
                          {room.elements.length !== 1
                            ? t("elements")
                            : t("element")}
                        </Badge>
                      )}
                    </div>
                    {room.elements && room.elements.length > 0 && (
                      <div className="space-y-2 pt-2 border-t">
                        <Label className="text-xs text-muted-foreground">
                          {t("elements")}
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {room.elements.map((element, elementIndex) => {
                            // Try to get type from property, fallback to OTHER
                            const elementType =
                              propertyElementTypes?.get(element.name) ||
                              "OTHER";
                            const typeConfig =
                              getElementTypeConfig(elementType);
                            const Icon = typeConfig.icon;
                            return (
                              <div
                                key={elementIndex}
                                className="flex items-center gap-2 p-2 rounded-md bg-background border"
                              >
                                <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-medium truncate">
                                      {element.name}
                                    </p>
                                    {element.state && (
                                      <ElementStateBadge
                                        state={element.state}
                                      />
                                    )}
                                  </div>
                                  {element.description && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      {element.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("noRoomsInspected")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
