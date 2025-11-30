"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProperty } from "@/lib/dashboard-mgt-bff/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { defaultId } from "@/protoype";
import { Model, Property, RoomElement } from "@/lib/dashboard-mgt-bff";
import { createRoom, createRoomElement } from "@/lib/dashboard-mgt-bff/api";

export default function CreatePropertyForm({ models }: { models: Model[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
    undefined
  );
  const [property, setProperty] = useState<Omit<Property, "propertyId">>({
    agencyId: defaultId,
    address: {
      number: "",
      street: "",
      city: "",
      zipCode: "",
      country: "",
    },
    owner: {
      firstName: "",
      lastName: "",
      mail: "",
      phoneNumber: "",
    },
  });

  const submit = async () => {
    try {
      setLoading(true);
      const propertyId = await createProperty(property as Property);

      // If a model is selected, import its rooms and elements
      if (selectedModelId && selectedModelId !== "none") {
        const selectedModel = models.find((m) => m.modelId === selectedModelId);
        if (selectedModel && selectedModel.rooms && propertyId) {
          try {
            // Create rooms and elements from model
            for (const modelRoom of selectedModel.rooms) {
              const roomId = await createRoom({
                agencyId: defaultId,
                propertyId,
                name: modelRoom.name,
                description: modelRoom.description,
                area: modelRoom.area,
              });

              // Create elements for this room
              if (modelRoom.elements && typeof roomId === "string") {
                for (const modelElement of modelRoom.elements) {
                  await createRoomElement({
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
              `Property created and ${selectedModel.rooms.length} room(s) imported from model`
            );
          } catch (error) {
            toast.error("Property created but failed to import model rooms");
            console.error(error);
          }
        }
      } else {
        toast.success("Property created successfully");
      }

      router.push(`/property/${propertyId}`);
    } catch (error) {
      toast.error("Failed to create property");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      {/* Address Section */}
      <Card>
        <CardHeader>
          <CardTitle>Property Address</CardTitle>
          <CardDescription>
            Enter the address details of the property
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="address.number">Number</Label>
              <Input
                id="address.number"
                type="text"
                value={property.address.number}
                onChange={(e) =>
                  setProperty({
                    ...property,
                    address: {
                      ...property.address,
                      number: e.target.value,
                    },
                  })
                }
                placeholder="Number"
              />
            </div>
            <div className="flex-[5]">
              <Label htmlFor="address.street">Street</Label>
              <Input
                id="address.street"
                type="text"
                value={property.address.street}
                onChange={(e) =>
                  setProperty({
                    ...property,
                    address: {
                      ...property.address,
                      street: e.target.value,
                    },
                  })
                }
                placeholder="Street"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-[3]">
              <Label htmlFor="address.city">City</Label>
              <Input
                id="address.city"
                type="text"
                value={property.address.city}
                onChange={(e) =>
                  setProperty({
                    ...property,
                    address: {
                      ...property.address,
                      city: e.target.value,
                    },
                  })
                }
                placeholder="City"
              />
            </div>
            <div className="flex-[2]">
              <Label htmlFor="address.zipCode">Zip Code</Label>
              <Input
                id="address.zipCode"
                type="text"
                value={property.address.zipCode}
                onChange={(e) =>
                  setProperty({
                    ...property,
                    address: {
                      ...property.address,
                      zipCode: e.target.value,
                    },
                  })
                }
                placeholder="Zip Code"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address.country">Country</Label>
            <Select
              value={property.address.country}
              onValueChange={(value) =>
                setProperty({
                  ...property,
                  address: {
                    ...property.address,
                    country: value,
                  },
                })
              }
            >
              <SelectTrigger id="address.country" className="w-full">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FRA">France</SelectItem>
                <SelectItem value="BEL">Belgium</SelectItem>
                <SelectItem value="CHE">Suisse</SelectItem>
                <SelectItem value="GBR">England</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Owner Section */}
      <Card>
        <CardHeader>
          <CardTitle>Property Owner</CardTitle>
          <CardDescription>
            Enter the contact information of the property owner
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="owner.firstName">First Name</Label>
              <Input
                id="owner.firstName"
                type="text"
                value={property.owner?.firstName || ""}
                onChange={(e) =>
                  setProperty({
                    ...property,
                    owner: {
                      ...property.owner!,
                      firstName: e.target.value,
                    },
                  })
                }
                placeholder="First Name"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="owner.lastName">Last Name</Label>
              <Input
                id="owner.lastName"
                type="text"
                value={property.owner?.lastName || ""}
                onChange={(e) =>
                  setProperty({
                    ...property,
                    owner: {
                      ...property.owner!,
                      lastName: e.target.value,
                    },
                  })
                }
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="owner.mail">Email</Label>
              <Input
                id="owner.mail"
                type="email"
                value={property.owner?.mail || ""}
                onChange={(e) =>
                  setProperty({
                    ...property,
                    owner: {
                      ...property.owner!,
                      mail: e.target.value,
                    },
                  })
                }
                placeholder="Email"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="owner.phoneNumber">Phone Number</Label>
              <Input
                id="owner.phoneNumber"
                type="tel"
                value={property.owner?.phoneNumber || ""}
                onChange={(e) =>
                  setProperty({
                    ...property,
                    owner: {
                      ...property.owner!,
                      phoneNumber: e.target.value,
                    },
                  })
                }
                placeholder="Phone Number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Import Section */}
      {models.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Import from Model (Optional)</CardTitle>
            <CardDescription>
              Select a model to automatically import its rooms and elements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedModelId || undefined}
              onValueChange={(value) =>
                setSelectedModelId(value === "none" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {models.map((model) => (
                  <SelectItem key={model.modelId} value={model.modelId}>
                    {model.name} ({model.rooms?.length || 0} rooms)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={submit} size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Property"
          )}
        </Button>
      </div>
    </div>
  );
}
