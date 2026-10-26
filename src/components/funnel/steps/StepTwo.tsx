import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, VehicleType, MileageRange, PurchaseLocation } from '../../../types/funnel';

interface StepTwoProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const VEHICLE_TYPES: { value: VehicleType; label: string; icon: string }[] = [
  { value: 'car-sedan',    label: 'Car or sedan',     icon: '🚗' },
  { value: 'suv-crossover', label: 'SUV or crossover', icon: '🚙' },
  { value: 'truck',        label: 'Truck',             icon: '🛻' },
  { value: 'van-minivan',  label: 'Van or minivan',    icon: '🚐' },
  { value: 'other',        label: 'Other',             icon: '🚘' },
];

const MILEAGE_RANGES: { value: MileageRange; label: string }[] = [
  { value: 'under-15k',  label: 'Under 15,000'     },
  { value: '15k-50k',    label: '15,000–50,000'    },
  { value: '50k-100k',   label: '50,000–100,000'   },
  { value: 'over-100k',  label: 'Over 100,000'     },
];

const PURCHASE_LOCATIONS: { value: PurchaseLocation; label: string; icon: string }[] = [
  { value: 'dealership',    label: 'Dealership',     icon: '🏢' },
  { value: 'private-seller', label: 'Private seller', icon: '🤝' },
  { value: 'not-sure',      label: 'Not sure yet',   icon: '🤔' },
];

const CURRENT_YEAR = new Date().getFullYear();
const MODEL_YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR + 1 - i);

function QLabel({ n }: { n: number }) {
  return (
    <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>
      Q{n}
    </span>
  );
}

export function StepTwo({ data, onChange, onNext }: StepTwoProps) {
  const { vehicleType, modelYear, mileageRange, purchaseLocation, loanType } = data;

  const showMileage   = loanType === 'used-purchase' || loanType === 'refinance';
  const showPurchaseLoc = loanType === 'new-purchase' || loanType === 'used-purchase';

  const canContinue =
    vehicleType !== null &&
    modelYear !== null &&
    (!showMileage || mileageRange !== null) &&
    (!showPurchaseLoc || purchaseLocation !== null);

  let qNum = 1;

  return (
    <div className="px-5 py-5">

      {/* Q1: Vehicle type */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={qNum++} />
          <h2 className="text-base font-black text-gray-900">What type of vehicle is it?</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {VEHICLE_TYPES.map(vt => {
            const selected = vehicleType === vt.value;
            return (
              <motion.button
                key={vt.value}
                onClick={() => onChange({ vehicleType: vt.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${vt.value === 'other' ? 'col-span-2' : ''}`}
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
                <span className="text-2xl flex-shrink-0">{vt.icon}</span>
                <span className="text-sm font-bold text-gray-800 text-left">{vt.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q2: Model year */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={qNum++} />
          <h2 className="text-base font-black text-gray-900">What is the vehicle's model year?</h2>
        </div>
        <div className="relative">
          <select
            value={modelYear ?? ''}
            onChange={e => onChange({ modelYear: Number(e.target.value) || null })}
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#233B86] transition-all appearance-none bg-white cursor-pointer"
          >
            <option value="">Select a year</option>
            {MODEL_YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth={2}>
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Q3: Mileage (used + refinance only) */}
      {showMileage && (
        <div className="border-t-2 border-gray-100 pt-6 pb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <QLabel n={qNum++} />
            <h2 className="text-base font-black text-gray-900">About how many miles are on it?</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {MILEAGE_RANGES.map(mr => {
              const selected = mileageRange === mr.value;
              return (
                <motion.button
                  key={mr.value}
                  onClick={() => onChange({ mileageRange: mr.value })}
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
                  <span className="text-sm font-bold text-gray-900">{mr.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Q4: Where buying (purchase only) */}
      {showPurchaseLoc && (
        <div className="border-t-2 border-gray-100 pt-6 pb-3">
          <div className="flex items-baseline gap-2 mb-3">
            <QLabel n={qNum} />
            <h2 className="text-base font-black text-gray-900">Where are you buying it?</h2>
          </div>
          <div className="flex flex-col gap-2">
            {PURCHASE_LOCATIONS.map(pl => {
              const selected = purchaseLocation === pl.value;
              return (
                <motion.button
                  key={pl.value}
                  onClick={() => onChange({ purchaseLocation: pl.value })}
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
                  <span className="text-xl">{pl.icon}</span>
                  <span className="text-sm font-bold text-gray-900">{pl.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

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
