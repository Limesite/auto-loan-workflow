import { AnimatePresence, motion } from 'framer-motion';
import { Check, MapPin } from 'lucide-react';
import { useState } from 'react';
import type { FunnelData, LoanType, FinancingTimeline } from '../../../types/funnel';

interface StepOneProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const LOAN_TYPES: { value: LoanType; label: string; img: string; desc: string }[] = [
  { value: 'new-purchase',  label: 'New Car Purchase',              img: '/icons/new-purchase.png',  desc: 'Buy a brand-new vehicle' },
  { value: 'used-purchase', label: 'Used Car Purchase',             img: '/icons/used-purchase.png', desc: 'Buy a pre-owned vehicle' },
  { value: 'refinance',     label: 'Refinance My Current Auto Loan', img: '/icons/refinance.png',    desc: 'Lower your rate or payment' },
];

const TIMELINES: { value: FinancingTimeline; label: string }[] = [
  { value: 'right-away',     label: 'Right away'      },
  { value: 'within-30-days', label: 'Within 30 days'  },
  { value: '1-3-months',     label: 'In 1–3 months'   },
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
  const { loanType, zipCode, financingTimeline } = data;
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const canContinue = loanType !== null && financingTimeline !== null;

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
          );
          const json = await res.json() as { postcode?: string };
          if (json.postcode) {
            onChange({ zipCode: json.postcode.slice(0, 5) });
          } else {
            setLocError('Could not determine ZIP code. Please type it manually.');
          }
        } catch {
          setLocError('Could not determine ZIP code. Please type it manually.');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setLocError('Location access denied. Please type your ZIP code manually.');
      }
    );
  };

  return (
    <div className="px-5 py-5">

      {/* Q1: Loan type */}
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
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all ${
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
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">{lt.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{lt.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q2: ZIP code */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">What is your ZIP code?</h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="e.g. 77001"
            value={zipCode}
            onChange={e => onChange({ zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
            className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#233B86] transition-all"
          />
          <motion.button
            onClick={handleUseMyLocation}
            disabled={locating}
            whileHover={!locating ? { scale: 1.02 } : {}}
            whileTap={!locating ? { scale: 0.97 } : {}}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-[#EEF1FB] text-[#233B86] font-semibold text-xs rounded-xl hover:bg-[#dce2f5] transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            <MapPin size={13} />
            {locating ? 'Locating…' : 'Use my ZIP'}
          </motion.button>
        </div>
        {locError && <p className="text-xs text-red-500 mt-1.5">{locError}</p>}
      </div>

      {/* Q3: Financing timeline */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={3} />
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
