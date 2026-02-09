import React, { useState } from 'react';
import { Heart, Home, Stethoscope, Calendar, FileText, Pill, Settings, User, Wifi, WifiOff, Menu, X } from 'lucide-react';

// Types
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  availability: string;
  rating: number;
  language: string;
}

interface HealthRecord {
  id: number;
  date: string;
  type: string;
  doctor: string;
  diagnosis: string;
  prescription: string;
}

interface Medicine {
  id: number;
  name: string;
  type: string;
  pharmacy: string;
  distance: string;
  availability: string;
  price: string;
}

// Mock Data
const doctors: Doctor[] = [
  { id: 1, name: "Dr. Priya Sharma", specialty: "General Medicine", availability: "Available Now", rating: 4.8, language: "Hindi, English" },
  { id: 2, name: "Dr. Rajesh Kumar", specialty: "Cardiology", availability: "Next: 2:00 PM", rating: 4.9, language: "Hindi, English" },
  { id: 3, name: "Dr. Anita Singh", specialty: "Pediatrics", availability: "Next: 4:30 PM", rating: 4.7, language: "Hindi, English" },
  { id: 4, name: "Dr. Mohammed Ali", specialty: "Dermatology", availability: "Tomorrow 9:00 AM", rating: 4.6, language: "Hindi, Urdu, English" }
];

const healthRecords: HealthRecord[] = [
  { id: 1, date: "2024-01-15", type: "Consultation", doctor: "Dr. Priya Sharma", diagnosis: "Hypertension", prescription: "Amlodipine 5mg daily" },
  { id: 2, date: "2024-01-08", type: "Lab Test", doctor: "Lab Technician", diagnosis: "Blood Test", prescription: "Normal values" },
  { id: 3, date: "2024-01-01", type: "Consultation", doctor: "Dr. Rajesh Kumar", diagnosis: "Regular Checkup", prescription: "Continue current medication" }
];

