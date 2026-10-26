import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, TradeIn, CurrentRate, RefinanceGoal } from '../../../types/funnel';

interface StepThreeProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const TRADE_IN_OPTIONS: { value: TradeIn; label: string; icon: string }[] = [
  { value: 'no',           label: 'No',                      icon: '✗'  },
  { value: 'yes-owe',      label: 'Yes, and I owe money on it', icon: '💳' },
  { value: 'yes-paid-off', label: 'Yes, and it\'s paid off',   icon: '✅' },
];

const LOAN_TERMS: Array<{ value: 36 | 48 | 60 | 72 | 84; label: string }> = [
  { value: 36, label: '36 months' },
  { value: 48, label: '48 months' },
  { value: 60, label: '60 months' },
  { value: 72, label: '72 months' },
  { value: 84, label: '84 months' },
];

const CURRENT_RATES: { value: CurrentRate; label: string }[] = [
  { value: 'below-5',  label: 'Below 5%'  },
  { value: '5-7',      label: '5%–7%'     },
  { value: '7-10',     label: '7%–10%'    },
  { value: '10-15',    label: '10%–15%'   },
  { value: 'above-15', label: 'Above 15%' },
];

const REFINANCE_GOALS: { value: RefinanceGoal; label: string; icon: string }[] = [
  { value: 'lower-payment', label: 'Lower my payment', icon: '📉' },
  { value: 'lower-rate',    label: 'Lower my rate',    icon: '💰' },
  { value: 'shorten-term',  label: 'Shorten my term',  icon: '⚡' },
  { value: 'cash-out',      label: 'Get cash out',     icon: '💵' },
];

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function QLabel({ n }: { n: number }) {
  return (
    <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>
      Q{n}
    </span>
  );
}

function PriceSlider({
  label, value, min, max, step, onChange, fmtLeft, fmtRight,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmtLeft: string;
  fmtRight: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#757575' }}>{label}</span>
        <span className="text-xl font-black text-[#1E3569]">{fmtCurrency(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="slider-input w-full"
        style={{ background: `linear-gradient(to right, #1E3569 ${pct}%, #E5E7EB ${pct}%)` }}
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs" style={{ color: '#757575' }}>{fmtLeft}</span>
        <span className="text-xs" style={{ color: '#757575' }}>{fmtRight}</span>
      </div>
    </div>
  );
}

function MonthsSlider({
  value, onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const MIN = 6, MAX = 84;
  const pct = ((value - MIN) / (MAX - MIN)) * 100;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#757575' }}>Months Remaining</span>
        <span className="text-xl font-black text-[#1E3569]">{value} mo</span>
      </div>
      <input
        type="range" min={MIN} max={MAX} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="slider-input w-full"
        style={{ background: `linear-gradient(to right, #1E3569 ${pct}%, #E5E7EB ${pct}%)` }}
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs" style={{ color: '#757575' }}>6 mo</span>
        <span className="text-xs" style={{ color: '#757575' }}>84 mo</span>
      </div>
    </div>
  );
}

// ─── Purchase Flow ─────────────────────────────────────────────────────────────

function PurchaseFlow({ data, onChange, onNext }: StepThreeProps) {
  const { vehiclePrice, downPayment, tradeIn, loanTerm } = data;
  const canContinue = tradeIn !== null && loanTerm !== null;

  return (
    <>
      {/* Q1: Vehicle price */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">What is the vehicle's price?</h2>
        </div>
        <PriceSlider
          label="Vehicle Price" value={vehiclePrice} min={5000} max={100000} step={1000}
          onChange={v => onChange({ vehiclePrice: v })}
          fmtLeft="$5K" fmtRight="$100K"
        />
      </div>

      {/* Q2: Down payment */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">How much will you put down?</h2>
        </div>
        <PriceSlider
          label="Down Payment" value={downPayment} min={0} max={30000} step={500}
          onChange={v => onChange({ downPayment: v })}
          fmtLeft="$0" fmtRight="$30K"
        />
      </div>

      {/* Q3: Trade-in */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={3} />
          <h2 className="text-base font-black text-gray-900">Do you have a trade-in?</h2>
        </div>
        <div className="flex flex-col gap-2">
          {TRADE_IN_OPTIONS.map(opt => {
            const selected = tradeIn === opt.value;
            return (
              <motion.button
                key={opt.value}
                onClick={() => onChange({ tradeIn: opt.value })}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-4 h-4 bg-[#EA2523] rounded-full flex items-center justify-center"
                  >
                    <Check size={9} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
                <span className="text-base">{opt.icon}</span>
                <span className="text-sm font-bold text-gray-900">{opt.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q4: Loan term */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={4} />
          <h2 className="text-base font-black text-gray-900">What loan term would you like?</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {LOAN_TERMS.map(t => {
            const selected = loanTerm === t.value;
            return (
              <motion.button
                key={t.value}
                onClick={() => onChange({ loanTerm: t.value })}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center justify-center py-3 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#EA2523] rounded-full flex items-center justify-center"
                  >
                    <Check size={8} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
                <span className="text-xs font-bold text-gray-900">{t.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[#EA2523] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Refinance Flow ────────────────────────────────────────────────────────────

function RefinanceFlow({ data, onChange, onNext }: StepThreeProps) {
  const { remainingBalance, currentRate, monthsRemaining, refinanceGoal } = data;
  const canContinue = currentRate !== null && refinanceGoal !== null;

  return (
    <>
      {/* Q1: Remaining balance */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">What is your remaining loan balance?</h2>
        </div>
        <PriceSlider
          label="Remaining Balance" value={remainingBalance} min={5000} max={100000} step={1000}
          onChange={v => onChange({ remainingBalance: v })}
          fmtLeft="$5K" fmtRight="$100K"
        />
      </div>

      {/* Q2: Current interest rate */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">What is your current interest rate?</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {CURRENT_RATES.map(r => {
            const selected = currentRate === r.value;
            return (
              <motion.button
                key={r.value}
                onClick={() => onChange({ currentRate: r.value })}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center justify-center py-3 px-2 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#EA2523] rounded-full flex items-center justify-center"
                  >
                    <Check size={8} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
                <span className="text-xs font-bold text-gray-900 text-center leading-tight">{r.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q3: Months remaining */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={3} />
          <h2 className="text-base font-black text-gray-900">How many months are left on the loan?</h2>
        </div>
        <MonthsSlider value={monthsRemaining} onChange={v => onChange({ monthsRemaining: v })} />
      </div>

      {/* Q4: Main goal */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={4} />
          <h2 className="text-base font-black text-gray-900">What is your main goal?</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {REFINANCE_GOALS.map(g => {
            const selected = refinanceGoal === g.value;
            return (
              <motion.button
                key={g.value}
                onClick={() => onChange({ refinanceGoal: g.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-4 h-4 bg-[#EA2523] rounded-full flex items-center justify-center"
                  >
                    <Check size={9} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
                <span className="text-xl">{g.icon}</span>
                <span className="text-sm font-bold text-gray-900 text-left">{g.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[#EA2523] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main StepThree ────────────────────────────────────────────────────────────

export function StepThree({ data, onChange, onNext }: StepThreeProps) {
  const isRefinance = data.loanType === 'refinance';

  return (
    <div className="px-5 py-5">
      {isRefinance
        ? <RefinanceFlow data={data} onChange={onChange} onNext={onNext} />
        : <PurchaseFlow  data={data} onChange={onChange} onNext={onNext} />
      }
    </div>
  );
}
