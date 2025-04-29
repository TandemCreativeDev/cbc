export default async function fetchSheet(tabGid: number): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CSV_URL}&gid=${tabGid}`
    );
    const csvData = await response.text();
    return csvData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
