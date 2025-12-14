"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { updateModel, deleteModel } from "@/lib/dashboard-mgt-bff/api";
import { Model } from "@/lib/dashboard-mgt-bff";
import { defaultId } from "@/protoype";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { Loader2, TrashIcon, PencilIcon } from "lucide-react";
import RoomsManager from "../shared/rooms-manager";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

export default function UpdateModelForm(props: { model?: Model }) {
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations("ModelUpdateForm");
  const [loading, setLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [model, setModel] = useState<Model>(
    props.model || {
      modelId: "",
      agencyId: defaultId,
      name: "",
      rooms: [],
    }
  );

  // Only sync props to state when modelId changes (not on every props change)
  // This prevents overwriting user edits when parent re-renders
  const prevModelIdRef = useRef<string | undefined>(props.model?.modelId);
  useEffect(() => {
    if (props.model && props.model.modelId !== prevModelIdRef.current) {
      setModel(props.model);
      prevModelIdRef.current = props.model.modelId;
    }
  }, [props.model]);

  const submit = async () => {
    try {
      setLoading(true);
      // Ensure modelId and agencyId are preserved and never updated
      await updateModel(
        {
          ...model,
          modelId: props.model?.modelId || model.modelId,
          agencyId: props.model?.agencyId || model.agencyId,
        },
        session
      );
      toast.success(t("modelUpdatedSuccess"));
      router.refresh(); // This will re-fetch the server-side data
    } catch (error) {
      toast.error(t("failedToUpdateModel"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("areYouSureDelete"))) {
      return;
    }

    try {
      setLoading(true);
      await deleteModel(defaultId, model.modelId, session);
      toast.success(t("modelDeletedSuccess"));
      router.push("/model");
    } catch (error) {
      toast.error(t("failedToDeleteModel"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showNameInput = !model.name || isEditingName;

  return (
    <div className="flex flex-col gap-6 max-w-4xl w-full">
      {/* Model Name Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            {showNameInput ? (
              <Input
                id="model-name"
                type="text"
                value={model.name}
                onChange={(e) => setModel({ ...model, name: e.target.value })}
                onBlur={() => {
                  if (model.name.trim()) {
                    setIsEditingName(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && model.name.trim()) {
                    setIsEditingName(false);
                  }
                }}
                placeholder={t("modelName")}
                className="text-lg font-semibold"
                autoFocus={isEditingName}
              />
            ) : (
              <CardTitle className="text-lg">{model.name}</CardTitle>
            )}
            <div className="flex items-center gap-2">
              {!showNameInput && (
                <Button
                  onClick={() => setIsEditingName(true)}
                  variant="ghost"
                  size="sm"
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <CardDescription>{t("updateModelInfo")}</CardDescription>
        </CardHeader>
      </Card>

      {/* Rooms Section */}
      <RoomsManager
        rooms={model.rooms || []}
        onChange={(rooms) => setModel({ ...model, rooms })}
      />

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button onClick={handleDelete} variant="destructive" size="lg">
          <TrashIcon className="w-4 h-4 mr-2" />
          {t("deleteModel")}
        </Button>
        <Button onClick={submit} size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("updating")}
            </>
          ) : (
            t("updateModel")
          )}
        </Button>
      </div>
    </div>
  );
}
