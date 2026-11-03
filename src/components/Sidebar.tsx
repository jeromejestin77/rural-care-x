import React from 'react';
import { Heart, Home, Stethoscope, Calendar, Video, FileText, Pill, Settings, X, Cloud } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, t, pendingSyncCount } = useApp();

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: Home },
    { id: 'symptoms', label: t.symptomChecker, icon: Stethoscope },
    { id: 'consultation', label: t.bookConsultation, icon: Calendar },
    { id: 'video', label: t.videoConsultation, icon: Video },
    { id: 'records', label: t.healthRecords, icon: FileText, badge: pendingSyncCount > 0 ? `${pendingSyncCount} sync` : undefined },
    { id: 'pharmacy', label: t.pharmacyStock, icon: Pill },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">{t.appName}</h1>
            <p className="text-[10px] text-blue-200 mt-0.5">Telemedicine Platform</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 rounded-md text-white hover:bg-white/10"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-6 px-3 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 translate-x-1'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Low-bandwidth / Offline Notice in Sidebar */}
      <div className="absolute bottom-4 left-3 right-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center space-x-2 text-slate-700 font-semibold mb-1">
          <Cloud className="h-4 w-4 text-blue-600" />
          <span>Rural Offline-First</span>
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          Records and consultations remain safely cached on this device when network coverage is weak.
        </p>
      </div>
    </aside>
  );
};

