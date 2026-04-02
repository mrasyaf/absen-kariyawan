import React, { useState, useEffect } from 'react';
import { supabase, type Student, type StudentAttendance } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Search, Filter, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AbsensiSiswa() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'hadir' | 'sakit' | 'izin' | 'alpa'>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState('X RPL');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const classes = ['X RPL', 'XI RPL', 'XII RPL', 'X TKJ', 'XI TKJ', 'XII TKJ', 'X MM', 'XI MM', 'XII MM'];

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class', selectedClass)
      .order('name');

    if (!error) {
      setStudents(data || []);
      // Initialize attendance state
      const initial: Record<string, 'hadir' | 'sakit' | 'izin' | 'alpa'> = {};
      data?.forEach(s => initial[s.id] = 'hadir');
      setAttendance(initial);
    }
    setLoading(false);
  };

  const handleStatusChange = (studentId: string, status: 'hadir' | 'sakit' | 'izin' | 'alpa') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage(null);
    const today = format(new Date(), 'yyyy-MM-dd');

    try {
      const attendanceData = students.map(s => ({
        student_id: s.id,
        teacher_id: profile?.id,
        date: today,
        status: attendance[s.id],
        class: selectedClass
      }));

      const { error } = await supabase
        .from('student_attendance')
        .insert(attendanceData);

      if (error) throw error;

      setMessage({ type: 'success', text: `Absensi kelas ${selectedClass} berhasil disimpan!` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal menyimpan absensi.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nis.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none font-semibold text-gray-700"
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Cari NIS atau Nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={submitting || students.length === 0}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-800 transition-all shadow-lg shadow-red-100 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Simpan Absensi'}
        </button>
      </div>

      {message && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center gap-3 text-sm font-medium",
          message.type === 'success' ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
        )}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">NIS</th>
                <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Nama Siswa</th>
                <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                  </td>
                </tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{student.nis}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{student.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {[
                        { id: 'hadir', label: 'H', color: 'bg-green-100 text-green-700 border-green-200' },
                        { id: 'sakit', label: 'S', color: 'bg-orange-100 text-orange-700 border-orange-200' },
                        { id: 'izin', label: 'I', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                        { id: 'alpa', label: 'A', color: 'bg-red-100 text-red-700 border-red-200' }
                      ].map((status) => (
                        <button
                          key={status.id}
                          onClick={() => handleStatusChange(student.id, status.id as any)}
                          className={cn(
                            "w-10 h-10 rounded-xl border-2 font-bold transition-all flex items-center justify-center",
                            attendance[student.id] === status.id 
                              ? status.color 
                              : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"
                          )}
                          title={status.id.toUpperCase()}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500 font-medium">
                    Tidak ada data siswa di kelas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
