import UpdatePropertyForm from "@/components/property/property-page";
import PropertyDisplay from "@/components/property/property-display";
import { getProperty } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, EyeIcon, PencilIcon, XIcon } from "lucide-react";
import CreateModelFromPropertyButton from "@/components/property/create-model-from-property-button";

export default async function PropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ propertyId: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { propertyId } = await params;
  const { edit } = await searchParams;
  const isEditMode = edit === "true";

  try {
    const property = await getProperty(defaultId, propertyId);
    if (!property) {
      notFound();
    }
    return (
      <div className="flex flex-col items-center justify-center w-full gap-6">
        <div className="flex justify-end gap-2 w-full max-w-4xl">
          <Button asChild variant="outline" size="lg">
            <Link href={`/property/${propertyId}/inspection`}>
              <EyeIcon className="w-4 h-4 mr-2" />
              See Inspections
            </Link>
          </Button>
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
          <PropertyDisplay property={property} />
        )}
      </div>
    );
  } catch (error) {
    notFound();
  }
}
