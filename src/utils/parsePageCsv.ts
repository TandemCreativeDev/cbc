import Papa from "papaparse";

export default function parsePageCsv<T extends Record<string, string[]>>(
  csv: string
): T[] {
  const parsed = Papa.parse<string[]>(csv, {
    header: false,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    console.error("CSV parsing errors:", parsed.errors);
    return [];
  }

  const [headers, ...rows] = parsed.data;

  if (!headers || headers.length <= 1) {
    console.error("Invalid CSV format: No valid headers found.");
    return [];
  }

  const languages = headers.slice(1);
  const result: T[] = languages.map(() => ({} as T));

  rows.forEach((row) => {
    const key = row[0];
    row.slice(1).forEach((value, index) => {
      (result[index] as Record<string, string[]>)[key] = [value];
    });
  });

  return result;
}
