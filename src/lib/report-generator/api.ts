export async function getInspectionPdfUrl(
  agencyId: string,
  propertyId: string,
  inspectionId: string
): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_REPORT_GENERATOR_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_REPORT_GENERATOR_URL is not configured");
  }

  const url = new URL(baseUrl);
  url.searchParams.set("agencyId", agencyId);
  url.searchParams.set("propertyId", propertyId);
  url.searchParams.set("inspectionId", inspectionId);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to get PDF URL: ${response.status}`);
  }

  const data = await response.json();
  return data.url as string;
}
