export type LoanType = 'new-purchase' | 'used-purchase' | 'refinance';
export type VehicleType = 'car-sedan' | 'suv-crossover' | 'truck' | 'van-minivan' | 'other';
export type EmploymentStatus = 'employed' | 'self-employed' | 'retired' | 'military' | 'other';
export type FinancingTimeline = 'right-away' | 'within-30-days' | '1-3-months' | 'just-researching';
export type PurchaseLocation = 'dealership' | 'private-seller' | 'not-sure';
export type TradeIn = 'no' | 'yes-owe' | 'yes-paid-off';
export type RefinanceGoal = 'lower-payment' | 'lower-rate' | 'shorten-term' | 'cash-out';
export type RepossessionBankruptcy = 'no' | 'repossession' | 'bankruptcy' | 'both';

export interface FunnelData {
  // Step 1: Getting Started
  loanType: LoanType | null;
  zipCode: string;
  financingTimeline: FinancingTimeline | null;
  vehicleMake: string;
  vehicleModel: string;

  // Step 2: Car Details
  vehicleType: VehicleType | null;
  modelYear: number | null;
  mileageRange: number | null;
  purchaseLocation: PurchaseLocation | null;

  // Step 3a: Loan Details — Purchase
  vehiclePrice: number;
  downPayment: number;
  tradeIn: TradeIn | null;
  loanTerm: 36 | 48 | 60 | 72 | 84 | null;

  // Step 3b: Loan Details — Refinance
  remainingBalance: number;
  currentRate: number | null;
  monthsRemaining: number;
  refinanceGoal: RefinanceGoal | null;

  // Step 4: Financial Details
  creditScore: number;
  employmentStatus: EmploymentStatus | null;
  annualIncome: number;
  repossessionBankruptcy: RepossessionBankruptcy | null;

  // Lead Capture (Step 5: Contact Details)
  lead: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface RateData {
  label: string;
  badge?: string;
  interestRate: number;
  apr: number;
  monthlyPayment: number;
  loanAmount: number;
  termMonths: number;
  totalInterest: number;
}

export type FunnelStep =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'lead-capture'
  | 'loading'
  | 'rates';

export const STEP_ORDER: FunnelStep[] = [
  'step1',
  'step2',
  'step3',
  'step4',
  'step5',
  'loading',
  'lead-capture',
  'rates',
];

export const QUESTION_STEPS: FunnelStep[] = ['step1', 'step2', 'step3', 'step4', 'step5'];
