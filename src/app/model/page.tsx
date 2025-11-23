import { getModels } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";
import Link from "next/link";
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

export default async function ModelPage() {
  const models = await getModels(defaultId);

  if (!models || models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No models found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Models</CardTitle>
          <CardDescription>List of all models</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Rooms</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow
                  key={model.modelId}
                  className="cursor-pointer hover:bg-muted/50 group"
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/model/${model.modelId}`}
                      className="block w-full group-hover:underline"
                    >
                      {model.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/model/${model.modelId}`}
                      className="block w-full"
                    >
                      {model.rooms?.length || 0}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
