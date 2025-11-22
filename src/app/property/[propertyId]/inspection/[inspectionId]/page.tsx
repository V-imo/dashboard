import UpdateInspectionForm from "@/components/inspection/updateInspectionForm";
import { getInspection } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import { HouseIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function InspectionPage({
  params,
}: {
  params: { propertyId: string; inspectionId: string };
}) {
  try {
    const inspection = await getInspection(
      defaultId,
      params.propertyId,
      params.inspectionId
    );
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <div className="flex justify-end w-full max-w-4xl">
          <Link
            href={`/property/${params.propertyId}`}
            className="shadow-md p-2 rounded-md hover:bg-gray-100 flex justify-center items-center gap-2"
          ><HouseIcon className="w-4 h-4" />
            See Property
          </Link>
        </div>
        <UpdateInspectionForm inspection={inspection} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
