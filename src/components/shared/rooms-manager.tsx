"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PlusIcon, TrashIcon, PencilIcon, DownloadIcon, XIcon } from "lucide-react";
import { Property, Model } from "@/lib/dashboard-mgt-bff";
import { getModels } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { toast } from "sonner";
import ElementManager from "./element-manager";
import { cn } from "@/lib/utils";

export type Room = Property["rooms"][number];
export type Element = Room["elements"][number];

interface RoomsManagerProps {
  rooms: Room[];
  onChange: (rooms: Room[]) => void;
}

export default function RoomsManager({ rooms, onChange }: RoomsManagerProps) {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(null);
  const [editingRoomName, setEditingRoomName] = useState<number | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (importDialogOpen) {
      loadModels();
    }
  }, [importDialogOpen]);

  const loadModels = async () => {
    try {
      setLoadingModels(true);
      const fetchedModels = await getModels(defaultId);
      setModels(fetchedModels || []);
    } catch (error) {
      toast.error("Failed to load models");
      console.error(error);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleImportModel = (model: Model) => {
    if (!model.rooms || model.rooms.length === 0) {
      toast.error("This model has no rooms to import");
      return;
    }
    // Merge imported rooms with existing rooms
    onChange([...rooms, ...model.rooms]);
    toast.success(
      `Imported ${model.rooms.length} room(s) from "${model.name}"`
    );
    setImportDialogOpen(false);
  };

  const addRoom = () => {
    const newRoomIndex = rooms.length;
    setEditingRoomName(newRoomIndex);
    setSelectedRoomIndex(newRoomIndex);
    onChange([
      ...rooms,
      { name: "", description: "", area: undefined, elements: [] },
    ]);
  };

  const removeRoom = (roomIndex: number) => {
    const updatedRooms = rooms.filter((_, index) => index !== roomIndex);
    onChange(updatedRooms);
    
    // Adjust selected room index if needed
    if (selectedRoomIndex === roomIndex) {
      if (updatedRooms.length > 0) {
        setSelectedRoomIndex(Math.min(roomIndex, updatedRooms.length - 1));
      } else {
        setSelectedRoomIndex(null);
      }
    } else if (selectedRoomIndex !== null && selectedRoomIndex > roomIndex) {
      setSelectedRoomIndex(selectedRoomIndex - 1);
    }
  };

  const updateRoom = (roomIndex: number, updates: Partial<Room>) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex] = { ...updatedRooms[roomIndex], ...updates };
    onChange(updatedRooms);
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
    updates: Partial<Element>
  ) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].elements[elementIndex] = {
      ...updatedRooms[roomIndex].elements[elementIndex],
      ...updates,
    };
    onChange(updatedRooms);
  };

  // Auto-select first room when rooms are added
  useEffect(() => {
    if (rooms.length > 0 && selectedRoomIndex === null) {
      setSelectedRoomIndex(0);
    } else if (rooms.length === 0) {
      setSelectedRoomIndex(null);
    }
  }, [rooms.length, selectedRoomIndex]);

  const selectedRoom = selectedRoomIndex !== null ? rooms[selectedRoomIndex] : null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rooms</CardTitle>
              <CardDescription>
                Add rooms and their elements to the property
              </CardDescription>
            </div>
            <Dialog
              open={importDialogOpen}
              onOpenChange={setImportDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Import Model
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Rooms from Model</DialogTitle>
                  <DialogDescription>
                    Select a model to import its rooms. The rooms will be
                    added to your existing rooms.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 py-4 max-h-[400px] overflow-y-auto">
                  {loadingModels ? (
                    <div className="text-center text-muted-foreground py-4">
                      Loading models...
                    </div>
                  ) : models.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                      No models available
                    </div>
                  ) : (
                    models.map((model) => (
                      <Button
                        key={model.modelId}
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleImportModel(model)}
                        disabled={!model.rooms || model.rooms.length === 0}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{model.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {model.rooms?.length || 0} room(s)
                          </span>
                        </div>
                      </Button>
                    ))
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setImportDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Room Tabs Menu */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b">
            {rooms.map((room, roomIndex) => {
              const isSelected = selectedRoomIndex === roomIndex;
              const isEditingName = editingRoomName === roomIndex;
              const showNameInput = !room.name || isEditingName;

              return (
                <div
                  key={roomIndex}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-t-md border-b-2 transition-colors cursor-pointer min-w-0 shrink-0",
                    isSelected
                      ? "border-primary bg-accent"
                      : "border-transparent hover:bg-accent/50"
                  )}
                  onClick={() => {
                    setSelectedRoomIndex(roomIndex);
                    setEditingRoomName(null);
                  }}
                >
                  {isEditingName ? (
                    <Input
                      type="text"
                      value={room.name}
                      onChange={(e) => {
                        updateRoom(roomIndex, { name: e.target.value });
                      }}
                      onBlur={() => {
                        if (room.name.trim()) {
                          setEditingRoomName(null);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && room.name.trim()) {
                          setEditingRoomName(null);
                        }
                        if (e.key === "Escape") {
                          setEditingRoomName(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Room name"
                      className="h-7 px-2 text-sm min-w-[100px]"
                      autoFocus
                    />
                  ) : (
                    <>
                      <span className="text-sm font-medium truncate max-w-[120px]">
                        {room.name || `Room ${roomIndex + 1}`}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRoomName(roomIndex);
                        }}
                      >
                        <PencilIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 shrink-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRoom(roomIndex);
                        }}
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
            <Button
              onClick={addRoom}
              variant="outline"
              size="sm"
              className="shrink-0 ml-auto"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </div>

          {/* Selected Room Content */}
          {rooms.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No rooms added yet. Click "Add Room" to get started.
            </div>
          ) : selectedRoom && selectedRoomIndex !== null ? (
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor={`room-${selectedRoomIndex}-description`}>
                    Description
                  </Label>
                  <Input
                    id={`room-${selectedRoomIndex}-description`}
                    type="text"
                    value={selectedRoom.description || ""}
                    onChange={(e) =>
                      updateRoom(selectedRoomIndex, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Room description (optional)"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`room-${selectedRoomIndex}-area`}>
                    Area (m²)
                  </Label>
                  <Input
                    id={`room-${selectedRoomIndex}-area`}
                    type="number"
                    value={selectedRoom.area || ""}
                    onChange={(e) =>
                      updateRoom(selectedRoomIndex, {
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
                    onClick={() => addElement(selectedRoomIndex)}
                    variant="outline"
                    size="sm"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Element
                  </Button>
                </div>

                {selectedRoom.elements.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-4 text-center border rounded-md">
                    No elements added. Click "Add Element" to add one.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {selectedRoom.elements.map((element, elementIndex) => (
                      <ElementManager
                        key={elementIndex}
                        element={element}
                        elementIndex={elementIndex}
                        roomIndex={selectedRoomIndex}
                        onUpdate={(updates) =>
                          updateElement(selectedRoomIndex, elementIndex, updates)
                        }
                        onRemove={() =>
                          removeElement(selectedRoomIndex, elementIndex)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
