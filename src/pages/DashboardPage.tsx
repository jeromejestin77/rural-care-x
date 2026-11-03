import React from 'react';
import { Stethoscope, Calendar, FileText, Pill, AlertTriangle, ArrowRight, Video, Clock, CheckCircle2, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardPage: React.FC = () => {
  const { user, setCurrentPage, setSelectedDoctor, doctors, appointments, healthRecords, isOnline, t } = useApp();

  const nextAppointment = appointments.find(a => a.status === 'Scheduled');

  const quickCards = [
    {
      id: 'symptoms',
      title: t.symptomChecker,
      desc: 'AI triage & preliminary guidance',
      icon: Stethoscope,
      bg: 'bg-blue-50 hover:bg-blue-100/80',
      border: 'border-blue-200',
      text: 'text-blue-700',
      iconBg: 'bg-blue-600 text-white'
    },
    {
      id: 'consultation',
      title: t.bookConsultation,
      desc: 'Connect with certified PHC doctors',
      icon: Calendar,
      bg: 'bg-emerald-50 hover:bg-emerald-100/80',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-600 text-white'
    },
    {
      id: 'records',
      title: t.healthRecords,
      desc: `${healthRecords.length} records saved (PDF exportable)`,
      icon: FileText,
      bg: 'bg-purple-50 hover:bg-purple-100/80',
      border: 'border-purple-200',
      text: 'text-purple-700',
      iconBg: 'bg-purple-600 text-white'
    },
    {
      id: 'pharmacy',
      title: t.pharmacyStock,
      desc: 'Jan Aushadhi & local dispensaries',
      icon: Pill,
      bg: 'bg-amber-50 hover:bg-amber-100/80',
      border: 'border-amber-200',
      text: 'text-amber-700',
      iconBg: 'bg-amber-600 text-white'
    }
  ];

  const handleStartConsultation = () => {
    if (nextAppointment) {
      const doc = doctors.find(d => d.id === nextAppointment.doctorId) || doctors[0];
      setSelectedDoctor(doc);
    } else {
      setSelectedDoctor(doctors[0]);
    }
    setCurrentPage('video');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <span>ABHA ID: {user.aadhaar}</span>
            <span>•</span>
            <span>{isOnline ? '🟢 Connected to Cloud' : '🟡 Offline Mode (Cached)'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.welcomeBack} {user.name}
          </h2>
          <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
            {t.welcomeSubtitle}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentPage('symptoms')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white text-blue-700 rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-50 shadow-md transition-all active:scale-95"
            >
              <Stethoscope className="h-4 w-4 text-blue-600" />
              <span>{t.startDiagnosis}</span>
            </button>
            <button
              onClick={() => setCurrentPage('consultation')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-800/80 hover:bg-blue-800 text-white rounded-xl font-semibold text-xs sm:text-sm border border-white/20 transition-all"
            >
              <Calendar className="h-4 w-4" />
              <span>{t.bookConsultation}</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Emergency Rural SOS Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-white/20 rounded-xl shrink-0">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base">Rural Medical Emergency Hotline (108)</h4>
            <p className="text-xs text-red-100">Direct connection to National Ambulance & Critical Response Services</p>
          </div>
        </div>
        <a
          href="tel:108"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white text-red-700 font-bold text-xs sm:text-sm rounded-xl shadow hover:bg-red-50 shrink-0 ml-2"
        >
          <PhoneCall className="h-4 w-4" />
          <span>Call 108</span>
        </a>
      </div>

      {/* Upcoming Appointment Bar (if any) */}
      {nextAppointment && (
        <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Confirmed Tele-Consultation
                </span>
                <span className="text-xs text-gray-400">• Today</span>
              </div>
              <h3 className="font-bold text-gray-900 text-base mt-1">{nextAppointment.doctorName}</h3>
              <p className="text-xs text-gray-500 flex items-center mt-0.5">
                <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                {nextAppointment.date} at {nextAppointment.time} ({nextAppointment.specialty})
              </p>
            </div>
          </div>
          <button
            onClick={handleStartConsultation}
            className="w-full md:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20"
          >
            <Video className="h-4 w-4" />
            <span>Launch Video Consultation</span>
          </button>
        </div>
      )}

      {/* Quick Access Grid */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">{t.quickAccess}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setCurrentPage(card.id)}
                className={`p-5 rounded-2xl border ${card.border} ${card.bg} cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.iconBg} shadow`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base mb-1">{card.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{card.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold">
                  <span className={card.text}>Open Service</span>
                  <ArrowRight className={`h-4 w-4 ${card.text}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Health Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Health History */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-base">{t.recentActivity}</h3>
            <button
              onClick={() => setCurrentPage('records')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View All ({healthRecords.length})
            </button>
          </div>
          <div className="space-y-3">
            {healthRecords.slice(0, 3).map((rec) => (
              <div
                key={rec.id}
                onClick={() => setCurrentPage('records')}
                className="p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100/80 cursor-pointer border border-gray-100 transition-colors flex items-start justify-between"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{rec.diagnosis}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{rec.doctor} • {rec.date}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {rec.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rural Health & Hygiene Tips */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 text-base mb-4">{t.healthTips}</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-900">Safe Drinking Water</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Boil drinking water for 10 minutes during monsoon to prevent water-borne diarrheal infections.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-900">Mosquito Protection</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Avoid stagnant water around the household and sleep under medicated bed nets to prevent Dengue and Malaria.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">Anemia Prevention</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Collect free Iron and Folic acid supplements for adolescent girls and pregnant mothers at your local Anganwadi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

