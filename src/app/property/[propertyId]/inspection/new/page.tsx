import CreateInspectionForm from "@/components/inspection/createInspectionForm";
import { getProperty } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NewInspectionPage({
  params,
}: {
  params: { propertyId: string };
}) {
  try {
    const property = await getProperty(defaultId, params.propertyId);
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <Link
          href={`/property/${params.propertyId}`}
          className="shadow-md p-2 rounded-md hover:bg-gray-100 flex justify-center items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to property
        </Link>
        <CreateInspectionForm
          propertyId={params.propertyId}
          property={property}
        />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
