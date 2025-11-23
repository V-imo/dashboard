"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PlusIcon } from "lucide-react";
import { Property, Inspection } from "@/lib/dashboard-mgt-bff";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import InspectionElementEditor from "./inspection-element-editor";

type PropertyRoom = Property["rooms"][number];
type PropertyElement = PropertyRoom["elements"][number];
type InspectionRoom = Inspection["rooms"][number];
type InspectionElement = InspectionRoom["elements"][number];

interface InspectionRoomsManagerProps {
  propertyRooms: PropertyRoom[];
  inspectionRooms: InspectionRoom[];
  onChange: (rooms: InspectionRoom[]) => void;
}

export default function InspectionRoomsManager({
  propertyRooms,
  inspectionRooms,
  onChange,
}: InspectionRoomsManagerProps) {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(
    propertyRooms.length > 0 ? 0 : null
  );
  const [newElementName, setNewElementName] = useState("");

  // Get current property room
  const currentPropertyRoom =
    selectedRoomIndex !== null ? propertyRooms[selectedRoomIndex] : null;

  // Get or create inspection room for current property room
  const getInspectionRoom = (propertyRoomIndex: number): InspectionRoom => {
    const propertyRoom = propertyRooms[propertyRoomIndex];
    const existingInspectionRoom = inspectionRooms.find(
      (r) => r.name === propertyRoom.name
    );
    return (
      existingInspectionRoom || {
        name: propertyRoom.name,
        description: propertyRoom.description || "",
        elements: [],
      }
    );
  };

  // Get or create inspection element for a property element
  const getInspectionElement = (
    roomName: string,
    propertyElement: PropertyElement
  ): InspectionElement => {
    const inspectionRoom = inspectionRooms.find((r) => r.name === roomName);
    const existingElement = inspectionRoom?.elements.find(
      (e) => e.name === propertyElement.name
    );
    return (
      existingElement || {
        name: propertyElement.name,
        description: propertyElement.description || "",
        state: "NEW",
        images: [],
      }
    );
  };

  // Update inspection element (creates if doesn't exist)
  const updateInspectionElement = (
    roomName: string,
    propertyElement: PropertyElement | null,
    elementName: string,
    updates: Partial<InspectionElement>
  ) => {
    const updatedRooms = [...inspectionRooms];
    let roomIndex = updatedRooms.findIndex((r) => r.name === roomName);

    // Create room if it doesn't exist
    if (roomIndex === -1) {
      const propertyRoom = propertyRooms.find((r) => r.name === roomName);
      if (propertyRoom) {
        updatedRooms.push({
          name: roomName,
          description: propertyRoom.description || "",
          elements: [],
        });
        roomIndex = updatedRooms.length - 1;
      } else {
        return;
      }
    }

    // Find or create element
    const elementIndex = updatedRooms[roomIndex].elements.findIndex(
      (e) => e.name === elementName
    );

    if (elementIndex >= 0) {
      // Update existing element
      updatedRooms[roomIndex].elements[elementIndex] = {
        ...updatedRooms[roomIndex].elements[elementIndex],
        ...updates,
      };
    } else {
      // Create new element
      const newElement: InspectionElement = {
        name: elementName,
        description: propertyElement?.description || updates.description || "",
        state: updates.state || "NEW",
        images: [],
        ...updates,
      };
      updatedRooms[roomIndex].elements.push(newElement);
    }

    onChange(updatedRooms);
  };

  // Remove inspection element
  const removeInspectionElement = (roomName: string, elementName: string) => {
    const updatedRooms = [...inspectionRooms];
    const roomIndex = updatedRooms.findIndex((r) => r.name === roomName);

    if (roomIndex >= 0) {
      updatedRooms[roomIndex].elements = updatedRooms[
        roomIndex
      ].elements.filter((e) => e.name !== elementName);
      onChange(updatedRooms);
    }
  };

  // Update room description
  const updateRoomDescription = (roomName: string, description: string) => {
    const updatedRooms = [...inspectionRooms];
    const roomIndex = updatedRooms.findIndex((r) => r.name === roomName);

    if (roomIndex >= 0) {
      updatedRooms[roomIndex].description = description;
    } else {
      // Create new room if it doesn't exist
      const propertyRoom = propertyRooms.find((r) => r.name === roomName);
      if (propertyRoom) {
        updatedRooms.push({
          name: roomName,
          description,
          elements: [],
        });
      }
    }

    onChange(updatedRooms);
  };

  // Add new element (inspection-only, not from property)
  const addNewElement = () => {
    if (
      !newElementName.trim() ||
      !currentPropertyRoom ||
      selectedRoomIndex === null
    )
      return;

    const roomName = currentPropertyRoom.name;
    const elementExists = inspectionRooms
      .find((r) => r.name === roomName)
      ?.elements.some((e) => e.name === newElementName.trim());

    if (elementExists) {
      setNewElementName("");
      return;
    }

    updateInspectionElement(roomName, null, newElementName.trim(), {
      name: newElementName.trim(),
      description: "",
      state: "NEW",
    });

    setNewElementName("");
  };

  if (propertyRooms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inspection Rooms</CardTitle>
          <CardDescription>No rooms available in this property</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentInspectionRoom = currentPropertyRoom
    ? getInspectionRoom(selectedRoomIndex!)
    : null;

  // Use horizontal buttons for few rooms, dropdown for many
  const useButtons = propertyRooms.length <= 5;

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      <Card>
        <CardHeader>
          <CardTitle>Inspection Rooms</CardTitle>
          <CardDescription>
            Select rooms and inspect elements directly. Add new elements if
            needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {useButtons ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {propertyRooms.map((room, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedRoomIndex === index ? "default" : "outline"
                    }
                    onClick={() => setSelectedRoomIndex(index)}
                    size="sm"
                  >
                    {room.name || `Room ${index + 1}`}
                  </Button>
                ))}
              </div>
              {currentPropertyRoom && currentInspectionRoom && (
                <RoomContent
                  propertyRoom={currentPropertyRoom}
                  inspectionRoom={currentInspectionRoom}
                  onUpdateElement={updateInspectionElement}
                  onRemoveElement={removeInspectionElement}
                  onUpdateDescription={updateRoomDescription}
                  onAddNewElement={addNewElement}
                  newElementName={newElementName}
                  setNewElementName={setNewElementName}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <Label>Select Room</Label>
                <Select
                  value={selectedRoomIndex?.toString() || ""}
                  onValueChange={(value) =>
                    setSelectedRoomIndex(parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyRooms.map((room, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {room.name || `Room ${index + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {currentPropertyRoom && currentInspectionRoom && (
                <RoomContent
                  propertyRoom={currentPropertyRoom}
                  inspectionRoom={currentInspectionRoom}
                  onUpdateElement={updateInspectionElement}
                  onRemoveElement={removeInspectionElement}
                  onUpdateDescription={updateRoomDescription}
                  onAddNewElement={addNewElement}
                  newElementName={newElementName}
                  setNewElementName={setNewElementName}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface RoomContentProps {
  propertyRoom: PropertyRoom;
  inspectionRoom: InspectionRoom;
  onUpdateElement: (
    roomName: string,
    propertyElement: PropertyElement | null,
    elementName: string,
    updates: Partial<InspectionElement>
  ) => void;
  onRemoveElement: (roomName: string, elementName: string) => void;
  onUpdateDescription: (roomName: string, description: string) => void;
  onAddNewElement: () => void;
  newElementName: string;
  setNewElementName: (name: string) => void;
}

function RoomContent({
  propertyRoom,
  inspectionRoom,
  onUpdateElement,
  onRemoveElement,
  onUpdateDescription,
  onAddNewElement,
  newElementName,
  setNewElementName,
}: RoomContentProps) {
  // Get inspection element for a property element, or create default
  const getElementForProperty = (
    propertyElement: PropertyElement
  ): InspectionElement => {
    const inspectionElement = inspectionRoom.elements.find(
      (e) => e.name === propertyElement.name
    );
    return (
      inspectionElement || {
        name: propertyElement.name,
        description: propertyElement.description || "",
        state: "NEW",
        images: [],
      }
    );
  };

  // Get all inspection-only elements (not from property)
  const inspectionOnlyElements = inspectionRoom.elements.filter(
    (e) => !propertyRoom.elements.some((pe) => pe.name === e.name)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Room Description */}
      <div className="flex flex-col gap-2">
        {propertyRoom.description && (
          <div className="text-sm text-muted-foreground">
            {propertyRoom.description}
          </div>
        )}
        <div>
          <Label htmlFor={`room-${propertyRoom.name}-description`}>
            Room Description
          </Label>
          <Input
            id={`room-${propertyRoom.name}-description`}
            type="text"
            value={inspectionRoom.description || ""}
            onChange={(e) =>
              onUpdateDescription(propertyRoom.name, e.target.value)
            }
            placeholder="Inspection-specific room description (optional)"
          />
        </div>
      </div>

      {/* Property Elements - Direct editing */}
      {propertyRoom.elements.length > 0 && (
        <div className="flex flex-col gap-4">
          <Label className="text-base font-semibold">Property Elements</Label>
          <div className="flex flex-col gap-4">
            {propertyRoom.elements.map((propertyElement, index) => {
              const element = getElementForProperty(propertyElement);
              return (
                <InspectionElementEditor
                  key={index}
                  element={element}
                  propertyElement={propertyElement}
                  elementKey={`property-${index}`}
                  onUpdate={(updates) =>
                    onUpdateElement(
                      propertyRoom.name,
                      propertyElement,
                      element.name,
                      updates
                    )
                  }
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Inspection-Only Elements (not from property) */}
      {inspectionOnlyElements.length > 0 && (
        <div className="flex flex-col gap-4">
          <Label className="text-base font-semibold">Additional Elements</Label>
          <div className="flex flex-col gap-4">
            {inspectionOnlyElements.map((element, elementIndex) => (
              <InspectionElementEditor
                key={elementIndex}
                element={element}
                propertyElement={null}
                elementKey={`additional-${elementIndex}`}
                onUpdate={(updates) =>
                  onUpdateElement(
                    propertyRoom.name,
                    null,
                    element.name,
                    updates
                  )
                }
                onRemove={() =>
                  onRemoveElement(propertyRoom.name, element.name)
                }
                isAdditional={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add New Element Section */}
      <div className="flex flex-col gap-3">
        <Label>Add New Element</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newElementName}
            onChange={(e) => setNewElementName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newElementName.trim()) {
                onAddNewElement();
              }
            }}
            placeholder="Element name"
            className="flex-1"
          />
          <Button
            onClick={onAddNewElement}
            disabled={!newElementName.trim()}
            variant="outline"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
