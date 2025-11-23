import UpdateModelForm from "@/components/model/update-model-form";
import ModelDisplay from "@/components/model/model-display";
import { getModel } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PencilIcon, XIcon } from "lucide-react";

export default async function ModelPage({
  params,
  searchParams,
}: {
  params: Promise<{ modelId: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  try {
    const { modelId } = await params;
    const { edit } = await searchParams;
    const isEditMode = edit === "true";
    const model = await getModel(defaultId, modelId);

    if (!model) {
      notFound();
    }

    return (
      <div className="flex flex-col items-center justify-center w-full gap-6">
        <div className="flex justify-end w-full max-w-4xl">
          {isEditMode ? (
            <Button asChild variant="outline" size="lg">
              <Link href={`/model/${modelId}`}>
                <XIcon className="w-4 h-4 mr-2" />
                Cancel
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href={`/model/${modelId}?edit=true`}>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}
        </div>
        {isEditMode ? (
          <UpdateModelForm model={model} />
        ) : (
          <ModelDisplay model={model} />
        )}
      </div>
    );
  } catch (error) {
    notFound();
  }
}
