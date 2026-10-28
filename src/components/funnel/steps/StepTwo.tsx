import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, PurchaseLocation } from '../../../types/funnel';

interface StepTwoProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const CAR_DATA: Record<string, string[]> = {
  'Acura':         ['ILX', 'MDX', 'RDX', 'TLX', 'ZDX'],
  'Alfa Romeo':    ['Giulia', 'Stelvio', 'Tonale'],
  'Audi':          ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'e-tron GT', 'Q3', 'Q5', 'Q7', 'Q8', 'TT'],
  'BMW':           ['2 Series', '3 Series', '4 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'i4', 'iX'],
  'Buick':         ['Enclave', 'Encore', 'Encore GX', 'Envision'],
  'Cadillac':      ['CT4', 'CT5', 'Escalade', 'XT4', 'XT5', 'XT6'],
  'Chevrolet':     ['Blazer', 'Camaro', 'Colorado', 'Corvette', 'Equinox', 'Malibu', 'Silverado 1500', 'Silverado 2500HD', 'Suburban', 'Tahoe', 'Trailblazer', 'Traverse', 'Trax'],
  'Chrysler':      ['300', 'Pacifica', 'Voyager'],
  'Dodge':         ['Challenger', 'Charger', 'Durango', 'Hornet'],
  'Ford':          ['Bronco', 'Bronco Sport', 'Edge', 'Escape', 'Explorer', 'F-150', 'F-250', 'F-350', 'Maverick', 'Mustang', 'Mustang Mach-E', 'Ranger', 'Transit'],
  'Genesis':       ['G70', 'G80', 'G90', 'GV70', 'GV80'],
  'GMC':           ['Acadia', 'Canyon', 'Sierra 1500', 'Sierra 2500HD', 'Terrain', 'Yukon'],
  'Honda':         ['Accord', 'Civic', 'CR-V', 'HR-V', 'Odyssey', 'Passport', 'Pilot', 'Ridgeline'],
  'Hyundai':       ['Elantra', 'Ioniq 5', 'Ioniq 6', 'Kona', 'Palisade', 'Santa Cruz', 'Santa Fe', 'Sonata', 'Tucson', 'Venue'],
  'Infiniti':      ['Q50', 'Q60', 'QX50', 'QX55', 'QX60', 'QX80'],
  'Jeep':          ['Cherokee', 'Compass', 'Gladiator', 'Grand Cherokee', 'Renegade', 'Wrangler'],
  'Kia':           ['Carnival', 'EV6', 'Forte', 'K5', 'Niro', 'Seltos', 'Sorento', 'Soul', 'Sportage', 'Stinger', 'Telluride'],
  'Land Rover':    ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport'],
  'Lexus':         ['ES', 'GX', 'IS', 'LC', 'LS', 'LX', 'NX', 'RX', 'TX', 'UX'],
  'Lincoln':       ['Aviator', 'Corsair', 'Nautilus', 'Navigator'],
  'Mazda':         ['CX-30', 'CX-5', 'CX-50', 'CX-90', 'Mazda3', 'MX-5 Miata'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'S-Class'],
  'Mitsubishi':    ['Eclipse Cross', 'Outlander', 'Outlander Sport'],
  'Nissan':        ['Altima', 'Armada', 'Frontier', 'Kicks', 'Leaf', 'Maxima', 'Murano', 'Pathfinder', 'Rogue', 'Sentra', 'Titan', 'Versa'],
  'Ram':           ['1500', '2500', '3500', 'ProMaster'],
  'Subaru':        ['Ascent', 'BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Outback', 'Solterra', 'WRX'],
  'Tesla':         ['Model 3', 'Model S', 'Model X', 'Model Y'],
  'Toyota':        ['4Runner', 'Camry', 'Corolla', 'Crown', 'GR86', 'Highlander', 'RAV4', 'Sequoia', 'Sienna', 'Supra', 'Tacoma', 'Tundra', 'Venza'],
  'Volkswagen':    ['Atlas', 'Golf', 'ID.4', 'Jetta', 'Taos', 'Tiguan'],
  'Volvo':         ['S60', 'S90', 'XC40', 'XC60', 'XC90'],
};

const MAKES = Object.keys(CAR_DATA).sort();

const CURRENT_YEAR = new Date().getFullYear();
const MODEL_YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR + 1 - i);

const PURCHASE_LOCATIONS: { value: PurchaseLocation; label: string }[] = [
  { value: 'dealership',    label: 'Dealership'    },
  { value: 'private-seller', label: 'Private seller' },
  { value: 'not-sure',      label: 'Not sure yet'  },
];

