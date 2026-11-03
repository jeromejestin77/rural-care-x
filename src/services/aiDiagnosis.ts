import { AISymptomAnalysis } from '../types';

interface SymptomRule {
  keywords: string[];
  conditions: string[];
  specialty: string;
  defaultSeverity: 'Low' | 'Moderate' | 'Emergency';
  remedies: string[];
  recommendations: string[];
  emergencyTriggers?: string[];
}

const KNOWLEDGE_BASE: SymptomRule[] = [
  {
    keywords: ['chest pain', 'heart', 'radiating pain', 'left arm pain', 'sweating', 'shortness of breath'],
    conditions: ['Acute Coronary Syndrome (Suspected Angina / Cardiac Event)', 'Severe Hypertension Crisis'],
    specialty: 'Cardiology & Emergency Medicine',
    defaultSeverity: 'Emergency',
    emergencyTriggers: ['chest', 'heart', 'arm pain', 'pressure'],
    remedies: ['Do not exert physical effort', 'Sit upright in a comfortable position with support'],
    recommendations: [
      'Call emergency ambulance (108) immediately or rush to the nearest emergency room',
      'Do not attempt to drive yourself',
      'Keep your medical history and prescription card ready'
    ]
  },
  {
    keywords: ['fever', 'chills', 'high temperature', 'body ache', 'weakness'],
    conditions: ['Acute Viral Syndrome', 'Vector-Borne Infection (Malaria/Dengue/Chikungunya)', 'Typhoid Fever'],
    specialty: 'General Medicine & Family Health',
    defaultSeverity: 'Moderate',
    remedies: [
      'Cold water sponge compresses on forehead',
      'Adequate hydration with clean boiled water or ORS',
      'Light digestive diet (Khichdi, warm soups, tender coconut water)'
    ],
    recommendations: [
      'Monitor body temperature every 4 hours with a thermometer',
      'Take prescribed antipyretic (Paracetamol) if temperature exceeds 100°F',
      'If fever persists beyond 3 days or rash/bleeding occurs, get blood test (CBC & Malarial Parasite)'
    ]
  },
  {
    keywords: ['cough', 'cold', 'sore throat', 'runny nose', 'sneezing', 'congestion'],
    conditions: ['Upper Respiratory Tract Infection (Common Cold)', 'Allergic Rhinitis', 'Pharyngitis'],
    specialty: 'General Medicine',
    defaultSeverity: 'Low',
    remedies: [
      'Steam inhalation with warm water 2-3 times daily',
      'Warm saline water gargling twice a day',
      'Warm water with tulsi and honey for throat soothing'
    ],
    recommendations: [
      'Avoid cold drinks, ice, and exposure to early morning chills',
      'Wear a mask to prevent household transmission to elders and children',
      'Consult doctor if breathing becomes labored or cough lasts > 2 weeks'
    ]
  },
  {
    keywords: ['diarrhea', 'vomiting', 'loose motion', 'stomach pain', 'cramps', 'nausea'],
    conditions: ['Acute Gastroenteritis', 'Food/Water-borne Infection', 'Dehydration Episode'],
    specialty: 'General Medicine & Pediatric Health',
    defaultSeverity: 'Moderate',
    remedies: [
      'Immediate Oral Rehydration Salt (ORS) solution after every loose stool',
      'Rice water (Ganji / Kanji) with a pinch of salt',
      'Avoid raw vegetables, milk, and spicy food until digestion recovers'
    ],
    recommendations: [
      'Check for dehydration signs: dry mouth, sunken eyes, low urine output',
      'Do not consume street food or untreated well water',
      'Visit Primary Health Center (PHC) if vomiting prevents taking liquids'
    ]
  },
  {
    keywords: ['skin', 'rash', 'itching', 'allergy', 'redness', 'boils', 'fungal'],
    conditions: ['Contact Dermatitis', 'Superficial Tinea / Fungal Infection', 'Allergic Urticaria'],
    specialty: 'Dermatology & Infectious Diseases',
    defaultSeverity: 'Low',
    remedies: [
      'Keep the affected area clean and dry',
      'Wear loose-fitting, clean cotton clothing',
      'Avoid sharing towels, bedsheets, or soap'
    ],
    recommendations: [
      'Do not apply unverified steroid ointments or acid burns',
      'Wash with antiseptic or mild soap',
      'Consult a dermatologist for targeted topical therapy'
    ]
  },
  {
    keywords: ['child', 'baby', 'infant', 'crying', 'refusing feed', 'vaccination fever'],
    conditions: ['Pediatric Febrile Episode', 'Teething Irritation', 'Mild Pediatric Colic'],
    specialty: 'Pediatrics & Child Care',
    defaultSeverity: 'Moderate',
    remedies: [
      'Continue breastfeeding or frequent small feeds',
      'Ensure comfortable, airy cotton clothing',
      'Gentle rocking and burping after feed'
    ],
    recommendations: [
      'Never give adult medicines or aspirin to infants',
      'Consult a pediatrician promptly if child refuses fluids or is unusually drowsy',
      'Keep immunization card updated'
    ]
  },
  {
    keywords: ['headache', 'migraine', 'dizziness', 'vertigo', 'blur'],
    conditions: ['Tension Headache', 'Ocular Strain / Uncorrected Refractive Error', 'Dehydration / Migraine'],
    specialty: 'General Medicine & Neurology',
    defaultSeverity: 'Low',
    remedies: [
      'Rest in a dark, quiet and well-ventilated room',
      'Stay hydrated with at least 2 liters of water daily',
      'Gentle temple massage and neck stretching'
    ],
    recommendations: [
      'Check blood pressure at the local dispensary',
      'Have vision tested at nearest primary eye care clinic',
      'Consult a physician if accompanied by speech trouble or sudden weakness'
    ]
  }
];

