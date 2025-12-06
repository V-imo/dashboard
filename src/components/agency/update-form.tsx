"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
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
import { useTranslations } from "next-intl";

export default function UpdateAgencyForm(props: { agency?: Agency }) {
  const router = useRouter();
  const t = useTranslations("AgencyUpdateForm");
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

  const submit = async () => {
    try {
      setLoading(true);
      await updateAgency(agency);
      toast.success(t("agencyUpdatedSuccess"));
      router.refresh(); // This will re-fetch the server-side data
    } catch (error) {
      toast.error(t("failedToUpdateAgency"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{t("name")}</Label>
      <Input
        type="text"
        value={agency.name}
        onChange={(e) => setAgency({ ...agency, name: e.target.value })}
        placeholder={t("name")}
      />
      <Label>{t("contactMail")}</Label>
      <Input
        type="email"
        value={agency.contactMail}
        onChange={(e) => setAgency({ ...agency, contactMail: e.target.value })}
        placeholder={t("contactMail")}
      />
      <Label>{t("contactPhone")}</Label>
      <Input
        type="tel"
        value={agency.contactPhone}
        onChange={(e) => setAgency({ ...agency, contactPhone: e.target.value })}
        placeholder={t("contactPhone")}
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
          placeholder={t("number")}
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
          placeholder={t("street")}
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
          placeholder={t("city")}
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
          placeholder={t("zipCode")}
        />
      </div>
      <Label>{t("country")}</Label>
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
          <SelectValue placeholder={t("selectCountry")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="FRA">{t("france")}</SelectItem>
          <SelectItem value="BEL">{t("belgium")}</SelectItem>
          <SelectItem value="CHE">{t("suisse")}</SelectItem>
          <SelectItem value="GBR">{t("england")}</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={submit}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("update")}
      </Button>
    </div>
  );
}
