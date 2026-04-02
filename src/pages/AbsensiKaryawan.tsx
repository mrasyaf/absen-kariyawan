import React, { useState, useEffect } from 'react';
import { supabase, type EmployeeAttendance } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function AbsensiKaryawan() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<EmployeeAttendance | null>(null);
  const [history, setHistory] = useState<EmployeeAttendance[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      fetchTodayAttendance();
      fetchHistory();
    }
  }, [profile]);

  const fetchTodayAttendance = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('profile_id', profile?.id)
      .eq('date', today)
      .maybeSingle();

    if (!error) setTodayAttendance(data);
  };

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('profile_id', profile?.id)
      .order('date', { ascending: false })
      .limit(5);

    if (!error) setHistory(data || []);
  };

  const handleAttendance = async (status: 'hadir' | 'sakit' | 'izin') => {
    setLoading(true);
    setMessage(null);
    const today = format(new Date(), 'yyyy-MM-dd');
    const time = format(new Date(), 'HH:mm:ss');

    try {
      const { error } = await supabase
        .from('employee_attendance')
        .insert({
          profile_id: profile?.id,
          date: today,
          time: time,
          status: status
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Absensi berhasil dicatat!' });
      fetchTodayAttendance();
      fetchHistory();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal mencatat absensi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Absensi Mandiri</h2>
        
        {todayAttendance ? (
          <div className="bg-green-50 border border-green-100 p-8 rounded-2xl text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-1">Anda Sudah Absen Hari Ini</h3>
            <p className="text-green-700">
              Status: <span className="font-bold uppercase">{todayAttendance.status}</span> pada pukul {todayAttendance.time}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <Clock className="text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Waktu Sekarang</p>
                <p className="text-lg font-bold text-blue-900">{format(new Date(), 'HH:mm:ss')} WIB</p>
              </div>
            </div>

            {message && (
              <div className={cn(
                "p-4 rounded-xl flex items-center gap-3 text-sm",
                message.type === 'success' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span>{message.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => handleAttendance('hadir')}
                disabled={loading}
                className="p-6 bg-primary text-white rounded-2xl font-bold hover:bg-red-800 transition-all flex flex-col items-center gap-2 shadow-lg shadow-red-100 disabled:opacity-50"
              >
                <CheckCircle size={24} />
                Hadir
              </button>
              <button
                onClick={() => handleAttendance('sakit')}
                disabled={loading}
                className="p-6 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all flex flex-col items-center gap-2 shadow-lg shadow-orange-100 disabled:opacity-50"
              >
                <AlertCircle size={24} />
                Sakit
              </button>
              <button
                onClick={() => handleAttendance('izin')}
                disabled={loading}
                className="p-6 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all flex flex-col items-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                <AlertCircle size={24} />
                Izin
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Riwayat Absensi Terakhir</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Tanggal</th>
                <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Waktu</th>
                <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.map((h) => (
                <tr key={h.id} className="group">
                  <td className="py-4 text-gray-900 font-medium">
                    {format(new Date(h.date), 'dd MMMM yyyy', { locale: id })}
                  </td>
                  <td className="py-4 text-gray-600">{h.time}</td>
                  <td className="py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase",
                      h.status === 'hadir' ? "bg-green-100 text-green-700" :
                      h.status === 'sakit' ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">Belum ada riwayat absensi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
