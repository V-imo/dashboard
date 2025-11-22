import UpdateAgencyForm from "@/components/agency/updateAgencyForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAgency } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";

export default async function Dashboard() {
  const agency = await getAgency(defaultId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Agency</CardTitle>
      </CardHeader>
      <CardContent>
        <UpdateAgencyForm agency={agency} />
      </CardContent>
    </Card>
  );
}
