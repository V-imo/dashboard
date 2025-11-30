"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProperty } from "@/lib/dashboard-mgt-bff/api";
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
import { Property, Room, RoomElement } from "@/lib/dashboard-mgt-bff";
import DeletePropertyButton from "./delete-button";
import RoomsManager from "../shared/rooms-manager";

export default function UpdatePropertyForm(props: {
  property?: Property;
  rooms?: Room[];
  roomElements?: RoomElement[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<Property>(
    props.property || {
      propertyId: "",
      agencyId: "",
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
    }
  );

  useEffect(() => {
    if (props.property) {
      setProperty(props.property);
    }
  }, [props.property]);

  const submit = async () => {
    try {
      setLoading(true);
      // Ensure propertyId is preserved and never updated
      await updateProperty({
        ...property,
        propertyId: props.property?.propertyId || property.propertyId,
      });
      toast.success("Property updated successfully");
      router.refresh(); // This will re-fetch the server-side data
    } catch (error) {
      toast.error("Failed to update property");
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
            Update the address details of the property
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
            Update the contact information of the property owner
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

      {/* Rooms Section */}
      <RoomsManager
        propertyId={property.propertyId}
        rooms={props.rooms || []}
        roomElements={props.roomElements || []}
      />

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <DeletePropertyButton propertyId={property.propertyId} />
        <Button onClick={submit} size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Property"
          )}
        </Button>
      </div>
    </div>
  );
}