export async function analyzeSymptomsWithAI(
  symptomText: string,
  duration: string,
  severity: string,
  ageGroup: string
): Promise<AISymptomAnalysis> {
  const text = symptomText.toLowerCase();

  // 1. Emergency Red Flag Detection
  const emergencyKeywords = [
    'chest pain', 'unconscious', 'severe bleeding', 'paralysis', 'cannot breathe',
    'choking', 'convulsion', 'seizure', 'severe burn', 'snake bite', 'poison'
  ];
  
  const hasEmergencyKeywords = emergencyKeywords.some(keyword => text.includes(keyword));
  const isSevere = severity.toLowerCase() === 'severe';

  if (hasEmergencyKeywords || (isSevere && (text.includes('heart') || text.includes('chest') || text.includes('breath')))) {
    return {
      riskLevel: 'Emergency',
      suspectedConditions: ['Potential Medical Emergency / Critical Condition'],
      summary: `Critical symptoms detected (${symptomText}). This requires urgent medical attention without delay.`,
      recommendations: [
        'Call emergency ambulance services (108 in India) immediately',
        'Keep patient calm, airway clear, and avoid physical exertion',
        'Proceed immediately to the nearest Community Health Center (CHC) or Emergency Hospital'
      ],
      recommendedSpecialty: 'Emergency Medicine / Critical Care',
      homeRemedies: ['Do not administer oral pills if patient is drowsy or choking', 'Ensure fresh air circulation'],
      isEmergency: true,
      emergencyAdvice: '⚠️ EMERGENCY ALERT: Call 108 or reach the nearest Emergency Room immediately!'
    };
  }

  // 2. Rule matching
  const matchedRules: SymptomRule[] = [];
  for (const rule of KNOWLEDGE_BASE) {
    if (rule.keywords.some(k => text.includes(k))) {
      matchedRules.push(rule);
    }
  }

  if (matchedRules.length > 0) {
    const primaryRule = matchedRules[0];
    const riskLevel: 'Low' | 'Moderate' | 'Emergency' =
      isSevere ? 'Moderate' : primaryRule.defaultSeverity;

    const allConditions = Array.from(new Set(matchedRules.flatMap(r => r.conditions)));
    const allRemedies = Array.from(new Set(matchedRules.flatMap(r => r.remedies)));
    const allRecommendations = Array.from(new Set(matchedRules.flatMap(r => r.recommendations)));

    return {
      riskLevel,
      suspectedConditions: allConditions,
      summary: `Based on reported symptoms lasting "${duration}" with ${severity.toLowerCase()} severity in age group ${ageGroup}: signs are consistent with ${allConditions[0]}.`,
      recommendations: allRecommendations.slice(0, 4),
      recommendedSpecialty: primaryRule.specialty,
      homeRemedies: allRemedies.slice(0, 4),
      isEmergency: false
    };
  }

  // 3. Fallback for unclassified general symptoms
  const calculatedRisk: 'Low' | 'Moderate' = isSevere ? 'Moderate' : 'Low';
  return {
    riskLevel: calculatedRisk,
    suspectedConditions: [
      'Nonspecific Mild Clinical Malaise',
      'General Fatigue / Seasonal Adaptation',
      'Mild Gastro-Digestive or Musculoskeletal Strain'
    ],
    summary: `Your reported symptoms ("${symptomText}") appear to be ${calculatedRisk.toLowerCase()} severity for duration "${duration}".`,
    recommendations: [
      'Maintain adequate fluid intake and consume fresh, warm, easily digestible food',
      'Observe symptoms over the next 24 to 48 hours',
      'Book a virtual consultation with a General Physician for clinical confirmation'
    ],
    recommendedSpecialty: 'General Medicine & Family Health',
    homeRemedies: [
      'Rest for 7-8 hours in a quiet environment',
      'Drink boiled water and avoid outside or unhygienic food',
      'Warm ginger or herbal decoction (Kadha) for comfort'
    ],
    isEmergency: false
  };
}

