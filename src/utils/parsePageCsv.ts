import Papa from "papaparse";
import { Page } from "./types";

export default function parsePageCsv(csv: string): Page[] {
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
  const result: Page[] = languages.map(() => ({ title: "", content: "" }));

  rows.forEach((row) => {
    const key = row[0];
    row.slice(1).forEach((value, index) => {
      result[index][key as keyof Page] = value;
    });
  });

  return result;
}
