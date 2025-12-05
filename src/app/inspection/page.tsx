import { getInspections, getProperties } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import Link from "next/link";
import InspectionStatusBadge from "@/components/inspection/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function InspectionPage() {
  const inspections = await getInspections(defaultId);
  const properties = await getProperties(defaultId);

  if (!inspections || inspections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No inspections found
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Inspections</CardTitle>
          <CardDescription>List of all inspections</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Property Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => {
                const property = properties?.find(
                  (property) => property.propertyId === inspection.propertyId
                );
                const inspectionDate = inspection.date
                  ? new Date(inspection.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A";
                const propertyAddress = property
                  ? `${property.address.number} ${property.address.street}, ${property.address.city}`
                  : "N/A";
                return (
                  <TableRow
                    key={inspection.inspectionId}
                    className="cursor-pointer hover:bg-muted/50 group"
                  >
                    <TableCell>
                      <Link
                        href={`/property/${inspection.propertyId}/inspection/${inspection.inspectionId}`}
                        className="block w-full"
                      >
                        <InspectionStatusBadge status={inspection.status} />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/property/${inspection.propertyId}/inspection/${inspection.inspectionId}`}
                        className="block w-full group-hover:underline"
                      >
                        {inspectionDate}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/property/${inspection.propertyId}/inspection/${inspection.inspectionId}`}
                        className="block w-full group-hover:underline"
                      >
                        {propertyAddress}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
