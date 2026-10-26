import type { FunnelData, RateData } from '../types/funnel';

type CreditBand = 'excellent' | 'good' | 'fair' | 'poor';

function scoreToBand(score: number): CreditBand {
  if (score >= 720) return 'excellent';
  if (score >= 680) return 'good';
  if (score >= 620) return 'fair';
  return 'poor';
}

function autoLoanRates(band: CreditBand): { primary: number; secondary: number } {
  const map: Record<CreditBand, { primary: number; secondary: number }> = {
    excellent: { primary: 5.99,  secondary: 6.49  },
    good:      { primary: 7.99,  secondary: 8.49  },
    fair:      { primary: 11.99, secondary: 12.99 },
    poor:      { primary: 17.99, secondary: 19.99 },
  };
  return map[band];
}

function calcMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

export interface RateCalculationResult {
  rates: RateData[];
  loanAmount: number;
}

export function calculateRates(data: FunnelData): RateCalculationResult {
  const band = scoreToBand(data.creditScore);
  const rates = autoLoanRates(band);
  const isRefinance = data.loanType === 'refinance';

  let loanAmount: number;
  let primaryTerm: number;
  let secondaryTerm: number;

  if (isRefinance) {
    loanAmount = data.remainingBalance;
    primaryTerm = data.monthsRemaining;
    secondaryTerm = Math.min(primaryTerm + 12, 84);
  } else {
    loanAmount = Math.max(0, data.vehiclePrice - data.downPayment);
    primaryTerm = data.loanTerm ?? 60;
    const candidate = primaryTerm + 12;
    secondaryTerm = candidate > 84 ? 84 : candidate === primaryTerm ? 84 : candidate;
  }

  const primaryMonthly = calcMonthlyPayment(loanAmount, rates.primary, primaryTerm);
  const secondaryMonthly = calcMonthlyPayment(loanAmount, rates.secondary, secondaryTerm);

  return {
    loanAmount,
    rates: [
      {
        label: `Auto Loan · ${primaryTerm} months`,
        badge: 'Best Rate',
        interestRate: rates.primary,
        apr: rates.primary + 0.1,
        monthlyPayment: primaryMonthly,
        loanAmount,
        termMonths: primaryTerm,
        totalInterest: primaryMonthly * primaryTerm - loanAmount,
      },
      {
        label: `Auto Loan · ${secondaryTerm} months`,
        badge: 'Lower Payment',
        interestRate: rates.secondary,
        apr: rates.secondary + 0.1,
        monthlyPayment: secondaryMonthly,
        loanAmount,
        termMonths: secondaryTerm,
        totalInterest: secondaryMonthly * secondaryTerm - loanAmount,
      },
    ],
  };
}

export function creditScoreLabel(score: number): string {
  const band = scoreToBand(score);
  const labels: Record<CreditBand, string> = {
    excellent: `Excellent (${score})`,
    good:      `Good (${score})`,
    fair:      `Fair (${score})`,
    poor:      `Poor (${score})`,
  };
  return labels[band];
}
