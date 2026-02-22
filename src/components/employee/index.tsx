"use server";

import { auth } from "@/lib/auth";
import { getEmployees } from "@/lib/dashboard-employee-bff/api";
import { unauthorized } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "../ui/card";
import { getTranslations } from "next-intl/server";
import DeleteButton from "./components/delete-button";
import AddEmployeeDialog from "./components/add-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";

export default async function Employee() {
  const [t, session] = await Promise.all([
    getTranslations("Employee"),
    auth(),
  ]);
  if (!session?.user?.currentAgency) {
    return unauthorized();
  }
  const employees = await getEmployees(session?.user?.currentAgency);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  {t("employees")}
                </CardTitle>
                <CardDescription className="mt-1">
                  {employees?.length || 0} {employees?.length === 1 ? t("employee") : t("employees")}
                </CardDescription>
              </div>
            </div>
            <CardAction>
              <AddEmployeeDialog />
            </CardAction>
          </div>
        </CardHeader>
        <CardContent>
          {employees && employees.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">{t("name")}</TableHead>
                    <TableHead className="w-1/2">{t("email")}</TableHead>
                    <TableHead className="text-right w-1/6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.username}>
                      <TableCell className="font-medium">
                        {employee.firstName && employee.lastName
                          ? `${employee.firstName} ${employee.lastName}`
                          : employee.firstName || employee.lastName || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {employee.email || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DeleteButton
                          username={employee.username}
                          email={employee.email}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center max-w-sm">
                {t("noEmployeesFound")}
              </p>
              <AddEmployeeDialog />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
