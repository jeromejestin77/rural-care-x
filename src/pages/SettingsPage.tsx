import React, { useState } from 'react';
import { User, Globe, Bell, Shield, Database, CheckCircle2, LogOut, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';
import { isSupabaseConfigured } from '../services/supabase';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, language, setLanguage, logout, t } = useApp();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [aadhaar, setAadhaar] = useState(user.aadhaar);
  const [email, setEmail] = useState(user.email);
  const [dob, setDob] = useState(user.dob);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup);
  const [reminders, setReminders] = useState(user.notifications.reminders);
  const [healthTips, setHealthTips] = useState(user.notifications.healthTips);
  const [medAlerts, setMedAlerts] = useState(user.notifications.medicineAlerts);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      ...user,
      name,
      phone,
      aadhaar,
      email,
      dob,
      bloodGroup,
      notifications: {
        reminders,
        healthTips,
        medicineAlerts: medAlerts
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">{t.settings}</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">
          Manage your personal patient record profile, regional languages, notifications, and cloud sync
        </p>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>Profile and health preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Personal Health Information */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4 flex items-center">
              <User className="h-4 w-4 mr-2 text-blue-600" />
              {t.profileInfo}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Patient Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Contact</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Aadhaar Reference / ABHA ID</label>
                <input
                  type="text"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white text-sm font-medium"
                >
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4 flex items-center">
              <Globe className="h-4 w-4 mr-2 text-blue-600" />
              {t.languagePreferences}
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Select your primary regional language. The platform interface updates instantly.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    language === l.code
                      ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-600/20 font-bold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <p className="text-sm font-bold">{l.native}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{l.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4 flex items-center">
              <Bell className="h-4 w-4 mr-2 text-blue-600" />
              {t.notificationPreferences}
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-gray-900">SMS / Telehealth Consultation Reminders</p>
                  <p className="text-xs text-gray-500">Alerts 30 minutes before booked telemedicine calls</p>
                </div>
                <input
                  type="checkbox"
                  checked={reminders}
                  onChange={(e) => setReminders(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Daily Health & Seasonal Hygiene Tips</p>
                  <p className="text-xs text-gray-500">Prevention guidance for water and vector-borne infections</p>
                </div>
                <input
                  type="checkbox"
                  checked={healthTips}
                  onChange={(e) => setHealthTips(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Jan Aushadhi Medicine Restock Alerts</p>
                  <p className="text-xs text-gray-500">Alerts when essential medicines are available at local depots</p>
                </div>
                <input
                  type="checkbox"
                  checked={medAlerts}
                  onChange={(e) => setMedAlerts(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Supabase & Cloud Architecture Status */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center">
              <Database className="h-4 w-4 mr-2 text-blue-600" />
              Backend & Cloud Sync Status
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Supabase Cloud Integration:</span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                  {isSupabaseConfigured ? 'Connected to Cloud' : 'Active in Offline-First Local Mode'}
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                {isSupabaseConfigured
                  ? 'All health records and appointments automatically synchronize with your remote Supabase instance.'
                  : 'To link your remote cloud database, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. The platform functions in offline-first mode, storing all records securely in browser storage.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>{t.saveChanges}</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-sm border border-red-200 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

