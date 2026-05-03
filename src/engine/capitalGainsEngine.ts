import type { AYConfig } from '../types/config';
import type { CapitalGainEntry, CapitalGainResult } from '../types/tax';

function holdingYears(acquisitionDate: string, saleDate: string): number {
  const acq = new Date(acquisitionDate);
  const sale = new Date(saleDate);
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  return Math.max(0, (sale.getTime() - acq.getTime()) / msPerYear);
}

export function computeCapitalGains(
  entries: CapitalGainEntry[],
  priorYearLoss: number,
  cfg: AYConfig
): {
  results: CapitalGainResult[];
  netCapitalGain: number;
  capitalLossCarryForward: number;
  totalCapitalGainsTax: number;
} {
  // We need total taxable income for slab — handled in main engine
  // Here we compute gain/loss and applicable rate per entry
  const results: CapitalGainResult[] = entries.map((entry) => {
    const gain = entry.salePrice - entry.acquisitionCost;
    const years = holdingYears(entry.acquisitionDate, entry.saleDate);
    const isLongTerm = years >= cfg.capitalGainsLongTermHoldingYears;

    let exemption = 0;
    let taxRate = 0;
    let taxableGain = 0;

    if (entry.assetType === 'listedShares' || entry.assetType === 'mutualFund') {
      if (gain > 0) {
        exemption = Math.min(gain, cfg.capitalGainsListedSharesExemption);
        taxableGain = Math.max(0, gain - exemption);
        taxRate = cfg.capitalGainsListedSharesRate;
      }
    } else if (entry.assetType === 'landBuilding') {
      if (gain > 0) {
        taxableGain = gain;
        taxRate = isLongTerm ? cfg.capitalGainsLongTermRate : 0; // 0 = slab (handled in main engine)
      }
    } else {
      // nonListedShares, other: regular slab rate
      if (gain > 0) {
        taxableGain = gain;
        taxRate = 0; // slab rate
      }
    }

    const tax =
      taxRate > 0 && gain > 0 ? Math.round(taxableGain * taxRate) : 0;

    return {
      id: entry.id,
      holdingYears: years,
      isLongTerm,
      gain,
      exemption,
      taxableGain,
      taxRate,
      tax,
    };
  });

  // Sum all gains and losses
  const totalGains = results.reduce((acc, r) => acc + Math.max(0, r.gain), 0);
  const totalLosses = results.reduce((acc, r) => acc + Math.abs(Math.min(0, r.gain)), 0);
  const grossNetGain = totalGains - totalLosses - priorYearLoss;

  const netCapitalGain = Math.max(0, grossNetGain);
  const capitalLossCarryForward = grossNetGain < 0 ? Math.abs(grossNetGain) : 0;

  // Tax on entries with flat rates already computed above
  // Slab-rate gains are returned as taxableGain with taxRate=0 — main engine adds to total income
  const totalCapitalGainsTax = results.reduce((acc, r) => acc + r.tax, 0);

  return { results, netCapitalGain, capitalLossCarryForward, totalCapitalGainsTax };
}

// Returns the portion of capital gains that should flow through regular slabs
export function slabRateCapitalGains(results: CapitalGainResult[]): number {
  return results
    .filter((r) => r.taxRate === 0 && r.gain > 0)
    .reduce((acc, r) => acc + r.taxableGain, 0);
}
