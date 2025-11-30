import CreatePropertyForm from "@/components/property/create-form";
import { getModels } from "@/lib/dashboard-mgt-bff/api";
import { defaultId } from "@/protoype";

export default async function NewPropertyPage() {
  const models = await getModels(defaultId);
  return <CreatePropertyForm models={models || []} />;
}