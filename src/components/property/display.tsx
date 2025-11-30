import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Property, Room, RoomElement } from "@/lib/dashboard-mgt-bff";
import { MapPin, Mail, Phone, User, Home } from "lucide-react";
import { getElementTypeConfig } from "../shared/element-type-icon";
import { Badge } from "../ui/badge";

interface PropertyDisplayProps {
  property: Property;
  rooms: Room[];
  roomElements: RoomElement[];
}

export default function PropertyDisplay({ property, rooms, roomElements }: PropertyDisplayProps) {
  const fullAddress = `${property.address.number} ${property.address.street}, ${property.address.city} ${property.address.zipCode}, ${property.address.country}`;

  return (
    <div className="flex flex-col gap-6 max-w-6xl w-full px-4 sm:px-6">
      {/* Address and Owner - Side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Address Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base sm:text-lg">Property Address</CardTitle>
            </div>
            <CardDescription>Location details of the property</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium break-words">{fullAddress}</p>
          </CardContent>
        </Card>

        {/* Owner Section */}
        {property.owner && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-base sm:text-lg">Property Owner</CardTitle>
              </div>
              <CardDescription>Contact information of the property owner</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="flex-1 min-w-0">
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="text-sm font-medium break-words">
                    {property.owner.firstName} {property.owner.lastName}
                  </p>
                </div>
              </div>
              {property.owner.mail && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-sm font-medium break-words">{property.owner.mail}</p>
                  </div>
                </div>
              )}
              {property.owner.phoneNumber && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs text-muted-foreground">
                      Phone Number
                    </Label>
                    <p className="text-sm font-medium break-words">
                      {property.owner.phoneNumber}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Rooms Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base sm:text-lg">Rooms</CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm w-fit">
              {rooms.length || 0} room{rooms.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <CardDescription>Rooms and elements in the property</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:gap-6">
          {rooms && rooms.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {rooms.map((room, roomIndex) => (
                <div
                  key={roomIndex}
                  className="border rounded-lg p-4 space-y-3 bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base break-words">{room.name}</h4>
                      {room.area && (
                        <p className="text-sm text-muted-foreground">
                          {room.area} m²
                        </p>
                      )}
                    </div>
                    {roomElements.filter((element) => element.roomId === room.roomId).length > 0 && (
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {roomElements.filter((element) => element.roomId === room.roomId).length} element
                        {roomElements.filter((element) => element.roomId === room.roomId).length !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  {room.description && (
                    <p className="text-sm text-muted-foreground break-words">
                      {room.description}
                    </p>
                  )}
                  {roomElements.filter((element) => element.roomId === room.roomId).length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <Label className="text-xs text-muted-foreground">
                        Elements
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {roomElements.filter((element) => element.roomId === room.roomId).map((element, elementIndex) => {
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
                                  {roomElements.find((e) => e.elementId === element.elementId)?.name}
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
              No rooms defined
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

