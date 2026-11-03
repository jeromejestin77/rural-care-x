import React, { useState } from 'react';
import { Video, Star, Languages, Building2, Clock, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Doctor } from '../types';

export const ConsultationPage: React.FC = () => {
  const { doctors, setSelectedDoctor, setCurrentPage, bookAppointment, t } = useApp();
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [bookingType, setBookingType] = useState<'Video' | 'Audio'>('Video');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const specialties = ['All', 'General Medicine', 'Cardiology', 'Pediatrics', 'Dermatology', 'Gynecology'];
  const filterLanguages = ['All', 'Hindi', 'English', 'Tamil', 'Telugu', 'Bengali'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpec = selectedSpecialty === 'All' || doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    const matchesLang = selectedLanguage === 'All' || doc.language.toLowerCase().includes(selectedLanguage.toLowerCase());
    return matchesSpec && matchesLang;
  });

  const handleInstantConsult = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setCurrentPage('video');
  };

  const handleConfirmBooking = () => {
    if (!bookingDoctor) return;
    bookAppointment(bookingDoctor.id, bookingDate, bookingTime, bookingType);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingDoctor(null);
      setSelectedDoctor(bookingDoctor);
      setCurrentPage('dashboard');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">{t.bookConsultation}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Certified medical officers, government primary health center specialists & tele-clinicians
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Filter by Specialty</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-600"
            >
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Filter by Spoken Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-600"
            >
              {filterLanguages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => {
          const isAvailableNow = doc.availability.toLowerCase().includes('now');
          return (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                      {doc.name.replace('Dr. ', '').charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{doc.name}</h3>
                      <p className="text-sm font-semibold text-blue-700 mt-0.5">{doc.specialty}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Building2 className="h-3.5 w-3.5 mr-1 text-gray-400 shrink-0" />
                        <span className="truncate">{doc.hospital}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    <span>{doc.rating}</span>
                    <span className="text-[10px] text-amber-700">({doc.reviewsCount})</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1.5">
                    <Languages className="h-3.5 w-3.5 text-gray-400" />
                    <span className="truncate">{doc.language}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span>{doc.experienceYears} Years Experience</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold ${
                      isAvailableNow
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    ● {doc.availability}
                  </span>
                  <span className="font-extrabold text-gray-900">{doc.consultationFee}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
                {isAvailableNow ? (
                  <button
                    onClick={() => handleInstantConsult(doc)}
                    className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    <Video className="h-4 w-4" />
                    <span>Start Tele-Consult Now</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setBookingDoctor(doc)}
                    className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
                  >
                    <span>Schedule Appointment</span>
                  </button>
                )}
                <button
                  onClick={() => setBookingDoctor(doc)}
                  className="px-4 py-3 border border-gray-300 rounded-xl font-semibold text-xs text-gray-700 hover:bg-gray-50"
                >
                  Book Slot
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Dialog Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 animate-fadeIn">
            <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg">Book Telehealth Appointment</h3>
                <p className="text-xs text-blue-200 mt-0.5">{bookingDoctor.name} ({bookingDoctor.specialty})</p>
              </div>
              <button
                onClick={() => setBookingDoctor(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {bookingSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Appointment Confirmed!</h4>
                  <p className="text-xs text-gray-500">
                    Scheduled with {bookingDoctor.name} on {bookingDate} at {bookingTime}. Added to your dashboard.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Consultation Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl font-medium text-sm text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl font-medium text-sm text-gray-800"
                    >
                      <option>09:30 AM (Morning Clinic)</option>
                      <option>11:00 AM (Morning Clinic)</option>
                      <option>02:30 PM (Afternoon Tele-Hub)</option>
                      <option>04:00 PM (Evening Clinic)</option>
                      <option>06:30 PM (Evening Tele-Hub)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Consultation Format
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingType('Video')}
                        className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                          bookingType === 'Video'
                            ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        📹 High-Definition Video
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingType('Audio')}
                        className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                          bookingType === 'Audio'
                            ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        📞 Low-Bandwidth Audio Call
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                    <p className="font-semibold text-gray-800">Govt. Telehealth Guarantee:</p>
                    <p className="mt-0.5">Free or heavily subsidized consultation through National Telemedicine Mission.</p>
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setBookingDoctor(null)}
                      className="px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
                    >
                      Confirm Appointment
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

