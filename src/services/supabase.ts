import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-url') &&
  !supabaseAnonKey.includes('your-supabase-key')
);

// Graceful client creation that doesn't crash if env vars are unset
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function syncHealthRecordToCloud(record: any) {
  if (!isSupabaseConfigured || !supabase) {
    // Offline / Local-first simulated sync
    return { success: true, mode: 'local' };
  }

  try {
    const { data, error } = await supabase
      .from('health_records')
      .upsert([record]);
    
    if (error) throw error;
    return { success: true, data, mode: 'cloud' };
  } catch (err) {
    console.warn('Supabase cloud sync failed, keeping local copy:', err);
    return { success: false, error: err, mode: 'local' };
  }
}

export async function syncAppointmentToCloud(appointment: any) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, mode: 'local' };
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .upsert([appointment]);

    if (error) throw error;
    return { success: true, data, mode: 'cloud' };
  } catch (err) {
    console.warn('Supabase cloud appointment sync failed:', err);
    return { success: false, error: err, mode: 'local' };
  }
}

