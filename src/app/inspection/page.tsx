import { getInspections, getProperties } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import Link from "next/link";
import InspectionStatusBadge from "@/components/inspection/inspectionStatusBadge";

export default async function InspectionPage() {
  const inspections = await getInspections(defaultId);
  const properties = await getProperties(defaultId);

  if (!inspections || inspections.length === 0) {
    return <div>No inspections found</div>;
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-5xl mx-auto items-center">
      {inspections.map((inspection) => {
        const property = properties?.find((property) => property.propertyId === inspection.propertyId);
        return (
          <Link
            key={inspection.inspectionId}
            href={`/property/${inspection.propertyId}/inspection/${inspection.inspectionId}`}
            className="shadow-md p-2 rounded-md hover:bg-gray-100 w-full flex items-center gap-3 ellipsis max-w-200"
          >
            <InspectionStatusBadge status={inspection.status} />
            <span>
              {new Date(inspection.date).toLocaleDateString()}
              {`  ${property?.address.number} ${property?.address.street}, ${property?.address.city}`}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
