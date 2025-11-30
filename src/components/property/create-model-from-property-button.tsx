"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createModel } from "@/lib/dashboard-mgt-bff/api";
import { Property, Room, RoomElement } from "@/lib/dashboard-mgt-bff";
import { defaultId } from "@/protoype";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Loader2, CopyIcon } from "lucide-react";

interface CreateModelFromPropertyButtonProps {
  property: Property;
  rooms: Room[];
  roomElements: RoomElement[];
}

export default function CreateModelFromPropertyButton({
  property,
  rooms,
  roomElements,
}: CreateModelFromPropertyButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modelName, setModelName] = useState("");

  const transformToModelRooms = (): {
    name: string;
    area?: number;
    description?: string;
    elements: {
      name: string;
      description?: string;
      images?: string[];
      type: string;
    }[];
  }[] => {
    // Group room elements by roomId
    const elementsByRoomId = new Map<string, RoomElement[]>();
    roomElements.forEach((element) => {
      const existing = elementsByRoomId.get(element.roomId) || [];
      existing.push(element);
      elementsByRoomId.set(element.roomId, existing);
    });

    // Transform rooms to model format
    return rooms.map((room) => {
      const roomElements = elementsByRoomId.get(room.roomId) || [];

      return {
        name: room.name,
        ...(room.area !== undefined && { area: room.area }),
        ...(room.description && { description: room.description }),
        elements: roomElements.map((element) => ({
          name: element.name,
          ...(element.description && { description: element.description }),
          type: element.type,
          // images is optional, we don't have it from RoomElement
        })),
      };
    });
  };

  const handleSubmit = async () => {
    if (!modelName.trim()) {
      toast.error("Model name is required");
      return;
    }

    try {
      setLoading(true);
      const modelRooms = transformToModelRooms();
      await createModel({
        agencyId: defaultId,
        name: modelName.trim(),
        rooms: modelRooms,
      });
      toast.success("Model created successfully");
      setOpen(false);
      setModelName("");
      router.push("/model");
    } catch (error) {
      toast.error("Failed to create model");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <CopyIcon className="w-4 h-4 mr-2" />
          Create Model
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Model from Property</DialogTitle>
          <DialogDescription>
            Enter a name for the model. The rooms from this property will be
            copied to the model.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div>
            <Label htmlFor="model-name">Model Name</Label>
            <Input
              id="model-name"
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g., Standard Apartment, House Template"
              onKeyDown={(e) => {
                if (e.key === "Enter" && modelName.trim()) {
                  handleSubmit();
                }
              }}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !modelName.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Model"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
