"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createModel } from "@/lib/dashboard-mgt-bff/api";
import { Property } from "@/lib/dashboard-mgt-bff";
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
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

interface CreateModelFromPropertyButtonProps {
  property: Property;
}

export default function CreateModelFromPropertyButton({
  property,
}: CreateModelFromPropertyButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations("PropertyCreateModelFromPropertyButton");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modelName, setModelName] = useState("");

  const handleSubmit = async () => {
    if (!modelName.trim()) {
      toast.error(t("modelNameRequired"));
      return;
    }

    try {
      setLoading(true);
      await createModel(
        {
          agencyId: defaultId,
          name: modelName.trim(),
          rooms: property.rooms || [],
        },
        session
      );
      toast.success(t("modelCreatedSuccess"));
      setOpen(false);
      setModelName("");
      router.push("/model");
    } catch (error) {
      toast.error(t("failedToCreateModel"));
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
          {t("createModel")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createModelFromProperty")}</DialogTitle>
          <DialogDescription>{t("enterModelName")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div>
            <Label htmlFor="model-name">{t("modelName")}</Label>
            <Input
              id="model-name"
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder={t("modelNamePlaceholder")}
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
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !modelName.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("creating")}
              </>
            ) : (
              t("createModel")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
