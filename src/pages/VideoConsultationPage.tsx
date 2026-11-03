import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, MessageSquare, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PDFModal } from '../components/PDFModal';
import { HealthRecord } from '../types';

export const VideoConsultationPage: React.FC = () => {
  const { selectedDoctor, doctors, setCurrentPage, addHealthRecord, user, t } = useApp();
  const doctor = selectedDoctor || doctors[0];

  const [callActive, setCallActive] = useState(true);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(145); // seconds
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Dr. Priya Sharma', text: 'Namaste! Please describe your primary discomfort.', time: '10:01 AM' },
    { sender: 'Patient', text: 'I have had a throat ache and body pain since yesterday.', time: '10:02 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Doctor Clinical Form
  const [diagnosis, setDiagnosis] = useState('Acute Pharyngitis & Mild Upper Respiratory Congestion');
  const [prescription, setPrescription] = useState('1. Paracetamol 500mg - 1 Tab TDS after meals (3 days)\n2. Warm Saline Gargle - 3 times daily\n3. Cetirizine 10mg - 1 Tab at bedtime (3 days)');
  const [clinicalNotes, setClinicalNotes] = useState('Patient presented with sore throat and low-grade pyrexia. Throat congestion present. Chest clear on auscultation. Advised hydration and steam.');

  // Camera stream ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraStream, setHasCameraStream] = useState(false);

  // Generated record for PDF modal
  const [lastSavedRecord, setLastSavedRecord] = useState<HealthRecord | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Initialize camera if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasCameraStream(true);
          }
        }
      } catch (err) {
        // Camera access denied or not available; fallback to visual simulator
        setHasCameraStream(false);
      }
    };

    if (!cameraOff && callActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraOff, callActive]);

  // Call timer
  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const newMsg = {
      sender: user.name,
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
  };

  const handleCompleteConsultation = () => {
    setCallActive(false);

    // Save as official Health Record
    const newRec = {
      date: new Date().toISOString().split('T')[0],
      type: 'Consultation' as const,
      doctor: doctor.name,
      diagnosis,
      prescription,
      notes: clinicalNotes,
      vitals: {
        temperature: '98.8 °F',
        bloodPressure: '122/82 mmHg',
        heartRate: '78 bpm',
        oxygenLevel: '98%'
      }
    };

    addHealthRecord(newRec);

    // Prepare for PDF view
    setLastSavedRecord({
      ...newRec,
      id: `rec-${Date.now()}`,
      synced: true,
      createdAt: Date.now()
    });
    setShowPdfModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Bar with Doctor Info & Duration */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
            {doctor.name.replace('Dr. ', '').charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-lg font-bold text-gray-900">{doctor.name}</h2>
            </div>
            <p className="text-xs text-blue-700 font-semibold">{doctor.specialty} • {doctor.hospital}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-800 font-mono text-xs font-bold border border-gray-200">
            ⏱ {formatTimer(callDuration)}
          </div>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-colors ${
              chatOpen ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">In-Call Chat</span>
          </button>
          <button
            onClick={handleCompleteConsultation}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-red-500/20 flex items-center space-x-1.5"
          >
            <PhoneOff className="h-4 w-4" />
            <span>{t.endCall}</span>
          </button>
        </div>
      </div>

      {/* Main Video & Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video View (2 Cols on lg) */}
        <div className={`${chatOpen ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4 transition-all`}>
          <div className="relative bg-slate-950 rounded-3xl overflow-hidden aspect-video shadow-2xl border border-slate-800 flex items-center justify-center">
            {/* Remote Doctor Video Feed Simulator */}
            <div className="text-center p-6 space-y-4">
              <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-3xl">
                  {doctor.name.replace('Dr. ', '').charAt(0)}
                </div>
                <div className="absolute -bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-950">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg sm:text-xl">{doctor.name}</h3>
                <p className="text-xs text-blue-300">Tele-Consultation in High Definition (Low-Bandwidth Optimized)</p>
                <div className="inline-flex items-center space-x-1 mt-2 px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] text-emerald-400 font-semibold border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Audio & Video Encrypted</span>
                </div>
              </div>
            </div>

            {/* Local Patient PIP Camera */}
            <div className="absolute bottom-4 right-4 w-32 sm:w-44 aspect-video bg-slate-900 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
              {hasCameraStream && !cameraOff ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px] p-2 text-center bg-slate-800">
                  <VideoOff className="h-5 w-5 mb-1 text-slate-500" />
                  <span>{cameraOff ? 'Camera Off' : user.name}</span>
                </div>
              )}
              <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                You ({user.name.split(' ')[0]})
              </div>
            </div>

            {/* Call Controls Overlay Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg">
              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`p-3 rounded-xl transition-all ${
                  micMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title={micMuted ? t.unmute : t.mute}
              >
                {micMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setCameraOff(!cameraOff)}
                className={`p-3 rounded-xl transition-all ${
                  cameraOff ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title={cameraOff ? t.cameraOn : t.cameraOff}
              >
                {cameraOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
              </button>

              <button
                onClick={handleCompleteConsultation}
                className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-transform active:scale-95"
                title="End Consultation"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Chat Drawer (if open) */}
        {chatOpen && (
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col h-[380px] lg:h-auto justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="font-bold text-sm text-gray-900 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1.5 text-blue-600" />
                  Tele-Clinic Live Chat
                </h4>
                <button onClick={() => setChatOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">
                  Hide
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl text-xs ${
                      m.sender === user.name
                        ? 'bg-blue-600 text-white ml-6'
                        : 'bg-gray-100 text-gray-800 mr-6'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-[10px] mb-0.5 opacity-80">
                      <span>{m.sender}</span>
                      <span>{m.time}</span>
                    </div>
                    <p>{m.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type message to doctor..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Clinical Notes & Prescription Editor Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-black text-gray-900">Live E-Prescription & Doctor's Findings</h3>
            <p className="text-xs text-gray-500">Filled by the consulting physician during the telemedicine session</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            Active Session
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
              Primary Clinical Diagnosis
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
              Clinical Observations & Patient Notes
            </label>
            <input
              type="text"
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
            Prescribed Medications & Dosage Instructions
          </label>
          <textarea
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            rows={4}
            className="w-full p-3.5 border border-gray-300 rounded-xl text-sm font-mono text-gray-900 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Clicking complete will commit the record and generate a downloadable medical card.
          </div>
          <button
            onClick={handleCompleteConsultation}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Finish Consultation & Generate Prescription PDF</span>
          </button>
        </div>
      </div>

      {/* PDF Modal */}
      <PDFModal
        isOpen={showPdfModal}
        onClose={() => {
          setShowPdfModal(false);
          setCurrentPage('records');
        }}
        record={lastSavedRecord}
        user={user}
      />
    </div>
  );
};

