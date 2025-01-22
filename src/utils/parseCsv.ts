import Papa from "papaparse";

export default function parseCsv<T extends Record<string, any>>(
  csv: string,
  isValidRow: (row: T) => boolean
): T[] {
  const parsed = Papa.parse<T>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    console.error("CSV parsing errors:", parsed.errors);
    return [];
  }

  return parsed.data.filter(isValidRow);
}