const medicines: Medicine[] = [
  { id: 1, name: "Paracetamol 500mg", type: "Tablet", pharmacy: "Jan Aushadhi Kendra", distance: "2.3 km", availability: "In Stock", price: "₹20" },
  { id: 2, name: "Amoxicillin 250mg", type: "Capsule", pharmacy: "Apollo Pharmacy", distance: "5.1 km", availability: "In Stock", price: "₹45" },
  { id: 3, name: "Omeprazole 20mg", type: "Tablet", pharmacy: "Local Medical Store", distance: "1.8 km", availability: "Limited Stock", price: "₹35" },
  { id: 4, name: "Metformin 500mg", type: "Tablet", pharmacy: "Jan Aushadhi Kendra", distance: "2.3 km", availability: "Out of Stock", price: "₹25" }
];

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const symptomSuggestions = [
    "Based on your symptoms (fever, headache, body ache), you might have:",
    "• Viral fever - Rest and hydration recommended",
    "• Common cold - Take paracetamol for symptom relief",
    "• Flu - Monitor temperature, consult doctor if symptoms worsen",
    "",
    "⚠️ This is AI-generated advice. Please consult a qualified doctor for proper diagnosis."
  ];

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 bg-blue-600">
        <div className="flex items-center">
          <Heart className="h-8 w-8 text-white mr-2" />
          <h1 className="text-xl font-bold text-white">RuralCareX</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          <NavItem icon={Home} label="Dashboard" page="dashboard" />
          <NavItem icon={Stethoscope} label="Symptom Checker" page="symptoms" />
          <NavItem icon={Calendar} label="Book Consultation" page="consultation" />
          <NavItem icon={FileText} label="Health Records" page="records" />
          <NavItem icon={Pill} label="Pharmacy Stock" page="pharmacy" />
          <NavItem icon={Settings} label="Settings" page="settings" />
        </div>
      </nav>
    </div>
  );

  const NavItem = ({ icon: Icon, label, page }: { icon: any, label: string, page: string }) => (
    <button
      onClick={() => {
        setCurrentPage(page);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
        currentPage === page 
          ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </button>
  );

  // Login Page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">RuralCareX</h1>
              <p className="text-gray-600 text-lg">Bringing Healthcare to Your Doorstep</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number / Mobile Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter your Aadhaar or mobile number"
                />
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Send OTP
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Secure • Private • Trusted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main App Layout
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {currentPage === 'dashboard' && 'Dashboard'}
                  {currentPage === 'symptoms' && 'Symptom Checker'}
                  {currentPage === 'consultation' && 'Book Consultation'}
                  {currentPage === 'video' && 'Video Consultation'}
                  {currentPage === 'records' && 'Health Records'}
                  {currentPage === 'pharmacy' && 'Pharmacy Stock'}
                  {currentPage === 'settings' && 'Settings'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  isOnline ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {isOnline ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
                  {isOnline ? 'Online Mode' : 'Offline Mode Available'}
                </div>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <User className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'symptoms' && <SymptomChecker />}
            {currentPage === 'consultation' && <BookConsultation />}
            {currentPage === 'video' && <VideoConsultation />}
            {currentPage === 'records' && <HealthRecords />}
            {currentPage === 'pharmacy' && <PharmacyStock />}
            {currentPage === 'settings' && <Settings />}
          </div>
        </main>
      </div>
    </div>
  );

  // Dashboard Component
  function Dashboard() {
    const quickAccessCards = [
      { icon: Stethoscope, title: 'Symptom Checker', description: 'Get AI-powered health insights', page: 'symptoms', color: 'blue' },
      { icon: Calendar, title: 'Book Consultation', description: 'Connect with doctors instantly', page: 'consultation', color: 'green' },
      { icon: FileText, title: 'Health Records', description: 'Access your medical history', page: 'records', color: 'purple' },
      { icon: Pill, title: 'Pharmacy Stock', description: 'Find medicines near you', page: 'pharmacy', color: 'orange' }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-blue-100 text-lg">Your health is our priority. Access quality healthcare from anywhere.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickAccessCards.map((card, index) => (
            <div
              key={index}
              onClick={() => setCurrentPage(card.page)}
              className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 ${
                card.color === 'blue' ? 'border-blue-600 hover:bg-blue-50' :
                card.color === 'green' ? 'border-green-600 hover:bg-green-50' :
                card.color === 'purple' ? 'border-purple-600 hover:bg-purple-50' :
                'border-orange-600 hover:bg-orange-50'
              }`}
            >
              <card.icon className={`h-8 w-8 mb-4 ${
                card.color === 'blue' ? 'text-blue-600' :
                card.color === 'green' ? 'text-green-600' :
                card.color === 'purple' ? 'text-purple-600' :
                'text-orange-600'
              }`} />
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Consultation booked</p>
                  <p className="text-sm text-gray-600">Dr. Priya Sharma - Today 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FileText className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Health record updated</p>
                  <p className="text-sm text-gray-600">Blood test results added</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Tips</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-green-800">💧 Stay hydrated</p>
                <p className="text-sm text-green-600">Drink at least 8 glasses of water daily</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">🚶 Daily exercise</p>
                <p className="text-sm text-blue-600">30 minutes of walking can improve your health</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Symptom Checker Component
  function SymptomChecker() {
    const [showSuggestions, setShowSuggestions] = useState(false);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Symptom Checker</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your symptoms in detail
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 text-lg"
                placeholder="E.g., I have been experiencing fever for 2 days, headache, and body ache..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg">
                  <option>Select duration</option>
                  <option>Less than 24 hours</option>
                  <option>1-3 days</option>
                  <option>1 week</option>
                  <option>More than 1 week</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg">
                  <option>Select severity</option>
                  <option>Mild</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg">
                  <option>Select age group</option>
                  <option>Child (0-12)</option>
                  <option>Teen (13-19)</option>
                  <option>Adult (20-59)</option>
                  <option>Senior (60+)</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowSuggestions(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Analyze Symptoms
            </button>
          </div>
        </div>

        {showSuggestions && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Analysis Results</h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              {symptomSuggestions.map((suggestion, index) => (
                <p key={index} className={`${index === 0 ? 'font-semibold text-blue-900' : 'text-blue-800'} text-lg`}>
                  {suggestion}
                </p>
              ))}
            </div>
            
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => setCurrentPage('consultation')}
                className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Book Consultation
              </button>
              <button
                onClick={() => setCurrentPage('pharmacy')}
                className="bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Find Medicines
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Book Consultation Component
  function BookConsultation() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Doctors</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                    <p className="text-gray-600">Languages: {doctor.language}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-gray-900 font-medium ml-1">{doctor.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.availability === 'Available Now' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doctor.availability}
                  </span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setCurrentPage('video');
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Book Consultation
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Video Consultation Component
  function VideoConsultation() {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Video Consultation with {selectedDoctor?.name || 'Doctor'}
              </h2>
              <p className="text-gray-600">{selectedDoctor?.specialty || 'Specialist'}</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                End Call
              </button>
            </div>
          </div>
          
          {/* Video Call Interface */}
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-6">
            <div className="text-center">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-white text-xl font-semibold">Video Call in Progress</p>
              <p className="text-gray-300">Connecting to {selectedDoctor?.name || 'Doctor'}...</p>
            </div>
          </div>
          
          {/* Call Controls */}
          <div className="flex justify-center space-x-4">
            <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <span className="sr-only">Mute</span>
              🎤
            </button>
            <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <span className="sr-only">Video</span>
              📹
            </button>
            <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <span className="sr-only">Chat</span>
              💬
            </button>
          </div>
        </div>
        
        {/* Consultation Notes */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Notes</h3>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
            placeholder="Doctor's notes and recommendations will appear here..."
          />
        </div>
      </div>
    );
  }

  // Health Records Component
  function HealthRecords() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Health Records</h2>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Sync Records
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Download PDF
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Doctor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Diagnosis</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Prescription</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {healthRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900">{record.date}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        record.type === 'Consultation' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-900">{record.doctor}</td>
                    <td className="py-4 px-4 text-gray-900">{record.diagnosis}</td>
                    <td className="py-4 px-4 text-gray-900">{record.prescription}</td>
                    <td className="py-4 px-4">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Pharmacy Stock Component
  function PharmacyStock() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pharmacy Stock</h2>
            <div className="flex space-x-3">
              <input
                type="text"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search medicines..."
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {medicines.map((medicine) => (
              <div key={medicine.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                    <p className="text-gray-600">{medicine.type}</p>
                    <p className="text-blue-600 font-medium">{medicine.pharmacy}</p>
                    <p className="text-gray-600">{medicine.distance} away</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{medicine.price}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    medicine.availability === 'In Stock' 
                      ? 'bg-green-100 text-green-800' 
                      : medicine.availability === 'Limited Stock'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {medicine.availability}
                  </span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    disabled={medicine.availability === 'Out of Stock'}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      medicine.availability === 'Out of Stock'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {medicine.availability === 'Out of Stock' ? 'Not Available' : 'Reserve'}
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Settings Component
  function Settings() {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
          
          <div className="space-y-8">
            {/* Profile Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Language</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="en">English</option>
                    <option value="hi" selected>हिंदी (Hindi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Language</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="en" selected>English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Consultation Reminders</p>
                    <p className="text-sm text-gray-600">Get notified about upcoming appointments</p>
                  </div>
                  <input type="checkbox" className="h-5 w-5 text-blue-600" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Health Tips</p>
                    <p className="text-sm text-gray-600">Receive daily health and wellness tips</p>
                  </div>
                  <input type="checkbox" className="h-5 w-5 text-blue-600" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Medicine Availability</p>
                    <p className="text-sm text-gray-600">Get alerts when medicines are back in stock</p>
                  </div>
                  <input type="checkbox" className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Save Changes
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;