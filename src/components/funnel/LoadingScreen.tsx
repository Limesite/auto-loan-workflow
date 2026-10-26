import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  'Analyzing your vehicle details...',
  'Reviewing your financial profile...',
  'Finding your best auto loan rates...',
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
        if (i === STEPS.length - 1) timers.push(setTimeout(onComplete, 600));
      }, 700 + i * 750));
    });
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    const id = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 380);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 bg-white">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
        <img src="/texas-united-logo.webp" alt="Texas United Mortgage" className="h-10 w-auto object-contain" />
      </motion.div>

      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 rounded-full mb-8" style={{ border: '3px solid rgba(0,0,0,0.08)', borderTopColor: '#EA2523', borderRightColor: 'rgba(0,0,0,0.2)' }} />

      <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl font-bold text-gray-900 mb-2 text-center">
        Finding your best rates{dots}
      </motion.h3>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-sm mb-10 text-center" style={{ color: '#757575' }}>
        Comparing today's live auto loan rates for your scenario
      </motion.p>

      <div className="w-full max-w-xs space-y-4">
        {STEPS.map((step, i) => {
          const done = completedSteps.includes(i);
          const active = completedSteps.length === i;
          return (
            <motion.div key={step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="flex items-center gap-3.5">
              <div className="w-6 h-6 flex-shrink-0">
                {done ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 18 }} className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Check size={13} className="text-white" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${active ? 'border-[#233B86]' : 'border-gray-200'}`}>
                    {active && (<motion.div animate={{ scale: [0.5, 1.1, 0.5] }} transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }} className="w-2 h-2 rounded-full bg-[#233B86]" />)}
                  </div>
                )}
              </div>
              <span className={`text-sm font-medium transition-colors ${done ? 'text-emerald-600' : active ? 'text-gray-900' : 'text-gray-300'}`}>{step}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-xs mt-12 text-center" style={{ color: '#757575' }}>
        No credit check · Takes seconds · 100% free
      </motion.p>
    </div>
  );
}
