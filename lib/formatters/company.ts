export function formatCompanyName(company: string | null | undefined) {
  if (!company) {
    return "Unknown company";
  }

  return company
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
