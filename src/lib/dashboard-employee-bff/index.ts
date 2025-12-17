import createClient from "openapi-fetch";
import { components, paths } from "./types";

export type RegisterUser = components["schemas"]["RegisterUser"];
export type User = components["schemas"]["User"];

export const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_DASHBOARD_EMPLOYEE_BFF,
});
