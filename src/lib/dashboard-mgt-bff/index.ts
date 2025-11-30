import createClient from "openapi-fetch";
import { paths, components } from "./types";

export type Inspection = components["schemas"]["Inspection"];
export type Agency = components["schemas"]["Agency"];
export type Property = components["schemas"]["Property"];
export type Properties = components["schemas"]["Properties"];
export type Model = components["schemas"]["Model"];
export type Models = components["schemas"]["Models"];
export type Room = components["schemas"]["Room"];
export type RoomElement = components["schemas"]["RoomElement"];

export const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_DASHBOARD_MGT_BFF,
});
