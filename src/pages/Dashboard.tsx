import React, { useEffect, useState } from 'react';
import { supabase, type Profile, type Student, type EmployeeAttendance, type StudentAttendance } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEmployees: 0,
    todayAttendance: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [students, profiles, attendance] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('employee_attendance')
          .select('*', { count: 'exact', head: true })
          .eq('date', format(new Date(), 'yyyy-MM-dd'))
      ]);

      setStats({
        totalStudents: students.count || 0,
        totalEmployees: profiles.count || 0,
        todayAttendance: attendance.count || 0,
        attendanceRate: profiles.count ? Math.round(((attendance.count || 0) / profiles.count) * 100) : 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Halo, {profile?.full_name}! 👋
          </h1>
          <p className="text-gray-500 max-w-md">
            Selamat datang di Sistem Absensi SMK Prima Unggul. Hari ini adalah {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-20 -mt-20 opacity-50" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-yellow-50 rounded-full opacity-50" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Siswa" 
          value={stats.totalStudents} 
          icon={<GraduationCap className="text-blue-600" />} 
          color="bg-blue-50"
        />
        <StatCard 
          title="Total Karyawan" 
          value={stats.totalEmployees} 
          icon={<Users className="text-purple-600" />} 
          color="bg-purple-50"
        />
        <StatCard 
          title="Absen Hari Ini" 
          value={stats.todayAttendance} 
          icon={<Clock className="text-orange-600" />} 
          color="bg-orange-50"
        />
        <StatCard 
          title="Persentase Kehadiran" 
          value={`${stats.attendanceRate}%`} 
          icon={<TrendingUp className="text-green-600" />} 
          color="bg-green-50"
        />
      </div>

      {/* Quick Actions / Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CalendarIcon size={20} className="text-primary" />
            Informasi Sekolah
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-1">Pengumuman Absensi</h4>
              <p className="text-sm text-gray-600">Pastikan semua karyawan melakukan absensi mandiri sebelum pukul 08:00 WIB setiap harinya.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-1">Update Data Siswa</h4>
              <p className="text-sm text-gray-600">Admin diharapkan melakukan verifikasi data siswa baru untuk tahun ajaran 2026/2027.</p>
            </div>
          </div>
        </div>

        <div className="bg-primary p-8 rounded-3xl shadow-lg shadow-red-200 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-4">Butuh Bantuan?</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Jika Anda mengalami kendala dalam penggunaan aplikasi absensi, silakan hubungi tim IT Support SMK Prima Unggul.
            </p>
          </div>
          <button className="mt-8 w-full bg-white text-primary py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
            Hubungi Support
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
