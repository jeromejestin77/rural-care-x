export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  availability: string;
  rating: number;
  reviewsCount: number;
  language: string;
  experienceYears: number;
  consultationFee: string;
  hospital: string;
}

export interface VitalSigns {
  temperature?: string;
  bloodPressure?: string;
  heartRate?: string;
  oxygenLevel?: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  type: 'Consultation' | 'Lab Test' | 'Prescription' | 'Immunization';
  doctor: string;
  diagnosis: string;
  prescription: string;
  notes?: string;
  vitals?: VitalSigns;
  synced: boolean;
  createdAt: number;
}

export interface Medicine {
  id: number;
  name: string;
  genericName: string;
  type: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment';
  pharmacy: string;
  distance: string;
  availability: 'In Stock' | 'Limited Stock' | 'Out of Stock';
  stockCount: number;
  price: string;
  requiresPrescription: boolean;
}

export interface Appointment {
  id: string;
  doctorId: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'Video' | 'Audio' | 'In-Person';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  symptomsSummary?: string;
}

export interface AISymptomAnalysis {
  riskLevel: 'Low' | 'Moderate' | 'Emergency';
  suspectedConditions: string[];
  summary: string;
  recommendations: string[];
  recommendedSpecialty: string;
  homeRemedies: string[];
  isEmergency: boolean;
  emergencyAdvice?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  aadhaar: string;
  email: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  primaryLanguage: LanguageCode;
  secondaryLanguage: LanguageCode;
  notifications: {
    reminders: boolean;
    healthTips: boolean;
    medicineAlerts: boolean;
  };
}

