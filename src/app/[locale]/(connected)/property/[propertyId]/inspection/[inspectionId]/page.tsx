"use server";

import { Suspense } from "react";
import UpdateInspectionForm from "@/components/inspection/update-form";
import InspectionDisplay from "@/components/inspection/display";
import { getInspection, getProperty } from "@/lib/dashboard-mgt-bff/api";
import { HouseIcon, PencilIcon, XIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingBar from "@/components/ui/loading-bar";
import { auth } from "@/lib/auth";

async function InspectionDetailPageContent({
  params,
  searchParams,
}: {
  params: Promise<{ propertyId: string; inspectionId: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  try {
    const [session, { propertyId, inspectionId }, { edit }] = await Promise.all(
      [auth(), params, searchParams]
    );
    const isEditMode = edit === "true";
    const inspection = await getInspection(
      propertyId,
      inspectionId,
      session,
    );
    const property = await getProperty(propertyId, session);

    if (!inspection || !property) {
      notFound();
    }

    return (
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <div className="flex justify-end gap-2 w-full max-w-4xl">
          <Button asChild variant="outline" size="lg">
            <Link href={`/property/${propertyId}`}>
              <HouseIcon className="w-4 h-4 mr-2" />
              See Property
            </Link>
          </Button>
          {isEditMode ? (
            <Button asChild variant="outline" size="lg">
              <Link href={`/property/${propertyId}/inspection/${inspectionId}`}>
                <XIcon className="w-4 h-4 mr-2" />
                Cancel
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link
                href={`/property/${propertyId}/inspection/${inspectionId}?edit=true`}
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}
        </div>
        {isEditMode ? (
          <UpdateInspectionForm inspection={inspection} property={property} />
        ) : (
          <InspectionDisplay inspection={inspection} property={property} />
        )}
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export default async function InspectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ propertyId: string; inspectionId: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  return (
    <Suspense fallback={<LoadingBar />}>
      <InspectionDetailPageContent
        params={params}
        searchParams={searchParams}
      />
    </Suspense>
  );
}
