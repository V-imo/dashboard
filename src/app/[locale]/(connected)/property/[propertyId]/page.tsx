"use server";

import { Suspense } from "react";
import UpdatePropertyForm from "@/components/property/update-form";
import PropertyDisplay from "@/components/property/display";
import {
  getProperty,
  getPropertyInspections,
} from "@/lib/dashboard-mgt-bff/api";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, XIcon } from "lucide-react";
import CreateModelFromPropertyButton from "@/components/property/create-model-from-property-button";
import LoadingBar from "@/components/ui/loading-bar";
import { auth } from "@/lib/auth";

async function PropertyDetailPageContent({
  params,
  searchParams,
}: {
  params: Promise<{ propertyId: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const [session, { propertyId }, { edit }] = await Promise.all([
    auth(),
    params,
    searchParams,
  ]);
  const isEditMode = edit === "true";

  try {
    const property = await getProperty(propertyId, session);
    if (!property) {
      notFound();
    }
    const inspections = await getPropertyInspections(propertyId, session);
    return (
      <div className="flex flex-col items-center justify-center w-full gap-6">
        <div className="flex justify-end gap-2 w-full max-w-4xl">
          <CreateModelFromPropertyButton property={property} />
          <Button asChild size="lg">
            <Link href={`/property/${propertyId}/inspection/new`}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Inspection
            </Link>
          </Button>
          {isEditMode ? (
            <Button asChild variant="outline" size="lg">
              <Link href={`/property/${propertyId}`}>
                <XIcon className="w-4 h-4 mr-2" />
                Cancel
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href={`/property/${propertyId}?edit=true`}>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}
        </div>
        {isEditMode ? (
          <UpdatePropertyForm property={property} />
        ) : (
          <PropertyDisplay
            property={property}
            inspections={inspections || []}
          />
        )}
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export default async function PropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ propertyId: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  return (
    <Suspense fallback={<LoadingBar />}>
      <PropertyDetailPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
