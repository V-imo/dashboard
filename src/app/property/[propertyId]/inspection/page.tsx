import {
  getProperty,
  getPropertyInspections,
} from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import InspectionStatusBadge from "@/components/inspection/inspection-status-badge";

export default async function PropertyInspectionsPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const { propertyId } = await params;
  const property = await getProperty(defaultId, propertyId);
  const inspections = await getPropertyInspections(defaultId, propertyId);

  return (
    <div className="flex flex-col gap-2 w-full max-w-5xl mx-auto items-center">
      <Link
        href={`/property/${propertyId}`}
        className="shadow-md p-2 rounded-md hover:bg-gray-100 flex justify-center items-center gap-2"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Back to property
      </Link>
      {(!inspections || inspections.length === 0) && (
        <div>No inspections found for this property</div>
      )}
      {inspections?.map((inspection) => (
        <Link
          key={inspection.inspectionId}
          href={`/property/${propertyId}/inspection/${inspection.inspectionId}`}
          className="shadow-md p-2 rounded-md hover:bg-gray-100 w-full flex items-center gap-3 ellipsis max-w-200"
        >
          <InspectionStatusBadge status={inspection.status} />
          <span>
            {new Date(inspection.date).toLocaleDateString()}{" "}
            {`  ${property?.address.number} ${property?.address.street}, ${property?.address.city}`}
          </span>
        </Link>
      ))}
    </div>
  );
}
