export function getAgeFromDOB(dob: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function isSenior(dob: string): boolean {
  return getAgeFromDOB(dob) >= 65;
}

export function holdingYearsDisplay(acquisitionDate: string, saleDate: string): string {
  if (!acquisitionDate || !saleDate) return '';
  const acq = new Date(acquisitionDate);
  const sale = new Date(saleDate);
  const diff = (sale.getTime() - acq.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (diff < 0) return 'Invalid dates';
  if (diff < 1) return `${Math.round(diff * 12)} months`;
  return `${diff.toFixed(1)} years`;
}

export function isDeadlinePassed(deadline: string): boolean {
  return new Date() > new Date(deadline);
}
