/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try {
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

// We only initialize if we have the credentials AND the URL is valid to avoid crashing on load
export const supabase = (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder');

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.warn('Supabase credentials are missing or invalid. Please add a valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables in the Secrets panel.');
}

export type UserRole = 'admin' | 'guru' | 'staff';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  class: string;
  created_at: string;
}

export interface EmployeeAttendance {
  id: string;
  profile_id: string;
  date: string;
  time: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alpa';
  notes?: string;
  profiles?: Profile;
}

export interface StudentAttendance {
  id: string;
  student_id: string;
  teacher_id: string;
  date: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alpa';
  class: string;
  students?: Student;
  profiles?: Profile;
}
