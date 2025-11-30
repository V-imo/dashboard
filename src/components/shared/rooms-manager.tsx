"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks";
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
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  DownloadIcon,
  Loader2,
} from "lucide-react";
import { Room, RoomElement, Model } from "@/lib/dashboard-mgt-bff";
import {
  getModels,
  createRoom as createRoomApi,
  updateRoom as updateRoomApi,
  deleteRoom as deleteRoomApi,
  createRoomElement as createRoomElementApi,
  updateRoomElement as updateRoomElementApi,
  deleteRoomElement as deleteRoomElementApi,
} from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { toast } from "sonner";
import ElementManager from "./element-manager";

interface RoomsManagerProps {
  propertyId: string;
  rooms: Room[];
  roomElements: RoomElement[];
}

export default function RoomsManager({
  propertyId,
  rooms: initialRooms,
  roomElements: initialRoomElements,
}: RoomsManagerProps) {
  const router = useRouter();
  const [editingRoomName, setEditingRoomName] = useState<number | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [roomElements, setRoomElements] =
    useState<RoomElement[]>(initialRoomElements);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setRooms(initialRooms);
    setRoomElements(initialRoomElements);
  }, [initialRooms, initialRoomElements]);

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

  const handleImportModel = async (model: Model) => {
    if (!model.rooms || model.rooms.length === 0) {
      toast.error("This model has no rooms to import");
      return;
    }

    try {
      setLoading({ import: true });
      // Create rooms and elements via API
      for (const modelRoom of model.rooms) {
        const roomId = await createRoomApi({
          agencyId: defaultId,
          propertyId,
          name: modelRoom.name,
          description: modelRoom.description,
          area: modelRoom.area,
        } as Omit<Room, "roomId">);

        // Create elements for this room
        if (modelRoom.elements && typeof roomId === "string") {
          for (const modelElement of modelRoom.elements) {
            await createRoomElementApi({
              agencyId: defaultId,
              propertyId,
              roomId: roomId,
              name: modelElement.name,
              description: modelElement.description,
              type: modelElement.type as RoomElement["type"],
            } as Omit<RoomElement, "elementId">);
          }
        }
      }
      toast.success(
        `Imported ${model.rooms.length} room(s) from "${model.name}"`
      );
      setImportDialogOpen(false);
      router.refresh(); // Refresh to get updated data
    } catch (error) {
      toast.error("Failed to import model");
      console.error(error);
    } finally {
      setLoading({ import: false });
    }
  };

  const addRoom = async () => {
    try {
      setLoading({ addRoom: true });
      const roomId = await createRoomApi({
        agencyId: defaultId,
        propertyId,
        name: "",
        description: "",
        area: undefined,
      } as Omit<Room, "roomId">);
      if (typeof roomId === "string") {
        const newRoom: Room = {
          roomId,
          agencyId: defaultId,
          propertyId,
          name: "",
          description: "",
          area: undefined,
        };
        const newRooms = [...rooms, newRoom];
        setRooms(newRooms);
        // Set editing state to the new room's index (last index)
        setEditingRoomName(newRooms.length - 1);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to create room");
      console.error(error);
    } finally {
      setLoading({ addRoom: false });
    }
  };

  // Create debounced update function for rooms
  const debouncedUpdateRoom = useDebounce(
    (args: { room: Room; updates: Partial<Room> }) => {
      const { room, updates } = args;
      const updatedRoom = { ...room, ...updates };
      setLoading({ [`update-${room.roomId}`]: true });
      updateRoomApi(updatedRoom)
        .then(() => {
          router.refresh();
        })
        .catch((error) => {
          toast.error("Failed to update room");
          console.error(error);
          // Revert on error
          setRooms((prevRooms) =>
            prevRooms.map((r) => (r.roomId === room.roomId ? room : r))
          );
        })
        .finally(() => {
          setLoading({ [`update-${room.roomId}`]: false });
        });
    },
    1000
  );

  const updateRoom = (room: Room, updates: Partial<Room>) => {
    // Update local state immediately for responsive UI
    const updatedRoom = { ...room, ...updates };
    setRooms((prevRooms) =>
      prevRooms.map((r) => (r.roomId === room.roomId ? updatedRoom : r))
    );

    // Debounce API call
    debouncedUpdateRoom({ room, updates });
  };

  const removeRoom = async (room: Room) => {
    try {
      setLoading({ [`delete-${room.roomId}`]: true });
      // Delete all elements first
      const elementsToDelete = roomElements.filter(
        (e) => e.roomId === room.roomId
      );
      for (const element of elementsToDelete) {
        await deleteRoomElementApi(propertyId, room.roomId, element.elementId);
      }
      // Then delete room
      await deleteRoomApi(propertyId, room.roomId);
      setRooms(rooms.filter((r) => r.roomId !== room.roomId));
      setRoomElements(roomElements.filter((e) => e.roomId !== room.roomId));
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete room");
      console.error(error);
    } finally {
      setLoading({ [`delete-${room.roomId}`]: false });
    }
  };

  const addElement = async (room: Room) => {
    try {
      setLoading({ [`add-element-${room.roomId}`]: true });
      const elementId = await createRoomElementApi({
        agencyId: defaultId,
        propertyId,
        roomId: room.roomId,
        name: "",
        description: "",
        type: "OTHER",
      } as Omit<RoomElement, "elementId">);
      if (typeof elementId === "string") {
        const newElement: RoomElement = {
          elementId,
          agencyId: defaultId,
          propertyId,
          roomId: room.roomId,
          name: "",
          description: "",
          type: "OTHER",
        };
        setRoomElements([...roomElements, newElement]);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to create element");
      console.error(error);
    } finally {
      setLoading({ [`add-element-${room.roomId}`]: false });
    }
  };

  // Create debounced update function for elements
  const debouncedUpdateElement = useDebounce(
    (args: { element: RoomElement; updates: Partial<RoomElement> }) => {
      const { element, updates } = args;
      const updatedElement = { ...element, ...updates };
      setLoading({ [`update-element-${element.elementId}`]: true });
      updateRoomElementApi(updatedElement)
        .then(() => {
          router.refresh();
        })
        .catch((error) => {
          toast.error("Failed to update element");
          console.error(error);
          // Revert on error
          setRoomElements((prevElements) =>
            prevElements.map((e) =>
              e.elementId === element.elementId ? element : e
            )
          );
        })
        .finally(() => {
          setLoading({ [`update-element-${element.elementId}`]: false });
        });
    },
    1000
  );

  const updateElement = (
    element: RoomElement,
    updates: Partial<RoomElement>
  ) => {
    // Update local state immediately for responsive UI
    const updatedElement = { ...element, ...updates };
    setRoomElements((prevElements) =>
      prevElements.map((e) =>
        e.elementId === element.elementId ? updatedElement : e
      )
    );

    // Debounce API call
    debouncedUpdateElement({ element, updates });
  };

  const removeElement = async (element: RoomElement) => {
    try {
      setLoading({ [`delete-element-${element.elementId}`]: true });
      await deleteRoomElementApi(propertyId, element.roomId, element.elementId);
      setRoomElements(
        roomElements.filter((e) => e.elementId !== element.elementId)
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete element");
      console.error(error);
    } finally {
      setLoading({ [`delete-element-${element.elementId}`]: false });
    }
  };

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
            <div className="flex gap-2">
              <Dialog
                open={importDialogOpen}
                onOpenChange={setImportDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={loading.import}>
                    {loading.import ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <DownloadIcon className="w-4 h-4 mr-2" />
                    )}
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
                          disabled={
                            !model.rooms ||
                            model.rooms.length === 0 ||
                            loading.import
                          }
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
              <Button
                onClick={addRoom}
                variant="outline"
                size="sm"
                disabled={loading.addRoom}
              >
                {loading.addRoom ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <PlusIcon className="w-4 h-4 mr-2" />
                )}
                Add Room
              </Button>
            </div>
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
              const roomElementsForRoom = roomElements.filter(
                (e) => e.roomId === room.roomId
              );

              return (
                <Card key={room.roomId} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      {showNameInput ? (
                        <Input
                          id={`room-${roomIndex}-name`}
                          type="text"
                          value={room.name}
                          onChange={(e) =>
                            updateRoom(room, { name: e.target.value })
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
                          onClick={() => removeRoom(room)}
                          variant="destructive"
                          size="sm"
                          disabled={loading[`delete-${room.roomId}`]}
                        >
                          {loading[`delete-${room.roomId}`] ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <TrashIcon className="w-4 h-4 mr-2" />
                          )}
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
                            updateRoom(room, {
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
                            updateRoom(room, {
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
                          onClick={() => addElement(room)}
                          variant="outline"
                          size="sm"
                          disabled={loading[`add-element-${room.roomId}`]}
                        >
                          {loading[`add-element-${room.roomId}`] ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <PlusIcon className="w-4 h-4 mr-2" />
                          )}
                          Add Element
                        </Button>
                      </div>

                      {roomElementsForRoom.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-4 text-center border rounded-md">
                          No elements added. Click "Add Element" to add one.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {roomElementsForRoom.map((element) => (
                            <ElementManager
                              key={element.elementId}
                              element={element}
                              onUpdate={(updates) =>
                                updateElement(element, updates)
                              }
                              onRemove={() => removeElement(element)}
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
