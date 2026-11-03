import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { VideoConsultationPage } from './pages/VideoConsultationPage';
import { HealthRecordsPage } from './pages/HealthRecordsPage';
import { PharmacyStockPage } from './pages/PharmacyStockPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { isLoggedIn, currentPage } = useApp();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Responsive Collapsible Sidebar */}
      <Sidebar />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Universal Top Header */}
        <Header />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'dashboard' && <DashboardPage />}
            {currentPage === 'symptoms' && <SymptomCheckerPage />}
            {currentPage === 'consultation' && <ConsultationPage />}
            {currentPage === 'video' && <VideoConsultationPage />}
            {currentPage === 'records' && <HealthRecordsPage />}
            {currentPage === 'pharmacy' && <PharmacyStockPage />}
            {currentPage === 'settings' && <SettingsPage />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
