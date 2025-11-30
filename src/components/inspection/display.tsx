import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import {
  Inspection,
  Property,
  Room,
  RoomElement,
} from "@/lib/dashboard-mgt-bff";
import { Calendar, UserCheck, Home } from "lucide-react";
import InspectionStatusBadge from "./status-badge";
import ElementStateBadge from "../shared/element-state-badge";
import { getElementTypeConfig } from "../shared/element-type-icon";
import { Badge } from "../ui/badge";

interface InspectionDisplayProps {
  inspection: Inspection;
  property?: Property;
  propertyRooms?: Room[];
  propertyRoomElements?: RoomElement[];
}

export default function InspectionDisplay({
  inspection,
  property,
  propertyRooms,
  propertyRoomElements,
}: InspectionDisplayProps) {
  const inspectionDate = inspection.date
    ? new Date(inspection.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not set";

  // Create a map of property elements by elementId for reference
  const propertyElementTypesByElementId = new Map<string, string>();
  if (propertyRoomElements) {
    propertyRoomElements.forEach((element) => {
      propertyElementTypesByElementId.set(element.elementId, element.type);
    });
  }

  // Group inspection elements by room (using elementId to find room)
  const elementsByRoom = new Map<
    string,
    NonNullable<typeof inspection.elements>
  >();
  if (inspection.elements && propertyRooms && propertyRoomElements) {
    inspection.elements.forEach((element) => {
      // Find which room this element belongs to
      const roomElement = propertyRoomElements.find(
        (re) => re.elementId === element.elementId
      );
      if (roomElement) {
        const room = propertyRooms.find((r) => r.roomId === roomElement.roomId);
        if (room) {
          const roomName = room.name;
          if (!elementsByRoom.has(roomName)) {
            elementsByRoom.set(roomName, []);
          }
          const roomElements = elementsByRoom.get(roomName)!;
          roomElements.push(element);
        }
      } else {
        // Element not found in property - put in "Other" category
        if (!elementsByRoom.has("Other")) {
          elementsByRoom.set("Other", []);
        }
        const otherElements = elementsByRoom.get("Other")!;
        otherElements.push(element);
      }
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
                Inspection Details
              </CardTitle>
            </div>
            <InspectionStatusBadge status={inspection.status} />
          </div>
          <CardDescription>Inspection information and status</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Label className="text-xs text-muted-foreground">Date</Label>
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
                  Inspector ID
                </Label>
                <p className="text-sm font-medium break-words">
                  {inspection.inspectorId}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inspection Elements */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base sm:text-lg">
                Inspection Elements
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm w-fit">
              {inspection.elements?.length || 0} element
              {inspection.elements?.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <CardDescription>
            Elements inspected during this inspection
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:gap-6">
          {inspection.elements && inspection.elements.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {Array.from(elementsByRoom.entries()).map(
                ([roomName, elements]) => {
                  return (
                    <div
                      key={roomName}
                      className="border rounded-lg p-4 space-y-3 bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base break-words">
                            {roomName}
                          </h4>
                        </div>
                        {elements.length > 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs flex-shrink-0"
                          >
                            {elements.length} element
                            {elements.length !== 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                      {elements.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <Label className="text-xs text-muted-foreground">
                            Elements
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {elements.map((element, elementIndex) => {
                              // Try to get type from property, fallback to OTHER
                              const elementType =
                                propertyElementTypesByElementId.get(
                                  element.elementId
                                ) || "OTHER";
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
                }
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No elements inspected
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
