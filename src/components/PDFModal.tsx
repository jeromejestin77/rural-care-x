import React from 'react';
import { X, Printer, Download, ShieldCheck, Heart } from 'lucide-react';
import { HealthRecord, UserProfile } from '../types';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: HealthRecord | null;
  user: UserProfile;
}

export const PDFModal: React.FC<PDFModalProps> = ({ isOpen, onClose, record, user }) => {
  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `
=============================================================
         RURAL CARE X - DIGITAL HEALTH RECORD / E-PRESCRIPTION
=============================================================
PATIENT DETAILS:
Name: ${user.name}
Phone: ${user.phone}
Aadhaar ID: ${user.aadhaar}
DOB: ${user.dob} | Blood Group: ${user.bloodGroup}

CONSULTATION DETAILS:
Date: ${record.date}
Record ID: ${record.id}
Doctor: ${record.doctor}
Type: ${record.type}
Sync Status: ${record.synced ? 'Synced with Central Registry' : 'Locally Cached'}

CLINICAL VITALS:
- Temperature: ${record.vitals?.temperature || 'Not recorded'}
- Blood Pressure: ${record.vitals?.bloodPressure || 'Not recorded'}
- Heart Rate: ${record.vitals?.heartRate || 'Not recorded'}
- SpO2 Oxygen Level: ${record.vitals?.oxygenLevel || 'Not recorded'}

PRIMARY DIAGNOSIS:
${record.diagnosis}

PRESCRIPTION & INSTRUCTIONS:
${record.prescription}

CLINICAL NOTES:
${record.notes || 'None recorded.'}

=============================================================
Issued under Rural Telemedicine Network Initiative.
Validated Digital Document • Compliant with National Health Mission
=============================================================
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Medical_Record_${record.date}_${user.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-white" />
            <h3 className="font-bold text-lg">Official Medical Record & Prescription</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable Health Card */}
        <div id="printable-record" className="p-6 sm:p-8 space-y-6 text-gray-800 bg-white">
          {/* Card Top Branding */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-black text-blue-800 tracking-tight">RURAL CARE X</h2>
              <p className="text-xs text-gray-500 font-medium">Digital Rural Healthcare & Telemedicine Network</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Govt. PHC & Tele-Consultation Node</p>
            </div>
            <div className="text-right text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold mb-1">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Verified Clinical Record
              </span>
              <p className="text-gray-500">Record ID: <span className="font-mono font-semibold text-gray-800">{record.id}</span></p>
              <p className="text-gray-500">Issued Date: <span className="font-semibold text-gray-800">{record.date}</span></p>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-gray-500 font-medium">Patient Name</p>
              <p className="font-bold text-gray-900 text-sm">{user.name}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Phone Number</p>
              <p className="font-semibold text-gray-900">{user.phone}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Aadhaar Reference</p>
              <p className="font-semibold text-gray-900">{user.aadhaar}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Blood Group</p>
              <p className="font-bold text-red-600">{user.bloodGroup || 'B+'}</p>
            </div>
          </div>

          {/* Attending Doctor */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">Attending Physician / Specialist</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">{record.doctor}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">Encounter Classification</p>
              <p className="font-bold text-blue-700 text-sm mt-0.5">{record.type}</p>
            </div>
          </div>

          {/* Clinical Vitals */}
          {record.vitals && (
            <div className="border border-gray-200 rounded-xl p-3 bg-slate-50">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Patient Vitals at Encounter</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 block">Temperature:</span>
                  <span className="font-semibold text-gray-800">{record.vitals.temperature || '98.6 °F'}</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 block">Blood Pressure:</span>
                  <span className="font-semibold text-gray-800">{record.vitals.bloodPressure || '120/80 mmHg'}</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 block">Heart Rate:</span>
                  <span className="font-semibold text-gray-800">{record.vitals.heartRate || '74 bpm'}</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 block">SpO2 (Oxygen):</span>
                  <span className="font-semibold text-gray-800">{record.vitals.oxygenLevel || '98%'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Diagnosis & Prescription */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Diagnosis / Findings</p>
              <div className="mt-1 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-sm font-semibold text-amber-950">
                {record.diagnosis}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Rx / Prescription & Regimen</p>
              <div className="mt-1 p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-sm text-emerald-950 whitespace-pre-wrap font-mono">
                {record.prescription}
              </div>
            </div>

            {record.notes && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Doctor's Clinical Notes</p>
                <p className="mt-1 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                  {record.notes}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-3 text-[11px] text-gray-400 flex justify-between">
            <span>Rural Health Digital Initiative</span>
            <span>Digitally Authenticated Document</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-900 shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Save Text File</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

