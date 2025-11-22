import UpdatePropertyForm from "@/components/property/propertyPage";
import { getProperty } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, EyeIcon } from "lucide-react";

export default async function PropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  try {
    const property = await getProperty(defaultId, params.propertyId);
    return (
      <div className="flex flex-col items-center justify-center w-full gap-6">
        <div className="flex justify-end gap-2 w-full max-w-4xl">
          <Button asChild variant="outline" size="lg">
            <Link href={`/property/${params.propertyId}/inspection`}>
              <EyeIcon className="w-4 h-4 mr-2" />
              See Inspections
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href={`/property/${params.propertyId}/inspection/new`}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Inspection
            </Link>
          </Button>
        </div>
        <UpdatePropertyForm property={property} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
