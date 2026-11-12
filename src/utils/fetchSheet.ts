export default async function fetchSheet(tabGid: number): Promise<string> {
  const response = await fetch(`${process.env.SHEET_CSV_URL}&gid=${tabGid}`);
  if (!response.ok) {
    throw new Error(`Sheet tab ${tabGid} responded ${response.status}`);
  }
  return response.text();
}
