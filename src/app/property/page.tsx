import { getProperties } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import Link from "next/link";

export default async function PropertyPage() {
  const properties = await getProperties(defaultId);

  if (!properties || properties.length === 0) {
    return <div>No properties found</div>;
  }

  console.log(properties);

  return (
    <div className="flex flex-col gap-2 w-full max-w-5xl mx-auto items-center">
      {properties.map((property) => (
        <Link
          key={property.propertyId}
          href={`/property/${property.propertyId}`}
          className="shadow-md p-2 rounded-md hover:bg-gray-100 w-full flex ellipsis max-w-200"
        >
          {property.owner?.firstName} {property.owner?.lastName}
          {" "} -- {" "}
          {property.address.number} {property.address.street}{" "}
          {property.address.city} {property.address.zipCode}{" "}
          {property.address.country}
        </Link>
      ))}
    </div>
  );
}
