import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepFiveProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

export function StepFive({ data, onChange, onNext }: StepFiveProps) {
  const { zipCode } = data;
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) { setLocError('Geolocation not supported.'); return; }
    setLocating(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
          );
          const json = await res.json() as { postcode?: string };
          if (json.postcode) onChange({ zipCode: json.postcode.slice(0, 5) });
          else setLocError('Could not determine ZIP. Please type it manually.');
        } catch { setLocError('Could not determine ZIP. Please type it manually.'); }
        finally { setLocating(false); }
      },
      () => { setLocating(false); setLocError('Location denied. Please type your ZIP manually.'); }
    );
  };

  const canContinue = zipCode.length === 5;

  return (
    <div className="px-5 py-5">
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>Q1</span>
          <h2 className="text-base font-black text-gray-900">What is your ZIP code?</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">We use this to better match your loan options</p>
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
            {locating ? 'Locating…' : 'Use my location'}
          </motion.button>
        </div>
        {locError && <p className="text-xs text-red-500 mt-1.5">{locError}</p>}
      </div>

      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[#EA2523] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
            >
              See My Rates
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
