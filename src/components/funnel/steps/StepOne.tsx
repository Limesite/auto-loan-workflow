import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, FinancingTimeline } from '../../../types/funnel';

interface StepOneProps {
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

const chevron = (
  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth={2}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export function StepOne({ data, onChange, onNext }: StepOneProps) {
  const { modelYear, vehicleMake, vehicleModel, financingTimeline } = data;
  const models = vehicleMake ? (CAR_DATA[vehicleMake] ?? []) : [];

  const canContinue =
    modelYear !== null &&
    vehicleMake !== '' &&
    vehicleModel !== '' &&
    financingTimeline !== null;

  const selectCls = (filled: boolean) =>
    `w-full px-3 py-2.5 border-2 rounded-xl text-sm font-medium focus:outline-none focus:border-[#233B86] transition-all appearance-none bg-white cursor-pointer ${
      filled ? 'text-gray-800 border-gray-200' : 'text-gray-400 border-gray-200'
    }`;

  return (
    <div className="px-5 py-5">

      {/* Q1: Which vehicle are you financing? */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">Which vehicle are you financing?</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Year */}
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

          {/* Make */}
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

        {/* Model — full width */}
        <div className="relative">
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
