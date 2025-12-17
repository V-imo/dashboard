"use server";

import { auth } from "@/lib/auth";
import { getEmployees } from "@/lib/dashboard-employee-bff/api";
import { unauthorized } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("employees")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {employees && employees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t("name")}
                  </TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.username}>
                    <TableCell>
                      {employee.firstName && employee.lastName
                        ? `${employee.firstName} ${employee.lastName}`
                        : employee.firstName || employee.lastName || "-"}
                    </TableCell>
                    <TableCell>{employee.email || "-"}</TableCell>
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
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No employees found
            </p>
          )}

          <div className="flex justify-end">
            <AddEmployeeDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
