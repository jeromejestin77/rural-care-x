import React, { useState } from 'react';
import { Pill, Search, MapPin, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Medicine } from '../types';

export const PharmacyStockPage: React.FC = () => {
  const { medicines, reserveMedicine, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('All');
  const [reservationNotice, setReservationNotice] = useState<string | null>(null);

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.pharmacy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStock =
      stockFilter === 'All' ||
      (stockFilter === 'InStock' && med.stockCount > 0) ||
      (stockFilter === 'Generic' && !med.requiresPrescription);

    return matchesSearch && matchesStock;
  });

  const handleReserve = (med: Medicine) => {
    const success = reserveMedicine(med.id);
    if (success) {
      setReservationNotice(`Successfully reserved 1 unit of ${med.name} at ${med.pharmacy}. Please collect within 24 hours.`);
      setTimeout(() => setReservationNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Search */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">{t.pharmacyStock}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Real-time medicine inventory at Pradhan Mantri Jan Aushadhi Kendras & rural health depots
            </p>
          </div>
        </div>

        {/* Reservation Toast Alert */}
        {reservationNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{reservationNotice}</span>
            </div>
            <button onClick={() => setReservationNotice(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Search Bar & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchMedicines}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm font-medium"
            />
          </div>

          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Stocks & Kendras</option>
              <option value="InStock">Only In Stock Items</option>
              <option value="Generic">Over-The-Counter (OTC) / Free</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMedicines.map((med) => {
          const isOutOfStock = med.stockCount === 0;
          return (
            <div
              key={med.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {med.type}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1 leading-snug">{med.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">Generic: {med.genericName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-extrabold text-gray-900">{med.price}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center text-gray-800 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 mr-1.5 shrink-0" />
                    <span className="truncate">{med.pharmacy}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Distance from you:</span>
                    <span className="font-semibold text-gray-800">{med.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Availability:</span>
                    <span
                      className={`font-bold ${
                        med.availability === 'In Stock'
                          ? 'text-emerald-700'
                          : med.availability === 'Limited Stock'
                          ? 'text-amber-700'
                          : 'text-red-700'
                      }`}
                    >
                      {med.availability} ({med.stockCount} left)
                    </span>
                  </div>
                </div>

                {med.requiresPrescription && (
                  <div className="mt-3 p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-center space-x-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>Prescription required from a certified doctor</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => handleReserve(med)}
                  disabled={isOutOfStock}
                  className={`flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all ${
                    isOutOfStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 active:scale-95'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{isOutOfStock ? t.outOfStock : t.reserveMedicine}</span>
                </button>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(med.pharmacy)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  Directions
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

