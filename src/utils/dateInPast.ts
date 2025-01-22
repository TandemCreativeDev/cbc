export default function dateInPast(userDate: string): boolean {
  const [day, month, year] = userDate.split("/").map(Number);
  const parsedDate = new Date(year, month - 1, day);
  const now = new Date();
  return parsedDate < now;
}
