export default async function fetchSheet(tabGid: number): Promise<any> {
  try {
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/e/2PACX-1vSw4MMU8Gms5z3yOkz6TarupuNnWvKTglKdnwZBht7eiRpXAfU-ae6WfPpSt9VkhyqzAg3JPkQaZuZq/pub?output=csv&gid=${tabGid}`
    );
    const csvData = await response.text();
    return csvData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
