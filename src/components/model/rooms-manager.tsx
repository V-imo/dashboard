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
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react";
import { Model } from "@/lib/dashboard-mgt-bff";
import ModelElementManager from "./element-manager";

type ModelRoom = Model["rooms"][number];
type ModelElement = ModelRoom["elements"][number];

interface ModelRoomsManagerProps {
  rooms: ModelRoom[];
  onChange: (rooms: ModelRoom[]) => void;
}

export default function ModelRoomsManager({
  rooms,
  onChange,
}: ModelRoomsManagerProps) {
  const [editingRoomName, setEditingRoomName] = useState<number | null>(null);

  const addRoom = () => {
    setEditingRoomName(rooms.length);
    onChange([
      ...rooms,
      { name: "", description: "", area: undefined, elements: [] },
    ]);
  };

  const updateRoom = (roomIndex: number, updates: Partial<ModelRoom>) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex] = { ...updatedRooms[roomIndex], ...updates };
    onChange(updatedRooms);
  };

  const removeRoom = (roomIndex: number) => {
    onChange(rooms.filter((_, index) => index !== roomIndex));
  };

  const addElement = (roomIndex: number) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].elements.push({
      name: "",
      description: "",
      type: "OTHER",
      images: [],
    });
    onChange(updatedRooms);
  };

  const removeElement = (roomIndex: number, elementIndex: number) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].elements = updatedRooms[roomIndex].elements.filter(
      (_, index) => index !== elementIndex
    );
    onChange(updatedRooms);
  };

  const updateElement = (
    roomIndex: number,
    elementIndex: number,
    updates: Partial<ModelElement>
  ) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].elements[elementIndex] = {
      ...updatedRooms[roomIndex].elements[elementIndex],
      ...updates,
    };
    onChange(updatedRooms);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rooms</CardTitle>
              <CardDescription>
                Add rooms and their elements to the model
              </CardDescription>
            </div>
            <Button onClick={addRoom} variant="outline" size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {rooms.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No rooms added yet. Click "Add Room" to get started.
            </div>
          ) : (
            rooms.map((room, roomIndex) => {
              const isEditingName = editingRoomName === roomIndex;
              const showNameInput = !room.name || isEditingName;

              return (
                <Card key={roomIndex} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      {showNameInput ? (
                        <Input
                          id={`room-${roomIndex}-name`}
                          type="text"
                          value={room.name}
                          onChange={(e) =>
                            updateRoom(roomIndex, { name: e.target.value })
                          }
                          onBlur={() => {
                            if (room.name.trim()) {
                              setEditingRoomName(null);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && room.name.trim()) {
                              setEditingRoomName(null);
                            }
                          }}
                          placeholder="e.g., Living Room, Kitchen"
                          className="text-lg font-semibold"
                          autoFocus={isEditingName}
                        />
                      ) : (
                        <CardTitle className="text-lg">{room.name}</CardTitle>
                      )}
                      <div className="flex items-center gap-2">
                        {!showNameInput && (
                          <Button
                            onClick={() => setEditingRoomName(roomIndex)}
                            variant="ghost"
                            size="sm"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => removeRoom(roomIndex)}
                          variant="destructive"
                          size="sm"
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Remove Room
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`room-${roomIndex}-description`}>
                          Description
                        </Label>
                        <Input
                          id={`room-${roomIndex}-description`}
                          type="text"
                          value={room.description || ""}
                          onChange={(e) =>
                            updateRoom(roomIndex, {
                              description: e.target.value,
                            })
                          }
                          placeholder="Room description (optional)"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`room-${roomIndex}-area`}>
                          Area (m²)
                        </Label>
                        <Input
                          id={`room-${roomIndex}-area`}
                          type="number"
                          value={room.area || ""}
                          onChange={(e) =>
                            updateRoom(roomIndex, {
                              area: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            })
                          }
                          placeholder="Area in square meters (optional)"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <Label>Elements</Label>
                        <Button
                          onClick={() => addElement(roomIndex)}
                          variant="outline"
                          size="sm"
                        >
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Add Element
                        </Button>
                      </div>

                      {room.elements.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-4 text-center border rounded-md">
                          No elements added. Click "Add Element" to add one.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {room.elements.map((element, elementIndex) => (
                            <ModelElementManager
                              key={elementIndex}
                              element={element}
                              onUpdate={(updates) =>
                                updateElement(roomIndex, elementIndex, updates)
                              }
                              onRemove={() =>
                                removeElement(roomIndex, elementIndex)
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
