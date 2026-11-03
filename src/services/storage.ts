import { Appointment, HealthRecord, Medicine, UserProfile } from '../types';
import { initialHealthRecords, initialMedicines, initialUserProfile } from '../data/mockData';

const KEYS = {
  USER: 'rcx_user_profile',
  RECORDS: 'rcx_health_records',
  MEDICINES: 'rcx_medicines',
  APPOINTMENTS: 'rcx_appointments',
  PENDING_SYNC: 'rcx_pending_sync_queue',
  AUTH_TOKEN: 'rcx_auth_session'
};

export const storage = {
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(profile));
  },

  getHealthRecords(): HealthRecord[] {
    try {
      const data = localStorage.getItem(KEYS.RECORDS);
      return data ? JSON.parse(data) : initialHealthRecords;
    } catch {
      return initialHealthRecords;
    }
  },

  saveHealthRecords(records: HealthRecord[]): void {
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
  },

  addHealthRecord(record: HealthRecord): void {
    const records = this.getHealthRecords();
    const updated = [record, ...records];
    this.saveHealthRecords(updated);
  },

  getMedicines(): Medicine[] {
    try {
      const data = localStorage.getItem(KEYS.MEDICINES);
      return data ? JSON.parse(data) : initialMedicines;
    } catch {
      return initialMedicines;
    }
  },

  saveMedicines(medicines: Medicine[]): void {
    localStorage.setItem(KEYS.MEDICINES, JSON.stringify(medicines));
  },

  getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : [
        {
          id: 'apt-1',
          doctorId: 1,
          doctorName: 'Dr. Priya Sharma',
          specialty: 'General Medicine & Family Health',
          date: new Date().toISOString().split('T')[0],
          time: '2:30 PM',
          type: 'Video',
          status: 'Scheduled',
          symptomsSummary: 'Seasonal fever & cough'
        }
      ];
    } catch {
      return [];
    }
  },

  saveAppointments(appointments: Appointment[]): void {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
  },

  addAppointment(appointment: Appointment): void {
    const list = this.getAppointments();
    this.saveAppointments([appointment, ...list]);
  },

  getPendingSyncQueue(): Array<{ id: string; type: 'record' | 'appointment'; payload: any }> {
    try {
      const data = localStorage.getItem(KEYS.PENDING_SYNC);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  enqueuePendingSync(item: { id: string; type: 'record' | 'appointment'; payload: any }): void {
    const queue = this.getPendingSyncQueue();
    queue.push(item);
    localStorage.setItem(KEYS.PENDING_SYNC, JSON.stringify(queue));
  },

  clearPendingSyncQueue(): void {
    localStorage.removeItem(KEYS.PENDING_SYNC);
  },

  isLoggedIn(): boolean {
    return localStorage.getItem(KEYS.AUTH_TOKEN) === 'true';
  },

  setLoggedIn(status: boolean): void {
    if (status) {
      localStorage.setItem(KEYS.AUTH_TOKEN, 'true');
    } else {
      localStorage.removeItem(KEYS.AUTH_TOKEN);
    }
  }
};

