import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Toasts from "@/components/homepage/Toasts";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl w-full gap-4 py-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome to the Dashboard</CardTitle>
          <CardDescription>
            {"Here you can manage your account and your data"}
          </CardDescription>

          <CardContent className="flex flex-col gap-4">
            <p>
              I'll just do a small shadcn demo here
            </p>

            <Button className="w-fit">
              <PlusIcon className="w-4 h-4" />
              Random button
            </Button>

            <Button className="w-fit" variant="outline">
              <PlusIcon className="w-4 h-4" />
              Random button 2
            </Button>

            <Alert>
              <AlertTitle>Alert</AlertTitle>
              <AlertDescription>This is a basic alert</AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertTitle>Alert</AlertTitle>
              <AlertDescription>This is a destructive alert</AlertDescription>
            </Alert>

            <Alert variant="success">
              <AlertTitle>Alert</AlertTitle>
              <AlertDescription>This is a success alert</AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTitle>Alert</AlertTitle>
              <AlertDescription>This is a warning alert</AlertDescription>
            </Alert>

            <Toasts />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
