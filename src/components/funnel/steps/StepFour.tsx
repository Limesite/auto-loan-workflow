import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, EmploymentStatus, RepossessionBankruptcy } from '../../../types/funnel';

interface StepFourProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const EMPLOYMENT_STATUSES: { value: EmploymentStatus; label: string; img?: string; icon?: string }[] = [
  { value: 'employed',      label: 'Employed',       img: '/employed.png'      },
  { value: 'self-employed', label: 'Self-Employed',  img: '/self-employed.png' },
  { value: 'retired',       label: 'Retired',        img: '/retired.png'       },
  { value: 'military',      label: 'Military',       icon: '🎖️'              },
  { value: 'other',         label: 'Other',          icon: '•••'               },
];

const REPO_OPTIONS: { value: RepossessionBankruptcy; label: string; icon: string }[] = [
  { value: 'no',           label: 'No',           icon: '✓'  },
  { value: 'repossession', label: 'Repossession', icon: '🚗' },
  { value: 'bankruptcy',   label: 'Bankruptcy',   icon: '📋' },
  { value: 'both',         label: 'Both',         icon: '⚠️' },
];

const BANDS = [
  { label: 'Poor',      range: '500–619', min: 500, max: 619, color: '#DC2626' },
  { label: 'Fair',      range: '620–679', min: 620, max: 679, color: '#EA580C' },
  { label: 'Good',      range: '680–719', min: 680, max: 719, color: '#CA8A04' },
  { label: 'Excellent', range: '720–850', min: 720, max: 850, color: '#16A34A' },
];

const BAND_MESSAGES: Record<string, string> = {
  Poor:      'Some options may still be available.',
  Fair:      'You may qualify. A few points more helps.',
  Good:      "You're in a solid range for competitive rates.",
  Excellent: 'You qualify for our best rates!',
};

function getActiveBand(score: number) {
  return BANDS.find(b => score >= b.min && score <= b.max) ?? BANDS[2];
}

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

export function StepFour({ data, onChange, onNext }: StepFourProps) {
  const { creditScore, employmentStatus, annualIncome, repossessionBankruptcy } = data;
  const active = getActiveBand(creditScore);
  const MIN = 500, MAX = 850;
  const pct = ((creditScore - MIN) / (MAX - MIN)) * 100;

  const incomePct = (annualIncome / 250000) * 100;
  const canContinue = employmentStatus !== null && repossessionBankruptcy !== null;

  return (
    <div className="px-5 py-5">

      {/* Q1: Credit score */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-4">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">What's your estimated credit score?</h2>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: '#757575' }}>Your Score</p>
            <p className="text-5xl font-black leading-none" style={{ color: active.color }}>{creditScore}</p>
          </div>
          <div className="text-right mt-1">
            <p className="text-xl font-bold" style={{ color: active.color }}>{active.label}</p>
            <p className="text-sm mt-1 leading-relaxed max-w-[180px] text-gray-900">{BAND_MESSAGES[active.label]}</p>
          </div>
        </div>

        <input
          type="range" min={MIN} max={MAX} step={1} value={creditScore}
          onChange={e => onChange({ creditScore: Number(e.target.value) })}
          className="slider-input w-full"
          style={{ background: `linear-gradient(to right, ${active.color} ${pct}%, #E5E7EB ${pct}%)` }}
        />
        <div className="flex justify-between mt-2 mb-5">
          <span className="text-xs" style={{ color: '#757575' }}>500</span>
          <span className="text-xs" style={{ color: '#757575' }}>850</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {BANDS.map(band => {
            const isActive = creditScore >= band.min && creditScore <= band.max;
            return (
              <div
                key={band.label}
                className={`rounded-xl px-2 py-2 text-center border-2 transition-all ${isActive ? '' : 'border-transparent bg-gray-50'}`}
                style={isActive ? { borderColor: band.color + '50', backgroundColor: band.color + '15' } : {}}
              >
                <p className="text-xs font-bold" style={{ color: band.color }}>{band.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#757575' }}>{band.range}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Q2: Employment status */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">What's your employment status?</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {EMPLOYMENT_STATUSES.map(es => {
            const selected = employmentStatus === es.value;
            return (
              <motion.button
                key={es.value}
                onClick={() => onChange({ employmentStatus: es.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5 shadow-md'
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
                {es.img
                  ? <img src={es.img} alt={es.label} className="w-8 h-8 object-contain flex-shrink-0" />
                  : <span className="text-sm flex-shrink-0">{es.icon}</span>
                }
                <p className="text-sm font-bold text-gray-900 text-left">{es.label}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q3: Annual income */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={3} />
          <h2 className="text-base font-black text-gray-900">What is the gross annual income of the borrower(s)?</h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#757575' }}>Annual Income</span>
            <span className="text-xl font-black text-[#1E3569]">{fmtCurrency(annualIncome)}</span>
          </div>
          <input
            type="range" min={0} max={250000} step={2500} value={annualIncome}
            onChange={e => onChange({ annualIncome: Number(e.target.value) })}
            className="slider-input w-full"
            style={{ background: `linear-gradient(to right, #1E3569 ${incomePct}%, #E5E7EB ${incomePct}%)` }}
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs" style={{ color: '#757575' }}>$0</span>
            <span className="text-xs" style={{ color: '#757575' }}>$250K+</span>
          </div>
        </div>
      </div>

      {/* Q4: Repossession / bankruptcy */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={4} />
          <h2 className="text-base font-black text-gray-900">Any repossession or bankruptcy in the last 7 years?</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {REPO_OPTIONS.map(opt => {
            const selected = repossessionBankruptcy === opt.value;
            return (
              <motion.button
                key={opt.value}
                onClick={() => onChange({ repossessionBankruptcy: opt.value })}
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
                <span className="text-base">{opt.icon}</span>
                <span className="text-sm font-bold text-gray-900">{opt.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Continue */}
      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[#EA2523] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
            >
              See My Auto Loan Options
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
