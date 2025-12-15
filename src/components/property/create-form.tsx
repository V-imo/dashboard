"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
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
import { Property } from "@/lib/dashboard-mgt-bff";
import RoomsManager from "../shared/rooms-manager";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

export default function CreatePropertyForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations("PropertyCreateForm");
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<
    Omit<Property, "propertyId" | "agencyId">
  >({
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
    rooms: [],
  });

  const submit = async () => {
    try {
      setLoading(true);
      const propertyId = await createProperty(property as Property, session);
      toast.success(t("propertyCreatedSuccess"));
      router.push(`/property/${propertyId}`);
    } catch (error) {
      toast.error(t("failedToCreateProperty"));
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
          <CardTitle>{t("propertyAddress")}</CardTitle>
          <CardDescription>{t("enterAddressDetails")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="address.number">{t("number")}</Label>
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
                placeholder={t("number")}
              />
            </div>
            <div className="flex-[5]">
              <Label htmlFor="address.street">{t("street")}</Label>
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
                placeholder={t("street")}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-[3]">
              <Label htmlFor="address.city">{t("city")}</Label>
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
                placeholder={t("city")}
              />
            </div>
            <div className="flex-[2]">
              <Label htmlFor="address.zipCode">{t("zipCode")}</Label>
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
                placeholder={t("zipCode")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address.country">{t("country")}</Label>
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
                <SelectValue placeholder={t("selectCountry")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FRA">{t("france")}</SelectItem>
                <SelectItem value="BEL">{t("belgium")}</SelectItem>
                <SelectItem value="CHE">{t("suisse")}</SelectItem>
                <SelectItem value="GBR">{t("england")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Owner Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("propertyOwner")}</CardTitle>
          <CardDescription>{t("enterContactInfo")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="owner.firstName">{t("firstName")}</Label>
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
                placeholder={t("firstName")}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="owner.lastName">{t("lastName")}</Label>
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
                placeholder={t("lastName")}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="owner.mail">{t("email")}</Label>
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
                placeholder={t("email")}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="owner.phoneNumber">{t("phoneNumber")}</Label>
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
                placeholder={t("phoneNumber")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Section */}
      <RoomsManager
        rooms={property.rooms || []}
        onChange={(rooms) => setProperty({ ...property, rooms })}
      />

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={submit} size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("creating")}
            </>
          ) : (
            t("createProperty")
          )}
        </Button>
      </div>
    </div>
  );
}
