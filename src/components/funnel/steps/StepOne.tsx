import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, LoanType, FinancingTimeline } from '../../../types/funnel';

interface StepOneProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const LOAN_TYPES: { value: LoanType; label: string; img: string }[] = [
  { value: 'new-purchase',  label: 'New car purchase',              img: '/icons/new-purchase.png'  },
  { value: 'used-purchase', label: 'Used car purchase',             img: '/icons/used-purchase.png' },
  { value: 'refinance',     label: 'Refinance my current auto loan', img: '/icons/refinance.png'    },
];

const TIMELINES: { value: FinancingTimeline; label: string }[] = [
  { value: 'right-away',       label: 'Right away'      },
  { value: 'within-30-days',   label: 'Within 30 days'  },
  { value: '1-3-months',       label: 'In 1–3 months'   },
  { value: 'just-researching', label: 'Just researching' },
];

function QLabel({ n }: { n: number }) {
  return (
    <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>
      Q{n}
    </span>
  );
}

export function StepOne({ data, onChange, onNext }: StepOneProps) {
  const { loanType, financingTimeline } = data;

  const canContinue = loanType !== null && financingTimeline !== null;

  return (
    <div className="px-5 py-5">

      {/* Q1: What type of auto loan do you need? */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">What type of auto loan do you need?</h2>
        </div>
        <div className="flex flex-col gap-2">
          {LOAN_TYPES.map(lt => {
            const selected = loanType === lt.value;
            return (
              <motion.button
                key={lt.value}
                onClick={() => onChange({ loanType: lt.value })}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all ${
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
                <img src={lt.img} alt={lt.label} className="w-12 h-12 object-contain flex-shrink-0" />
                <p className="text-sm font-bold text-gray-900">{lt.label}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q2: How soon do you need financing? */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">How soon do you need financing?</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TIMELINES.map(t => {
            const selected = financingTimeline === t.value;
            return (
              <motion.button
                key={t.value}
                onClick={() => onChange({ financingTimeline: t.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center justify-center px-3 py-3 rounded-xl border-2 transition-all ${
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
                <p className="text-sm font-bold text-gray-900">{t.label}</p>
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
              Continue
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
