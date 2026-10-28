import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import type { FunnelStep } from '../../types/funnel';

interface FunnelLayoutProps {
  children: React.ReactNode;
  currentStep: FunnelStep;
  currentQuestionIndex: number;
  isQuestionStep: boolean;
  totalQuestions: number;
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
  direction: 'forward' | 'backward';
}

const slideVariants = {
  enter: (dir: 'forward' | 'backward') => ({ x: dir === 'forward' ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: 'forward' | 'backward') => ({ x: dir === 'forward' ? -56 : 56, opacity: 0 }),
};

const STEP_LABELS: Partial<Record<FunnelStep, string>> = {
  'step1':        'Getting Started',
  'step2':        'Car Details',
  'step3':        'Loan Details',
  'step4':        'Financial Profile',
  'step5':        'Almost There',
  'lead-capture': 'Almost There',
};

export function FunnelLayout({
  children,
  currentStep,
  currentQuestionIndex,
  isQuestionStep,
  totalQuestions,
  canGoBack,
  onBack,
  onClose,
  direction,
}: FunnelLayoutProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const isLoading     = currentStep === 'loading';
  const isRates       = currentStep === 'rates';
  const isLeadCapture = currentStep === 'lead-capture';

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={isLoading ? undefined : onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`relative z-10 w-full flex flex-col bg-white overflow-hidden
          shadow-[0_32px_80px_rgba(0,0,0,0.28)]
          rounded-none sm:rounded-2xl
          h-full sm:h-auto
          ${isLeadCapture ? 'sm:max-h-[min(95vh,960px)]' : 'sm:max-h-[min(93vh,860px)]'}
          ${isRates ? 'sm:max-w-3xl' : isLeadCapture ? 'sm:max-w-[900px]' : 'sm:max-w-[700px]'}
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* TOP CHROME */}
        {!isLoading && (
          <div className="flex-shrink-0 bg-white">
            <div className="flex items-center px-5 py-3.5 gap-3">
              <div className="w-9 flex-shrink-0">
                <AnimatePresence mode="wait">
                  {canGoBack && !isRates ? (
                    <motion.button
                      key="back"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      onClick={onBack}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      <ArrowLeft size={17} />
                    </motion.button>
                  ) : (
                    <div className="w-9" />
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 flex items-center justify-center min-w-0">
                <img
                  src="/texas-united-logo.webp"
                  alt="Texas United Mortgage"
                  className="h-7 w-auto object-contain flex-shrink-0"
                />
              </div>

              <div className="w-9 flex-shrink-0 flex justify-end">
                {!isLoading && (
                  <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:text-gray-700 hover:bg-gray-100"
                    style={{ color: '#757575' }}
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </div>

            {isQuestionStep && (
              <div className="px-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#757575' }}>
                    {STEP_LABELS[currentStep]}
                  </span>
                  <span className="text-xs font-bold text-[#EA2523] tabular-nums">
                    Step {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: totalQuestions }).map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: i <= currentQuestionIndex ? '100%' : '0%',
                          backgroundColor: '#EA2523',
                        }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="h-px bg-gray-100" />
          </div>
        )}

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
}
