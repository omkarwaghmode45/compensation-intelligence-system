const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function formatInr(value: number) {
  return inrFormatter.format(value);
}

export function formatCompactInr(value: number) {
  const absoluteValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absoluteValue >= 10_000_000) {
    return `${sign}₹${trimDecimal(absoluteValue / 10_000_000)} Cr`;
  }

  if (absoluteValue >= 100_000) {
    return `${sign}₹${trimDecimal(absoluteValue / 100_000)} L`;
  }

  return `${sign}${formatInr(absoluteValue)}`;
}

export function formatSignedCompactInr(value: number) {
  if (value === 0) {
    return formatCompactInr(0);
  }

  return `${value > 0 ? "+" : "-"}${formatCompactInr(Math.abs(value))}`;
}

function trimDecimal(value: number) {
  return value.toFixed(1).replace(/\.0$/, "");
}
