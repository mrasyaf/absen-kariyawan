import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import AbsensiKaryawan from './pages/AbsensiKaryawan';
import AbsensiSiswa from './pages/AbsensiSiswa';
import RekapAbsensiKaryawan from './pages/RekapAbsensiKaryawan';
import RekapAbsensiSiswa from './pages/RekapAbsensiSiswa';
import DataSiswa from './pages/DataSiswa';
import UserManagement from './pages/UserManagement';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && profile && !roles.includes(profile.role)) {
    return <Navigate to="/app" />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export default function App() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isValidUrl = supabaseUrl?.startsWith('http://') || supabaseUrl?.startsWith('https://');
  const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey && isValidUrl;

  return (
    <AuthProvider>
      {!isSupabaseConfigured && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white p-2 text-center text-sm font-bold">
          ⚠️ Supabase belum dikonfigurasi dengan benar. Silakan tambahkan VITE_SUPABASE_URL (harus diawali http/https) dan VITE_SUPABASE_ANON_KEY di panel Secrets.
        </div>
      )}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* App Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/app/absensi-karyawan" element={
            <ProtectedRoute>
              <AbsensiKaryawan />
            </ProtectedRoute>
          } />
          
          <Route path="/app/absensi-siswa" element={
            <ProtectedRoute roles={['admin', 'guru']}>
              <AbsensiSiswa />
            </ProtectedRoute>
          } />
          
          <Route path="/app/rekap/karyawan" element={
            <ProtectedRoute roles={['admin']}>
              <RekapAbsensiKaryawan />
            </ProtectedRoute>
          } />
          
          <Route path="/app/rekap/siswa" element={
            <ProtectedRoute roles={['admin', 'guru']}>
              <RekapAbsensiSiswa />
            </ProtectedRoute>
          } />
          
          <Route path="/app/data-siswa" element={
            <ProtectedRoute roles={['admin']}>
              <DataSiswa />
            </ProtectedRoute>
          } />
          
          <Route path="/app/users" element={
            <ProtectedRoute roles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
