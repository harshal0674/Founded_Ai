/**
 * Formats a raw number or string following the Indian numbering system comma rule (Lakhs & Crores):
 * Examples:
 *   1000      -> 1,000
 *   10000     -> 10,000
 *   150000    -> 1,50,000
 *   1000000   -> 10,00,000
 *   10000000  -> 1,00,00,000
 *   150000.50 -> 1,50,000.50
 *   150000.   -> 1,50,000.
 */
export function formatIndianNumber(value: string | number | undefined | null): string {
  if (value === null || value === undefined || value === "") return "";
  const rawStr = String(value).replace(/,/g, "").trim();
  if (!rawStr) return "";

  const clean = rawStr.replace(/[^0-9.]/g, "");
  if (!clean) return "";

  const parts = clean.split(".");
  let intPart = parts[0];
  intPart = intPart.replace(/^0+(?=\d)/, "");

  let formattedInt = "";
  if (intPart.length > 3) {
    const lastThree = intPart.slice(-3);
    const remaining = intPart.slice(0, -3);
    const paired = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    formattedInt = `${paired},${lastThree}`;
  } else {
    formattedInt = intPart;
  }

  if (parts.length > 1) {
    const decPart = parts.slice(1).join("").slice(0, 2);
    return `${formattedInt}.${decPart}`;
  }

  return formattedInt;
}

/**
 * Parses an Indian-formatted number string back into a numeric float
 * Examples:
 *   "1,50,000"    -> 150000
 *   "1,50,000.50" -> 150000.5
 */
export function parseIndianNumber(value: string | number | undefined | null): number {
  if (value === null || value === undefined || value === "") return 0;
  const clean = String(value).replace(/,/g, "").replace(/[^0-9.-]/g, "");
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

/**
 * Full currency presentation with symbol and 2 decimal places (or integer for whole numbers)
 */
export function formatIndianCurrency(amount: number, symbol = "₹"): string {
  const num = isNaN(amount) ? 0 : amount;
  return `${symbol}${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
