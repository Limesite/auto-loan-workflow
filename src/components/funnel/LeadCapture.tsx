import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import type { FunnelData, ContactPreference } from '../../types/funnel';

interface LeadCaptureProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onSubmit: () => void;
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function humanize(val: string) {
  return val.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const FAKE_ROWS = [
  { product: 'Auto Loan · 36 months', rate: '5.99%', apr: '6.09%', payment: '$621/mo' },
  { product: 'Auto Loan · 48 months', rate: '6.49%', apr: '6.59%', payment: '$493/mo' },
  { product: 'Auto Loan · 60 months', rate: '6.99%', apr: '7.09%', payment: '$413/mo' },
  { product: 'Auto Loan · 72 months', rate: '7.49%', apr: '7.59%', payment: '$361/mo' },
  { product: 'Auto Loan · 84 months', rate: '7.99%', apr: '8.09%', payment: '$328/mo' },
  { product: 'Auto Loan · 36 months', rate: '6.24%', apr: '6.34%', payment: '$635/mo' },
  { product: 'Auto Loan · 48 months', rate: '6.74%', apr: '6.84%', payment: '$505/mo' },
  { product: 'Auto Loan · 60 months', rate: '7.24%', apr: '7.34%', payment: '$424/mo' },
  { product: 'Auto Loan · 72 months', rate: '7.74%', apr: '7.84%', payment: '$371/mo' },
  { product: 'Auto Loan · 84 months', rate: '8.24%', apr: '8.34%', payment: '$338/mo' },
];

const CONTACT_OPTIONS: { value: ContactPreference; label: string; icon: string }[] = [
  { value: 'phone', label: 'Phone',  icon: '📞' },
  { value: 'text',  label: 'Text',   icon: '💬' },
  { value: 'email', label: 'Email',  icon: '✉️' },
];

const inputCls = (hasError?: boolean) =>
  `w-full px-3 py-2.5 border-2 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#233B86]'
  }`;

export function LeadCapture({ data, onChange, onSubmit }: LeadCaptureProps) {
  const [formStep, setFormStep] = useState<'email' | 'details' | 'verify'>('email');
  const [emailError, setEmailError]     = useState('');
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [detailsError, setDetailsError] = useState('');
  const [consent1, setConsent1]         = useState(false);
  const [consent2, setConsent2]         = useState(false);
  const [code, setCode]                 = useState(['', '', '', '', '', '']);
  const [verifyError, setVerifyError]   = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = data.lead.email;
  const phone = data.lead.phone;
  const contactPreference = data.lead.contactPreference;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isRefinance = data.loanType === 'refinance';

  const handleEmailContinue = () => {
    if (!isValidEmail) { setEmailError('Please enter a valid email address.'); return; }
    setEmailError('');
    setFormStep('details');
  };

  const handleDetailsContinue = () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setDetailsError('Please fill in all fields.');
      return;
    }
    if (!contactPreference) {
      setDetailsError('Please select a contact preference.');
      return;
    }
    if (!consent1 || !consent2) {
      setDetailsError('Please agree to both checkboxes to continue.');
      return;
    }
    setDetailsError('');
    onChange({ lead: { ...data.lead, name: `${firstName.trim()} ${lastName.trim()}` } });
    setFormStep('verify');
  };

  const handleCodeChange = (i: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[i] = v;
    setCode(next);
    setVerifyError('');
    if (v && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const handleCodeKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
  };

  const handleCodePaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...code];
    for (let j = 0; j < pasted.length; j++) {
      if (i + j < 6) next[i + j] = pasted[j];
    }
    setCode(next);
    const focusIdx = Math.min(i + pasted.length, 5);
    codeRefs.current[focusIdx]?.focus();
  };

  const handleVerify = () => {
    if (code.some(d => !d)) {
      setVerifyError('Please enter the complete 6-digit code.');
      return;
    }
    setVerifyError('');
    setSubmitting(true);
    setTimeout(onSubmit, 600);
  };

  const sidebarRows = [
    { label: 'Loan Type',    value: data.loanType ? humanize(data.loanType) : '—' },
    { label: 'Vehicle',      value: data.vehicleType ? humanize(data.vehicleType) : '—' },
    { label: 'Model Year',   value: data.modelYear ? String(data.modelYear) : '—' },
    ...(isRefinance
      ? [{ label: 'Remaining Bal.', value: fmtCurrency(data.remainingBalance) }]
      : [
          { label: 'Vehicle Price',  value: fmtCurrency(data.vehiclePrice) },
          { label: 'Down Payment',   value: fmtCurrency(data.downPayment) },
        ]
    ),
    { label: 'Credit Score',  value: `${data.creditScore}` },
    { label: 'Annual Income', value: fmtCurrency(data.annualIncome) },
    { label: 'Employment',    value: data.employmentStatus ? humanize(data.employmentStatus) : '—' },
  ];

  return (
    <div className="flex flex-col sm:flex-row min-h-[700px]">
      {/* Left sidebar */}
      <div className="hidden sm:flex w-[260px] flex-shrink-0 px-6 py-7 flex-col bg-[#1A2B63]">
        <p className="text-white font-bold text-base mb-5">Your selected details</p>
        <div className="space-y-0">
          {sidebarRows.map((row, i) => (
            <div key={row.label} className={`flex justify-between items-start py-3 ${i < sidebarRows.length - 1 ? 'border-b border-white/10' : ''}`}>
              <span className="text-white/50 text-xs leading-tight">{row.label}</span>
              <span className="text-white font-bold text-xs text-right ml-3 leading-tight">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 flex flex-col px-6 py-6">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-[#EA2523] text-white text-xs font-bold px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE RATES
          </div>
        </div>

        <h2 className="text-lg font-black text-gray-900 text-center mb-4 leading-snug">
          You have <span className="text-[#233B86]">2 auto loan offers</span> ready for your review!
        </h2>

        <div className="relative flex-1">
          <div className="grid grid-cols-4 gap-2 mb-1.5 px-1">
            {['PRODUCT', 'RATE', 'APR', 'MO. PAYMENT'].map(h => (
              <p key={h} className="text-[10px] font-bold uppercase tracking-wide text-center" style={{ color: '#757575' }}>{h}</p>
            ))}
          </div>

          <div className="select-none pointer-events-none" style={{ filter: 'blur(4px)' }}>
            {FAKE_ROWS.map((row, i) => (
              <div key={i} className={`grid grid-cols-4 gap-2 px-2 py-3 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} rounded`}>
                <p className="text-sm text-gray-700 font-semibold col-span-1 truncate">{row.product}</p>
                <p className="text-sm font-bold text-gray-800 text-center">{row.rate}</p>
                <p className="text-sm text-gray-600 text-center">{row.apr}</p>
                <p className="text-sm font-bold text-gray-800 text-center">{row.payment}</p>
              </div>
            ))}
          </div>

          {/* Gate overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 24 }}
              className="bg-white rounded-2xl shadow-xl px-6 py-5 w-full max-w-[400px] border border-gray-100"
            >
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <Lock size={18} className="text-amber-500" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {formStep === 'email' && (
                  <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <p className="text-sm font-bold text-gray-900 text-center mb-3">Free and complete access in seconds</p>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => { setEmailError(''); setFormStep('details'); }} className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </motion.button>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs font-medium" style={{ color: '#757575' }}>or</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <div className="mb-3">
                      <input type="email" placeholder="Enter your email" value={email} onChange={e => { onChange({ lead: { ...data.lead, email: e.target.value } }); setEmailError(''); }} onKeyDown={e => { if (e.key === 'Enter') handleEmailContinue(); }} className={inputCls(!!emailError)} />
                      {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                    </div>
                    <motion.button onClick={handleEmailContinue} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-[#EA2523] hover:bg-[#C41E1C] transition-colors flex items-center justify-center gap-2">
                      Continue <ArrowRight size={15} />
                    </motion.button>
                    <p className="text-[11px] text-center mt-2" style={{ color: '#757575' }}>• No SSN required •</p>
                  </motion.div>
                )}

                {formStep === 'details' && (
                  <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <p className="text-sm font-bold text-gray-900 text-center mb-3">Almost there! Just a few more details.</p>
                    <div className="space-y-2 mb-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="First name" value={firstName} onChange={e => { setFirstName(e.target.value); setDetailsError(''); }} className={inputCls()} />
                        <input type="text" placeholder="Last name" value={lastName} onChange={e => { setLastName(e.target.value); setDetailsError(''); }} className={inputCls()} />
                      </div>
                      <input type="tel" placeholder="Phone number" value={phone} onChange={e => { onChange({ lead: { ...data.lead, phone: e.target.value } }); setDetailsError(''); }} className={inputCls()} />
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1.5">Preferred contact method</p>
                        <div className="flex gap-2">
                          {CONTACT_OPTIONS.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => { onChange({ lead: { ...data.lead, contactPreference: opt.value } }); setDetailsError(''); }}
                              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                                contactPreference === opt.value
                                  ? 'border-[#EA2523] bg-[#EA2523]/5 text-[#EA2523]'
                                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              <span>{opt.icon}</span>
                              <span>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2.5 mb-3">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" checked={consent1} onChange={e => { setConsent1(e.target.checked); setDetailsError(''); }} className="mt-0.5 flex-shrink-0 accent-[#EA2523]" />
                        <span className="text-[10px] leading-snug" style={{ color: '#757575' }}>I agree to receive text messages regarding auto loan rate updates, loan information, and related services. Message and data rates may apply. Reply STOP to unsubscribe.</span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" checked={consent2} onChange={e => { setConsent2(e.target.checked); setDetailsError(''); }} className="mt-0.5 flex-shrink-0 accent-[#EA2523]" />
                        <span className="text-[10px] leading-snug" style={{ color: '#757575' }}>By checking this box and submitting the form you are consenting to be contacted regarding auto loan products and services by Texas United Mortgage.</span>
                      </label>
                      <p className="text-[10px] pl-5" style={{ color: '#757575' }}>
                        <a href="#" className="text-[#233B86] hover:underline">Privacy Policy</a>{' | '}
                        <a href="#" className="text-[#233B86] hover:underline">Terms and Conditions</a>
                      </p>
                    </div>
                    {detailsError && <p className="text-xs text-red-500 mb-2">{detailsError}</p>}
                    <motion.button onClick={handleDetailsContinue} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-[#EA2523] hover:bg-[#C41E1C] transition-colors flex items-center justify-center gap-2">
                      See My Auto Loan Rates <ArrowRight size={15} />
                    </motion.button>
                  </motion.div>
                )}

                {formStep === 'verify' && (
                  <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <p className="text-sm font-bold text-gray-900 text-center mb-1">Verify your phone number</p>
                    <p className="text-xs text-center mb-4" style={{ color: '#757575' }}>Enter the 6-digit code sent to {phone || 'your phone'}</p>
                    <div className="flex gap-2 justify-center mb-4">
                      {code.map((d, i) => (
                        <input key={i} ref={el => { codeRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e => handleCodeChange(i, e.target.value)} onKeyDown={e => handleCodeKeyDown(i, e)} onPaste={e => handleCodePaste(i, e)} className={`w-10 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all ${d ? 'border-[#233B86] bg-[#EEF1FB]' : 'border-gray-200 focus:border-[#233B86]'}`} />
                      ))}
                    </div>
                    {verifyError && <p className="text-xs text-red-500 mb-2 text-center">{verifyError}</p>}
                    <motion.button onClick={handleVerify} disabled={submitting} whileHover={!submitting ? { scale: 1.02 } : {}} whileTap={!submitting ? { scale: 0.97 } : {}} className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-[#EA2523] hover:bg-[#C41E1C] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                      {submitting ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />Opening rates...</>) : 'Verify Code'}
                    </motion.button>
                    <button onClick={() => { setFormStep('details'); setCode(['', '', '', '', '', '']); }} className="w-full text-center text-xs mt-2.5 hover:underline" style={{ color: '#757575' }}>
                      ← Back · Resend code
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Reviews */}
        <div className="pt-4 mt-auto border-t border-gray-100">
          <p className="text-xs text-center mb-1.5" style={{ color: '#757575' }}>Reviews of Texas United Mortgage</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-bold text-gray-700">5.0</span>
            <div className="flex gap-0.5">{[...Array(5)].map((_, i) => (<svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>))}</div>
            <span className="text-xs" style={{ color: '#757575' }}>150+ reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}
