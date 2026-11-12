export default async function fetchSheet(tabGid: number): Promise<string> {
  const response = await fetch(`${process.env.SHEET_CSV_URL}&gid=${tabGid}`, {
    signal: AbortSignal.timeout(8000),
  });
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.startsWith("text/csv")) {
    throw new Error(
      `Sheet tab ${tabGid} responded ${response.status} ${contentType}`
    );
  }
  return response.text();
}
