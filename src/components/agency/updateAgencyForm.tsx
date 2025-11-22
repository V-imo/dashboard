"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Agency } from "@/lib/dashboard-mgt-bff";
import { updateAgency } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from "../ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function UpdateAgencyForm(props: { agency?: Agency }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agency, setAgency] = useState<Agency>(
    props.agency || {
      agencyId: defaultId,
      name: "",
      contactMail: "",
      contactPhone: "",
      address: {
        number: "",
        street: "",
        city: "",
        zipCode: "",
        country: "",
      },
    }
  );

  // Sync local state when props.agency changes (after server refresh)
  useEffect(() => {
    if (props.agency) {
      setAgency(props.agency);
    }
  }, [props.agency]);

  const updateDisabled = useMemo(() => {
    if (!props.agency) return false;
    return (
      agency.name === props.agency.name &&
      agency.contactMail === props.agency.contactMail &&
      agency.contactPhone === props.agency.contactPhone &&
      agency.address.number === props.agency.address.number &&
      agency.address.street === props.agency.address.street &&
      agency.address.city === props.agency.address.city &&
      agency.address.zipCode === props.agency.address.zipCode &&
      agency.address.country === props.agency.address.country
    );
  }, [agency, props.agency]);

  const submit = async () => {
    try {
      setLoading(true);
      await updateAgency(agency);
      toast.success("Agency updated successfully");
      router.refresh(); // This will re-fetch the server-side data
    } catch (error) {
      toast.error("Failed to update agency");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>Name</Label>
      <Input
        type="text"
        value={agency.name}
        onChange={(e) => setAgency({ ...agency, name: e.target.value })}
        placeholder="Name"
      />
      <Label>Contact Mail</Label>
      <Input
        type="email"
        value={agency.contactMail}
        onChange={(e) => setAgency({ ...agency, contactMail: e.target.value })}
        placeholder="Contact Mail"
      />
      <Label>Contact Phone</Label>
      <Input
        type="tel"
        value={agency.contactPhone}
        onChange={(e) => setAgency({ ...agency, contactPhone: e.target.value })}
        placeholder="Contact Phone"
      />

      <div className="flex gap-2">
        <Input
          className="flex-1"
          type="text"
          value={agency.address.number}
          onChange={(e) =>
            setAgency({
              ...agency,
              address: { ...agency.address, number: e.target.value },
            })
          }
          placeholder="Number"
        />

        <Input
          className="flex-5"
          type="text"
          value={agency.address.street}
          onChange={(e) =>
            setAgency({
              ...agency,
              address: { ...agency.address, street: e.target.value },
            })
          }
          placeholder="Street"
        />
      </div>

      <div className="flex gap-2">
        <Input
          className="flex-3"
          type="text"
          value={agency.address.city}
          onChange={(e) =>
            setAgency({
              ...agency,
              address: { ...agency.address, city: e.target.value },
            })
          }
          placeholder="City"
        />
        <Input
          className="flex-2"
          type="text"
          value={agency.address.zipCode}
          onChange={(e) =>
            setAgency({
              ...agency,
              address: { ...agency.address, zipCode: e.target.value },
            })
          }
          placeholder="Zip Code"
        />
      </div>
      <Label>Country</Label>
      <Select
        value={agency.address.country}
        onValueChange={(value) =>
          setAgency({
            ...agency,
            address: { ...agency.address, country: value },
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="FRA">France</SelectItem>
          <SelectItem value="BEL">Belgium</SelectItem>
          <SelectItem value="CHE">Suisse</SelectItem>
          <SelectItem value="GBR">England</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={submit} disabled={updateDisabled || loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
      </Button>
    </div>
  );
}
