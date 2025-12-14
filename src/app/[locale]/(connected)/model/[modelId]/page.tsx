"use server";

import { Suspense } from "react";
import UpdateModelForm from "@/components/model/update-form";
import ModelDisplay from "@/components/model/display";
import { getModel } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PencilIcon, XIcon } from "lucide-react";
import LoadingBar from "@/components/ui/loading-bar";
import { auth } from "@/lib/auth";

async function ModelDetailPageContent({
  params,
  searchParams,
}: {
  params: Promise<{ modelId: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  try {
    const [session, {modelId}, {edit}] = await Promise.all([
      auth(),
      params,
      searchParams,
    ]);
    const isEditMode = edit === "true";
    const model = await getModel(defaultId, modelId, session);

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

export default async function ModelPage({
  params,
  searchParams,
}: {
  params: Promise<{ modelId: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  return (
    <Suspense fallback={<LoadingBar />}>
      <ModelDetailPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
