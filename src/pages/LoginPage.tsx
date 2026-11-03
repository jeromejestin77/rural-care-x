import React, { useState, useEffect } from 'react';
import { Heart, Shield, Phone, KeyRound, Globe, ArrowRight, CheckCircle2, MessageSquare, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export const LoginPage: React.FC = () => {
  const { login, t, language, setLanguage } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('123456');
  const [error, setError] = useState('');
  const [smsNotification, setSmsNotification] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifying, setVerifying] = useState(false);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const generateAndDispatchOtp = async (targetPhone: string) => {
    // Generate realistic random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setResendCooldown(30);

    // If Supabase with Phone Auth is configured, attempt real gateway dispatch
    if (isSupabaseConfigured && supabase) {
      try {
        const formattedPhone = targetPhone.startsWith('+') ? targetPhone : `+91${targetPhone.replace(/\D/g, '').slice(-10)}`;
        await supabase.auth.signInWithOtp({ phone: formattedPhone });
      } catch (err) {
        console.warn('Supabase Phone OTP dispatch fallback:', err);
      }
    }

    // Display realistic SMS notification toast
    setSmsNotification(`📱 SMS Received: Your RuralCareX verification code is [ ${code} ]. Valid for 5 minutes.`);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim().replace(/\s+/g, '');
    if (!cleanId || cleanId.length < 10) {
      setError('Please enter a valid 10-digit Mobile Number or 12-digit Aadhaar Number');
      return;
    }

    setError('');
    setStep('otp');
    await generateAndDispatchOtp(cleanId);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code');
      return;
    }

    setVerifying(true);
    setError('');

    // Verify against generated OTP or default fallback 123456
    const isValid = cleanOtp === generatedOtp || cleanOtp === '123456';

    setTimeout(() => {
      setVerifying(false);
      if (isValid) {
        setSmsNotification(null);
        login(identifier);
      } else {
        setError(`Invalid verification code. The code sent to your phone was ${generatedOtp} (or use 123456).`);
      }
    }, 600);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    await generateAndDispatchOtp(identifier);
  };

  const fillAutoOtp = () => {
    setOtp(generatedOtp);
    setError('');
  };

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'mr', label: 'मराठी' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative">
      {/* Top Language Toggle */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl p-1.5 border border-white/20 text-white text-xs">
        <Globe className="h-4 w-4 ml-1 text-blue-300" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-2"
          aria-label="Language selector"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code} className="bg-slate-900 text-white">
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Simulated SMS Alert Toast */}
      {smsNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-blue-500/40 flex items-start justify-between space-x-3 animate-fadeIn">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl shrink-0 mt-0.5">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-400">RuralCareX SMS Gateway Simulator</p>
              <p className="text-xs font-medium text-slate-200 mt-0.5">{smsNotification}</p>
            </div>
          </div>
          <button
            onClick={fillAutoOtp}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-[11px] font-bold rounded-lg shrink-0 text-white"
          >
            Auto-Fill
          </button>
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white relative">
          <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-md mb-3 shadow-inner">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">{t.appName}</h1>
          <p className="text-blue-100 text-sm mt-1 font-medium">{t.tagline}</p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-gray-900">{t.loginTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">{t.loginSubtitle}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {step === 'input' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-2 tracking-wide">
                  {t.aadhaarOrMobile}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or 12-digit Aadhaar"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 placeholder-gray-400 font-medium"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Compatible with Ayushman Bharat Health Account (ABHA).
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all active:scale-[0.99]"
              >
                <span>{t.sendOtp}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Code sent: <strong>{generatedOtp}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={fillAutoOtp}
                  className="underline font-bold text-blue-700 hover:text-blue-900 text-xs"
                >
                  Auto-Fill
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-2 tracking-wide">
                  {t.enterOtp}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="6-digit code"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-center text-xl font-bold tracking-widest text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono"
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between mt-2.5 text-xs text-gray-500">
                  <span>Sent to: {identifier}</span>
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Change Number
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.99] disabled:opacity-70"
              >
                <span>{verifying ? 'Verifying Code...' : t.verifyOtp}</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>

              <div className="text-center pt-1">
                {resendCooldown > 0 ? (
                  <span className="text-xs text-gray-400 font-medium">
                    Resend code in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-bold"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>{t.resendOtp}</span>
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-xs text-gray-500">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>{t.securePrivateTrusted}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
