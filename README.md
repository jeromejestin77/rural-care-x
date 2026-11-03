# 🏥 Rural Care X (रूरल केयर एक्स)

Rural Care X is a technology-driven healthcare and telemedicine platform engineered to solve **medical accessibility in rural and underserved areas**. The platform bridges the gap between rural communities and quality medical practitioners using **AI-powered clinical triage, real-time video consultations, electronic health records (EMR), regional multi-language localization, and low-bandwidth offline-first resilience**.

---

## 🚀 Key Solved Gaps & Capabilities

| Capability | Implementation |
| :--- | :--- |
| **🤖 AI Symptom Analysis** | Multi-variable clinical triage engine assessing duration, severity, age group, red-flag emergency detection, home remedies, and recommended specialist routing. |
| **📹 Video Telemedicine** | Interactive consultation suite with real camera/mic integration (`getUserMedia`), call timer, live chat, clinical observation notepad, and digital prescription generator. |
| **🌐 Regional Multi-Language (i18n)** | Instant translation switching across **English**, **Hindi (हिंदी)**, **Tamil (தமிழ்)**, **Telugu (తెలుగు)**, **Bengali (বাংলা)**, and **Marathi (मराठी)**. |
| **☁️ Backend & Cloud Sync** | Dual-mode architecture: connects to **Supabase** for cloud storage, with automatic fallback to **Offline-First LocalStorage** and sync queue. |
| **📶 Low-Bandwidth & Offline Mode** | Full offline functionality when cellular connection drops. Changes are queued locally and automatically synced once connectivity returns. |
| **📁 E-Prescription & PDF Export** | Printable digital medical health cards compliant with National Health Mission standards with one-click print or formatted text export. |
| **💊 Jan Aushadhi Stock Tracker** | Real-time stock availability, distance indicators, and online medicine reservation system. |
| **🔐 ABHA / Mobile OTP Authentication** | 2-step OTP verification flow tailored for rural users. |

---

## 🏗️ Architecture & Project Structure

```
rural-care-x/
├── public/
│   └── manifest.json             # PWA Web App Manifest
├── src/
│   ├── components/
│   │   ├── Header.tsx            # Header with language switcher, sync & online/offline toggles
│   │   ├── Sidebar.tsx           # Responsive drawer navigation & offline status
│   │   └── PDFModal.tsx          # Formatted Medical Card & Prescription PDF generator
│   ├── context/
│   │   └── AppContext.tsx        # Global state (user, language, records, medicines, sync queue)
│   ├── data/
│   │   └── mockData.ts           # Initial rural doctors, medicines, and records
│   ├── pages/
│   │   ├── LoginPage.tsx         # Aadhaar/Mobile OTP 2-step authentication
│   │   ├── DashboardPage.tsx     # Quick access, upcoming consultations, SOS 108 button
│   │   ├── SymptomCheckerPage.tsx# AI clinical triage engine & emergency detection
│   │   ├── ConsultationPage.tsx  # Doctor directory, language filters, and appointment scheduler
│   │   ├── VideoConsultationPage.tsx # Camera/audio tele-call with live prescription writing
│   │   ├── HealthRecordsPage.tsx # Filterable EMR table with vitals and "+ Add Record" modal
│   │   ├── PharmacyStockPage.tsx # Jan Aushadhi search, distance calculator & reservation
│   │   └── SettingsPage.tsx      # Patient profile, language selector, and cloud sync status
│   ├── services/
│   │   ├── aiDiagnosis.ts        # AI triage rules, emergency detection, home comfort advice
│   │   ├── i18n.ts               # Translation dictionaries for 6 Indian languages
│   │   ├── storage.ts            # Local storage & offline sync queue management
│   │   └── supabase.ts           # Supabase client integration & cloud sync hooks
│   ├── types/
│   │   └── index.ts              # Domain interfaces (Doctor, HealthRecord, Medicine, UserProfile)
│   ├── App.tsx                   # Modular root component
│   ├── index.css                 # Tailwind CSS & print media stylesheets
│   └── main.tsx                  # React DOM createRoot entry
├── .env.example                  # Environment configuration template
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite 7
- **Cloud Backend**: Supabase (`@supabase/supabase-js`)
- **Offline Storage**: LocalStorage + Offline Sync Queue + PWA Manifest
- **Media**: HTML5 WebRTC (`navigator.mediaDevices.getUserMedia`)

---

## ⚡ Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 2. Installation
```bash
git clone https://github.com/jeromejestin/rural-care-x.git
cd rural-care-x
npm install
```

### 3. Environment Setup (Optional)
Copy `.env.example` to `.env` to configure your Supabase cloud backend or Gemini API:
```bash
cp .env.example .env
```
*(Note: If no `.env` is configured, Rural Care X runs in **Offline-First Mode** with complete persistence).*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📜 License

This project is licensed under the MIT License.

## 👤 Author

**Jerome Jestin A**
