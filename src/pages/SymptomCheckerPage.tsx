import React, { useState } from 'react';
import { Stethoscope, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, UserCheck, HeartPulse } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeSymptomsWithAI } from '../services/aiDiagnosis';
import { AISymptomAnalysis } from '../types';

export const SymptomCheckerPage: React.FC = () => {
  const { setCurrentPage, setSelectedDoctor, doctors, t } = useApp();
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState('Moderate');
  const [ageGroup, setAgeGroup] = useState('Adult (20-59)');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AISymptomAnalysis | null>(null);

  const commonSymptomChips = [
    'High Fever & Chills',
    'Dry Cough & Sore Throat',
    'Severe Chest Pain & Shortness of Breath',
    'Diarrhea & Vomiting',
    'Persistent Headache',
    'Skin Itching & Rash',
    'Infant Refusing Feed & Crying'
  ];

  const handleChipClick = (chip: string) => {
    if (symptoms) {
      setSymptoms(prev => `${prev}, ${chip}`);
    } else {
      setSymptoms(chip);
    }
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeSymptomsWithAI(symptoms, duration, severity, ageGroup);
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRecommendedSpecialist = () => {
    if (!analysis) return;
    // Find doctor matching recommendation or default to first
    const match = doctors.find(d => 
      d.specialty.toLowerCase().includes(analysis.recommendedSpecialty.toLowerCase().split(' ')[0])
    ) || doctors[0];
    setSelectedDoctor(match);
    setCurrentPage('consultation');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">{t.symptomChecker}</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              AI-assisted preliminary clinical triage designed for rural and low-connectivity health posts
            </p>
          </div>
        </div>

        {/* Quick Symptom Chips */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Tap common symptoms to add:
          </label>
          <div className="flex flex-wrap gap-2">
            {commonSymptomChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-gray-200"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Describe how the patient feels:
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={t.symptomPlaceholder}
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm sm:text-base text-gray-900 resize-none shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">{t.duration}</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-600"
              >
                <option>Less than 24 hours</option>
                <option>1-3 days</option>
                <option>4-7 days</option>
                <option>More than 1 week</option>
                <option>Over a month</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">{t.severity}</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-600"
              >
                <option>Mild (Manageable at home)</option>
                <option>Moderate (Discomforting)</option>
                <option>Severe (Incapacitating / High Pain)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">{t.ageGroup}</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-blue-600"
              >
                <option>Infant (0-1 year)</option>
                <option>Child (2-12 years)</option>
                <option>Teen (13-19 years)</option>
                <option>Adult (20-59 years)</option>
                <option>Senior (60+ years)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!symptoms.trim() || loading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center space-x-2 text-white shadow-lg transition-all ${
              !symptoms.trim() || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25 active:scale-[0.99]'
            }`}
          >
            <Stethoscope className="h-5 w-5" />
            <span>{loading ? 'Evaluating Symptoms...' : t.analyzeSymptoms}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-lg space-y-6 animate-fadeIn">
          {/* Emergency Alert Banner */}
          {analysis.isEmergency ? (
            <div className="p-5 rounded-2xl bg-red-600 text-white flex items-start space-x-4 shadow-lg animate-pulse">
              <ShieldAlert className="h-8 w-8 text-white shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-black uppercase tracking-wide">
                  {analysis.emergencyAdvice || t.emergencyAlert}
                </h3>
                <p className="text-sm text-red-100 mt-1">
                  Red flag emergency symptoms detected. Please do not wait for virtual consultation. Transport patient to nearest hospital or call 108 immediately.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <HeartPulse className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-black text-gray-900">{t.aiAnalysisResults}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  analysis.riskLevel === 'Emergency'
                    ? 'bg-red-100 text-red-800'
                    : analysis.riskLevel === 'Moderate'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {analysis.riskLevel} Risk Level
              </span>
            </div>
          )}

          {/* Clinical Summary */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
            <p className="text-sm font-semibold text-blue-900 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Suspected Conditions */}
          <div>
            <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wide mb-2">
              Suspected Potential Conditions:
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.suspectedConditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>

          {/* Clinical Action Plan & Home Remedies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wide mb-2 flex items-center">
                <CheckCircle2 className="h-4 w-4 text-blue-600 mr-1.5" />
                Recommended Clinical Next Steps
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wide mb-2 flex items-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-1.5" />
                Rural Home Comfort & First-Aid
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-800">
                {analysis.homeRemedies.map((rem, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-emerald-600 font-bold mr-2">•</span>
                    <span>{rem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Doctor Specialty & Action CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-gray-100">
            <div className="text-xs">
              <span className="text-gray-500 font-medium">Recommended Specialist: </span>
              <span className="font-bold text-blue-700">{analysis.recommendedSpecialty}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBookRecommendedSpecialist}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20"
              >
                <UserCheck className="h-4 w-4" />
                <span>Book This Specialist</span>
              </button>
              <button
                onClick={() => setCurrentPage('pharmacy')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs sm:text-sm font-bold"
              >
                <span>Find Medicines</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 italic text-center">
            Notice: This AI triage is a preliminary assessment intended to support rural health workers and patients. It does not replace full in-person clinical diagnosis by a registered medical practitioner.
          </p>
        </div>
      )}
    </div>
  );
};

