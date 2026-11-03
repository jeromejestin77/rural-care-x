import React from 'react';
import { Menu, Wifi, WifiOff, RefreshCw, Globe, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';

export const Header: React.FC = () => {
  const {
    currentPage,
    setSidebarOpen,
    isOnline,
    setIsOnline,
    language,
    setLanguage,
    t,
    pendingSyncCount,
    syncAllData,
    isSyncing,
    setCurrentPage,
    user
  } = useApp();

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return t.dashboard;
      case 'symptoms': return t.symptomChecker;
      case 'consultation': return t.bookConsultation;
      case 'video': return t.videoConsultation;
      case 'records': return t.healthRecords;
      case 'pharmacy': return t.pharmacyStock;
      case 'settings': return t.settings;
      default: return t.dashboard;
    }
  };

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{getPageTitle()}</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Primary Health Care Tele-Network</p>
            </div>
          </div>

          {/* Right: Language, Online/Offline, Sync, User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Language Selector */}
            <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm">
              <Globe className="h-4 w-4 text-gray-500 mr-1.5 hidden sm:inline" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-gray-800 font-medium focus:outline-none cursor-pointer"
                aria-label="Select language"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Online / Offline Status Button */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              title={isOnline ? 'Click to simulate rural offline mode' : 'Click to reconnect online'}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden md:inline">{t.onlineMode}</span>
                  <span className="md:hidden">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-amber-600" />
                  <span className="hidden md:inline">{t.offlineMode}</span>
                  <span className="md:hidden">Offline</span>
                </>
              )}
            </button>

            {/* Sync Button (if pending or manually triggered) */}
            <button
              onClick={syncAllData}
              disabled={isSyncing || !isOnline}
              title={isOnline ? 'Sync data with Central Health Registry' : 'Connect online to sync'}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                pendingSyncCount > 0
                  ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              } ${(!isOnline || isSyncing) ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'Syncing...' : pendingSyncCount > 0 ? `${pendingSyncCount} ${t.pendingSync}` : t.synced}
              </span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setCurrentPage('settings')}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title={user.name}
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user.name.charAt(0)}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

