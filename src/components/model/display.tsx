"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Model } from "@/lib/dashboard-mgt-bff";
import { Building2, Home } from "lucide-react";
import { getElementTypeConfig } from "../shared/element-type-icon";
import { Badge } from "../ui/badge";
import { getTranslations } from "next-intl/server";

interface ModelDisplayProps {
  model: Model;
}

export default async function ModelDisplay({ model }: ModelDisplayProps) {
  const t = await getTranslations("ModelDisplay");
  const tShared = await getTranslations("Shared");
  return (
    <div className="flex flex-col gap-6 max-w-6xl w-full px-4 sm:px-6">
      {/* Model Name */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-xl sm:text-2xl break-words">
              {model.name}
            </CardTitle>
          </div>
          <CardDescription>{t("modelInformation")}</CardDescription>
        </CardHeader>
      </Card>

      {/* Rooms Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base sm:text-lg">
                {t("rooms")}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm w-fit">
              {model.rooms?.length || 0}{" "}
              {model.rooms?.length !== 1 ? t("rooms") : t("room")}
            </Badge>
          </div>
          <CardDescription>{t("roomsAndElements")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:gap-6">
          {model.rooms && model.rooms.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {model.rooms.map((room, roomIndex) => (
                <div
                  key={roomIndex}
                  className="border rounded-lg p-4 space-y-3 bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base break-words">
                        {room.name}
                      </h4>
                      {room.area && (
                        <p className="text-sm text-muted-foreground">
                          {room.area} {tShared("squareMeters")}
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
                  {room.description && (
                    <p className="text-sm text-muted-foreground break-words">
                      {room.description}
                    </p>
                  )}
                  {room.elements && room.elements.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <Label className="text-xs text-muted-foreground">
                        {t("elements")}
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {room.elements.map((element, elementIndex) => {
                          const typeConfig = getElementTypeConfig(element.type);
                          const Icon = typeConfig.icon;
                          return (
                            <div
                              key={elementIndex}
                              className="flex items-center gap-2 p-2 rounded-md bg-background border"
                            >
                              <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {element.name}
                                </p>
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
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("noRoomsDefined")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
