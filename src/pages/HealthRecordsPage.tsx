import React, { useState } from 'react';
import { FileText, Plus, Download, Printer, ShieldCheck, Cloud, CloudOff, Eye, X, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HealthRecord } from '../types';
import { PDFModal } from '../components/PDFModal';

export const HealthRecordsPage: React.FC = () => {
  const { healthRecords, addHealthRecord, user, isOnline, syncAllData, isSyncing, t } = useApp();
  const [filterType, setFilterType] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Record Form State
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newType, setNewType] = useState<'Consultation' | 'Lab Test' | 'Immunization'>('Consultation');
  const [newDoctor, setNewDoctor] = useState('Dr. Priya Sharma');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newPrescription, setNewPrescription] = useState('');
  const [newTemp, setNewTemp] = useState('98.6 °F');
  const [newBp, setNewBp] = useState('120/80 mmHg');
  const [newHeartRate, setNewHeartRate] = useState('74 bpm');
  const [newOxygen, setNewOxygen] = useState('98%');

  const filteredRecords = healthRecords.filter(r => {
    return filterType === 'All' || r.type === filterType;
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiagnosis.trim()) return;

    addHealthRecord({
      date: newDate,
      type: newType,
      doctor: newDoctor,
      diagnosis: newDiagnosis.trim(),
      prescription: newPrescription.trim() || 'General lifestyle and health advice.',
      notes: 'Added via Rural Health Center Record Manager',
      vitals: {
        temperature: newTemp,
        bloodPressure: newBp,
        heartRate: newHeartRate,
        oxygenLevel: newOxygen
      }
    });

    setShowAddModal(false);
    setNewDiagnosis('');
    setNewPrescription('');
  };

  const handleExportAll = () => {
    const summary = healthRecords.map((r, i) => `
Record #${i + 1}
Date: ${r.date} | Type: ${r.type} | Doctor: ${r.doctor}
Diagnosis: ${r.diagnosis}
Prescription: ${r.prescription}
Vitals: BP: ${r.vitals?.bloodPressure || 'N/A'}, Temp: ${r.vitals?.temperature || 'N/A'}, Pulse: ${r.vitals?.heartRate || 'N/A'}
-----------------------------------------------------------`).join('\n');

    const content = `RURAL CARE X - COMPLETE PATIENT HEALTH HISTORY
Patient: ${user.name} | Phone: ${user.phone} | Aadhaar: ${user.aadhaar}
Generated: ${new Date().toLocaleString()}
Total Records: ${healthRecords.length}

${summary}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `All_Records_${user.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">{t.healthRecords}</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Decentralized electronic medical records (EMR) synced with Ayushman Bharat digital registries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>{t.addRecord}</span>
          </button>
          <button
            onClick={handleExportAll}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </button>
          <button
            onClick={syncAllData}
            disabled={!isOnline || isSyncing}
            className="inline-flex items-center space-x-1.5 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
          >
            <Cloud className="h-4 w-4 text-blue-600" />
            <span>{isSyncing ? 'Syncing...' : 'Sync Registry'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['All', 'Consultation', 'Lab Test', 'Immunization'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              filterType === type
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Records Table / Cards */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5">Encounter Type</th>
                <th className="py-4 px-5">Doctor / Clinic</th>
                <th className="py-4 px-5">Diagnosis & Findings</th>
                <th className="py-4 px-5">Sync Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-4 px-5 font-semibold text-gray-900 whitespace-nowrap">
                    {record.date}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        record.type === 'Consultation'
                          ? 'bg-blue-100 text-blue-800'
                          : record.type === 'Lab Test'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {record.type}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-gray-800 font-medium">
                    {record.doctor}
                  </td>
                  <td className="py-4 px-5">
                    <p className="font-bold text-gray-900 line-clamp-1">{record.diagnosis}</p>
                    <p className="text-gray-500 text-xs font-mono line-clamp-1 mt-0.5">{record.prescription}</p>
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    {record.synced ? (
                      <span className="inline-flex items-center text-xs text-emerald-700 font-semibold">
                        <Cloud className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                        Cloud Synced
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-amber-700 font-semibold">
                        <CloudOff className="h-3.5 w-3.5 mr-1 text-amber-600" />
                        Cached Offline
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View & PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 animate-fadeIn">
            <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-lg">Add New Health Encounter Record</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-white/80 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Encounter Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-medium"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Lab Test">Lab Test</option>
                    <option value="Immunization">Immunization</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Doctor / Health Worker</label>
                <input
                  type="text"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-medium"
                  placeholder="e.g. Dr. Priya Sharma or PHC Officer"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Diagnosis / Health Finding</label>
                <input
                  type="text"
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-medium"
                  placeholder="e.g. Hypertension Checkup, Normal Blood Sugar"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Prescription & Advice</label>
                <textarea
                  value={newPrescription}
                  onChange={(e) => setNewPrescription(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-medium font-mono"
                  placeholder="e.g. Paracetamol 500mg, Rest, Hydration"
                />
              </div>

              {/* Vitals Grid */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-[11px] font-bold text-gray-700 uppercase mb-2 flex items-center">
                  <Activity className="h-3.5 w-3.5 text-blue-600 mr-1" />
                  Clinical Vitals
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={newTemp}
                    onChange={(e) => setNewTemp(e.target.value)}
                    placeholder="Temp (98.6°F)"
                    className="p-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={newBp}
                    onChange={(e) => setNewBp(e.target.value)}
                    placeholder="BP (120/80)"
                    className="p-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={newHeartRate}
                    onChange={(e) => setNewHeartRate(e.target.value)}
                    placeholder="Pulse (74 bpm)"
                    className="p-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={newOxygen}
                    onChange={(e) => setNewOxygen(e.target.value)}
                    placeholder="SpO2 (98%)"
                    className="p-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Document Preview & Print Modal */}
      <PDFModal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
        user={user}
      />
    </div>
  );
};

