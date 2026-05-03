// Format a number as BDT with ৳ symbol and Indian comma grouping
export function formatBDT(amount: number, showSymbol = true): string {
  const abs = Math.abs(Math.round(amount));
  const formatted = abs.toLocaleString('en-IN');
  const prefix = showSymbol ? '৳' : '';
  return amount < 0 ? `-${prefix}${formatted}` : `${prefix}${formatted}`;
}

export function formatLakh(amount: number): string {
  if (amount === 0) return '৳0';
  const lakh = amount / 100_000;
  if (Math.abs(lakh) >= 100) {
    return `৳${(amount / 10_000_000).toFixed(2)} Cr`;
  }
  return `৳${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)}L`;
}

export function parseBDT(value: string): number {
  const cleaned = value.replace(/[৳,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