function QLabel({ n }: { n: number }) {
  return (
    <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>
      Q{n}
    </span>
  );
}

const chevron = (
  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth={2}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export function StepTwo({ data, onChange, onNext }: StepTwoProps) {
  const { vehicleUnknown, modelYear, vehicleMake, vehicleModel, mileageRange, purchaseLocation, loanType } = data;
  const models = vehicleMake ? (CAR_DATA[vehicleMake] ?? []) : [];

  const showMileage     = loanType === 'used-purchase' || loanType === 'refinance';
  const showPurchaseLoc = loanType === 'new-purchase'  || loanType === 'used-purchase';

  const canContinue =
    (vehicleUnknown || (modelYear !== null && vehicleMake !== '' && vehicleModel !== '')) &&
    (!showMileage || mileageRange !== null) &&
    (!showPurchaseLoc || purchaseLocation !== null);

  const selectCls = (filled: boolean) =>
    `w-full px-3 py-2.5 border-2 rounded-xl text-sm font-medium focus:outline-none focus:border-[#233B86] transition-all appearance-none bg-white cursor-pointer ${
      filled ? 'text-gray-800 border-gray-200' : 'text-gray-400 border-gray-200'
    }`;

  let qNum = 1;

  return (
    <div className="px-5 py-5">

      {/* Q1: Which vehicle are you financing? */}
      <div className="pb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-baseline gap-2">
            <QLabel n={qNum++} />
            <h2 className="text-base font-black text-gray-900">Which vehicle are you financing?</h2>
          </div>
          <button
            onClick={() => onChange(
              vehicleUnknown
                ? { vehicleUnknown: false }
                : { vehicleUnknown: true, modelYear: null, vehicleMake: '', vehicleModel: '' }
            )}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">I don't know</span>
            <div className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${vehicleUnknown ? 'bg-[#EA2523]' : 'bg-gray-200'}`}>
              <motion.div
                className="absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow"
                animate={{ left: vehicleUnknown ? '20px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            </div>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {!vehicleUnknown && (
            <motion.div
              key="vehicle-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="relative">
                  <select
                    value={modelYear ?? ''}
                    onChange={e => onChange({ modelYear: Number(e.target.value) || null })}
                    className={selectCls(modelYear !== null)}
                  >
                    <option value="">Year (e.g., 2023)</option>
                    {MODEL_YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  {chevron}
                </div>

                <div className="relative">
                  <select
                    value={vehicleMake}
                    onChange={e => onChange({ vehicleMake: e.target.value, vehicleModel: '' })}
                    className={selectCls(vehicleMake !== '')}
                  >
                    <option value="">Make (e.g., Toyota)</option>
                    {MAKES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {chevron}
                </div>
              </div>

              <div className="relative mb-3">
                <select
                  value={vehicleModel}
                  onChange={e => onChange({ vehicleModel: e.target.value })}
                  disabled={vehicleMake === ''}
                  className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm font-medium focus:outline-none focus:border-[#233B86] transition-all appearance-none bg-white ${
                    vehicleMake === ''
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                      : vehicleModel
                        ? 'text-gray-800 border-gray-200 cursor-pointer'
                        : 'text-gray-400 border-gray-200 cursor-pointer'
                  }`}
                >
                  <option value="">Model (e.g., Camry)</option>
                  {models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                {chevron}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Q2: Mileage slider (used + refinance only) */}
      {showMileage && (
        <div className="border-t-2 border-gray-100 pt-6 pb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <QLabel n={qNum++} />
            <h2 className="text-base font-black text-gray-900">About how many miles are on it?</h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#757575' }}>Mileage</span>
              {mileageRange !== null
                ? <span className="text-xl font-black text-[#1E3569]">{mileageRange.toLocaleString()} mi</span>
                : <span className="text-sm text-gray-400">Slide to set</span>
              }
            </div>
            <input
              type="range" min={0} max={250000} step={1000}
              value={mileageRange ?? 0}
              onChange={e => onChange({ mileageRange: Number(e.target.value) })}
              className="slider-input w-full"
              style={{ background: `linear-gradient(to right, #1E3569 ${((mileageRange ?? 0) / 250000) * 100}%, #E5E7EB ${((mileageRange ?? 0) / 250000) * 100}%)` }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: '#757575' }}>0 mi</span>
              <span className="text-xs" style={{ color: '#757575' }}>250,000 mi</span>
            </div>
          </div>
        </div>
      )}

      {/* Q3: Where buying (purchase only) */}
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
