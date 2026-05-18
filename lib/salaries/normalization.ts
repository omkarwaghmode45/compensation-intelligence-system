const companyAliases: Record<string, string> = {
  alphabet: "google",
  google: "google",
  meta: "meta",
  facebook: "meta",
  microsoft: "microsoft",
  msft: "microsoft",
  amazon: "amazon",
  aws: "amazon",
  apple: "apple"
};

export function normalizeCompanyName(company: string) {
  const compact = company
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\b(inc|inc\.|llc|ltd|corp|corporation|company|co)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  return companyAliases[compact] ?? compact;
}

export function displayCompanyName(normalizedCompany: string) {
  return normalizedCompany
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
