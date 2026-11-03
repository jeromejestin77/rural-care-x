import { Doctor, HealthRecord, Medicine, UserProfile } from '../types';

export const initialDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "General Medicine & Family Health",
    availability: "Available Now",
    rating: 4.9,
    reviewsCount: 142,
    language: "Hindi, English, Punjabi",
    experienceYears: 12,
    consultationFee: "Free (Govt. PHC Partner)",
    hospital: "District Civil Hospital & Rural Tele-Hub"
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiology & Vascular Health",
    availability: "Next: 2:00 PM",
    rating: 4.8,
    reviewsCount: 98,
    language: "Hindi, English",
    experienceYears: 15,
    consultationFee: "₹100 (Subsidized)",
    hospital: "AIIMS Telehealth Rural Outreach"
  },
  {
    id: 3,
    name: "Dr. Anita Singh",
    specialty: "Pediatrics & Child Care",
    availability: "Next: 4:30 PM",
    rating: 4.9,
    reviewsCount: 184,
    language: "Hindi, Bengali, English",
    experienceYears: 9,
    consultationFee: "Free (Maternal & Child Mission)",
    hospital: "Community Health Center (CHC)"
  },
  {
    id: 4,
    name: "Dr. Mohammed Ali",
    specialty: "Dermatology & Infectious Diseases",
    availability: "Tomorrow 9:00 AM",
    rating: 4.7,
    reviewsCount: 76,
    language: "Hindi, Urdu, English",
    experienceYears: 11,
    consultationFee: "₹50 (Subsidized)",
    hospital: "Regional Health Mission"
  },
  {
    id: 5,
    name: "Dr. Kavita Murugan",
    specialty: "Gynecology & Women's Health",
    availability: "Available Now",
    rating: 4.9,
    reviewsCount: 210,
    language: "Tamil, Telugu, English, Hindi",
    experienceYears: 14,
    consultationFee: "Free (Janani Suraksha Partner)",
    hospital: "Rural Maternal Care Unit"
  }
];

export const initialHealthRecords: HealthRecord[] = [
  {
    id: "rec-101",
    date: "2024-02-18",
    type: "Consultation",
    doctor: "Dr. Priya Sharma",
    diagnosis: "Seasonal Viral Upper Respiratory Infection",
    prescription: "Paracetamol 500mg (1 TDS for 3 days), Cetirizine 10mg (1 HS for 3 days)",
    notes: "Patient reported mild fever and congestion. Vitals stable. Advised steam inhalation & rest.",
    vitals: {
      temperature: "99.2 °F",
      bloodPressure: "120/80 mmHg",
      heartRate: "76 bpm",
      oxygenLevel: "98%"
    },
    synced: true,
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: "rec-102",
    date: "2024-01-20",
    type: "Lab Test",
    doctor: "Dr. Rajesh Kumar",
    diagnosis: "Routine Complete Blood Count (CBC) & Fasting Sugar",
    prescription: "Hb: 13.5 g/dL (Normal), Fasting Glucose: 92 mg/dL (Normal)",
    notes: "No signs of anemia or metabolic issues. Maintain balanced rural diet.",
    vitals: {
      temperature: "98.4 °F",
      bloodPressure: "118/78 mmHg",
      heartRate: "72 bpm",
      oxygenLevel: "99%"
    },
    synced: true,
    createdAt: Date.now() - 86400000 * 30
  },
  {
    id: "rec-103",
    date: "2023-11-12",
    type: "Immunization",
    doctor: "CHC Immunization Officer",
    diagnosis: "Tetanus Toxoid Booster & Flu Vaccine",
    prescription: "Completed booster dose under National Immunization Schedule",
    notes: "Zero post-vaccination adverse events noted. Next tetanus booster due in 5 years.",
    synced: true,
    createdAt: Date.now() - 86400000 * 90
  }
];

export const initialMedicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    type: "Tablet",
    pharmacy: "Pradhan Mantri Jan Aushadhi Kendra - Block A",
    distance: "1.8 km",
    availability: "In Stock",
    stockCount: 150,
    price: "₹12 (Strip of 10)",
    requiresPrescription: false
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    genericName: "Amoxicillin Trihydrate",
    type: "Capsule",
    pharmacy: "Jan Aushadhi Kendra - Station Road",
    distance: "2.4 km",
    availability: "In Stock",
    stockCount: 45,
    price: "₹38 (Strip of 10)",
    requiresPrescription: true
  },
  {
    id: 3,
    name: "Oral Rehydration Salts (ORS)",
    genericName: "WHO Formula Electrolyte Powder",
    type: "Syrup",
    pharmacy: "Primary Health Center Dispensary",
    distance: "0.9 km",
    availability: "In Stock",
    stockCount: 220,
    price: "Free / ₹5",
    requiresPrescription: false
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    genericName: "Omeprazole Gastro-resistant",
    type: "Capsule",
    pharmacy: "Kisan Medical Store",
    distance: "3.1 km",
    availability: "Limited Stock",
    stockCount: 8,
    price: "₹25 (Strip of 10)",
    requiresPrescription: false
  },
  {
    id: 5,
    name: "Metformin 500mg",
    genericName: "Metformin Hydrochloride",
    type: "Tablet",
    pharmacy: "Jan Aushadhi Kendra - Block A",
    distance: "1.8 km",
    availability: "Limited Stock",
    stockCount: 12,
    price: "₹18 (Strip of 10)",
    requiresPrescription: true
  },
  {
    id: 6,
    name: "Iron & Folic Acid Tablets",
    genericName: "Ferrous Ascorbate + Folic Acid",
    type: "Tablet",
    pharmacy: "Anganwadi Health Depot",
    distance: "0.5 km",
    availability: "In Stock",
    stockCount: 300,
    price: "Free (Govt. Anemia Mukt)",
    requiresPrescription: false
  },
  {
    id: 7,
    name: "Azithromycin 500mg",
    genericName: "Azithromycin",
    type: "Tablet",
    pharmacy: "Apollo Rural Pharmacy Outreach",
    distance: "4.8 km",
    availability: "Out of Stock",
    stockCount: 0,
    price: "₹70 (Strip of 3)",
    requiresPrescription: true
  }
];

export const initialUserProfile: UserProfile = {
  name: "Rameshwar Patel",
  phone: "+91 98765 43210",
  aadhaar: "XXXX-XXXX-4892",
  email: "rameshwar.patel@ruralhealth.org",
  dob: "1982-05-14",
  gender: "Male",
  bloodGroup: "B+",
  primaryLanguage: "hi",
  secondaryLanguage: "en",
  notifications: {
    reminders: true,
    healthTips: true,
    medicineAlerts: true
  }
};

