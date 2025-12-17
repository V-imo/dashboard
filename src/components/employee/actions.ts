"use server";

import {
  deleteEmployee,
  registerEmployee,
} from "@/lib/dashboard-employee-bff/api";
import { auth } from "@/lib/auth";
import { unauthorized } from "next/navigation";
import { revalidatePath } from "next/cache";

export const deleteEmployeeAction = async (username: string) => {
  try {
    await deleteEmployee(username);
    revalidatePath("/employee");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete employee" };
  }
};

export const addEmployeeAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const employee = { email, firstName, lastName };

  const session = await auth();
  if (!session?.user?.currentAgency) {
    return unauthorized();
  }
  try {
    await registerEmployee({
      ...employee,
      currentAgency: session?.user?.currentAgency,
    });
    revalidatePath("/employee");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to add employee" };
  }
};
