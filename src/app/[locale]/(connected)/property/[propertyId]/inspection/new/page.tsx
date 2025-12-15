"use server";

import { Suspense } from "react";
import CreateInspectionForm from "@/components/inspection/create-form";
import { getProperty } from "@/lib/dashboard-mgt-bff/api";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import LoadingBar from "@/components/ui/loading-bar";
import { auth } from "@/lib/auth";

async function NewInspectionPageContent({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  try {
    const [session, { propertyId }] = await Promise.all([auth(), params]);
    const property = await getProperty(propertyId, session);

    if (!property) {
      notFound();
    }

    return (
      <div className="flex flex-col items-center justify-center w-full">
        <Link
          href={`/property/${propertyId}`}
          className="shadow-md p-2 rounded-md hover:bg-gray-100 flex justify-center items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to property
        </Link>
        <CreateInspectionForm propertyId={propertyId} property={property} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export default async function NewInspectionPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  return (
    <Suspense fallback={<LoadingBar />}>
      <NewInspectionPageContent params={params} />
    </Suspense>
  );
}
