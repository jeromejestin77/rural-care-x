import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, Doctor, HealthRecord, LanguageCode, Medicine, UserProfile } from '../types';
import { initialDoctors } from '../data/mockData';
import { storage } from '../services/storage';
import { translations, Translations } from '../services/i18n';
import { syncAppointmentToCloud, syncHealthRecordToCloud } from '../services/supabase';

interface AppContextType {
  user: UserProfile;
  updateUser: (profile: UserProfile) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  isLoggedIn: boolean;
  login: (identifier: string) => void;
  logout: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  healthRecords: HealthRecord[];
  addHealthRecord: (record: Omit<HealthRecord, 'id' | 'createdAt' | 'synced'>) => void;
  medicines: Medicine[];
  reserveMedicine: (id: number) => boolean;
  appointments: Appointment[];
  bookAppointment: (doctorId: number, date: string, time: string, type: 'Video' | 'Audio') => Appointment;
  pendingSyncCount: number;
  syncAllData: () => Promise<void>;
  isSyncing: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => storage.getUserProfile());
  const [language, setLanguageState] = useState<LanguageCode>(() => user.primaryLanguage || 'en');
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => storage.isLoggedIn());
  const [currentPage, setCurrentPage] = useState<string>(() => storage.isLoggedIn() ? 'dashboard' : 'login');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => storage.getHealthRecords());
  const [medicines, setMedicines] = useState<Medicine[]>(() => storage.getMedicines());
  const [appointments, setAppointments] = useState<Appointment[]>(() => storage.getAppointments());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => storage.getPendingSyncQueue().length);
  const [isSyncing, setIsSyncing] = useState(false);

  // Auto-listen to window online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto sync when coming back online
      syncAllData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    const updated = { ...user, primaryLanguage: lang };
    setUser(updated);
    storage.saveUserProfile(updated);
  };

  const updateUser = (updated: UserProfile) => {
    setUser(updated);
    storage.saveUserProfile(updated);
  };

  const login = (identifier: string) => {
    storage.setLoggedIn(true);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
    if (identifier) {
      const updated = { ...user, phone: identifier };
      updateUser(updated);
    }
  };

  const logout = () => {
    storage.setLoggedIn(false);
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const addHealthRecord = (newRecordData: Omit<HealthRecord, 'id' | 'createdAt' | 'synced'>) => {
    const newRecord: HealthRecord = {
      ...newRecordData,
      id: `rec-${Date.now()}`,
      createdAt: Date.now(),
      synced: isOnline
    };

    const updated = [newRecord, ...healthRecords];
    setHealthRecords(updated);
    storage.saveHealthRecords(updated);

    if (!isOnline) {
      storage.enqueuePendingSync({ id: newRecord.id, type: 'record', payload: newRecord });
      setPendingSyncCount(storage.getPendingSyncQueue().length);
    } else {
      syncHealthRecordToCloud(newRecord);
    }
  };

  const reserveMedicine = (id: number): boolean => {
    let success = false;
    const updated = medicines.map(med => {
      if (med.id === id && med.stockCount > 0) {
        success = true;
        const newCount = med.stockCount - 1;
        return {
          ...med,
          stockCount: newCount,
          availability: newCount === 0 ? ('Out of Stock' as const) : newCount <= 5 ? ('Limited Stock' as const) : ('In Stock' as const)
        };
      }
      return med;
    });

    if (success) {
      setMedicines(updated);
      storage.saveMedicines(updated);
    }
    return success;
  };

  const bookAppointment = (doctorId: number, date: string, time: string, type: 'Video' | 'Audio'): Appointment => {
    const doc = doctors.find(d => d.id === doctorId) || doctors[0];
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: doc.id,
      doctorName: doc.name,
      specialty: doc.specialty,
      date,
      time,
      type,
      status: 'Scheduled'
    };

    const updated = [newApt, ...appointments];
    setAppointments(updated);
    storage.saveAppointments(updated);

    if (!isOnline) {
      storage.enqueuePendingSync({ id: newApt.id, type: 'appointment', payload: newApt });
      setPendingSyncCount(storage.getPendingSyncQueue().length);
    } else {
      syncAppointmentToCloud(newApt);
    }

    return newApt;
  };

  const syncAllData = async () => {
    setIsSyncing(true);
    const queue = storage.getPendingSyncQueue();

    try {
      for (const item of queue) {
        if (item.type === 'record') {
          await syncHealthRecordToCloud(item.payload);
        } else if (item.type === 'appointment') {
          await syncAppointmentToCloud(item.payload);
        }
      }

      // Mark all health records as synced
      const syncedRecords = healthRecords.map(r => ({ ...r, synced: true }));
      setHealthRecords(syncedRecords);
      storage.saveHealthRecords(syncedRecords);
      storage.clearPendingSyncQueue();
      setPendingSyncCount(0);
    } finally {
      setIsSyncing(false);
    }
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        language,
        setLanguage,
        t,
        isOnline,
        setIsOnline,
        isLoggedIn,
        login,
        logout,
        currentPage,
        setCurrentPage,
        sidebarOpen,
        setSidebarOpen,
        doctors,
        selectedDoctor,
        setSelectedDoctor,
        healthRecords,
        addHealthRecord,
        medicines,
        reserveMedicine,
        appointments,
        bookAppointment,
        pendingSyncCount,
        syncAllData,
        isSyncing
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

