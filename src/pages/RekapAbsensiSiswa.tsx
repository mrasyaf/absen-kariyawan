import React, { useState, useEffect } from 'react';
import { supabase, type StudentAttendance } from '../lib/supabase';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import { Search, Download, Calendar, Filter, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function RekapAbsensiSiswa() {
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [searchQuery, setSearchQuery] = useState('');

  const classes = ['Semua Kelas', 'X RPL', 'XI RPL', 'XII RPL', 'X TKJ', 'XI TKJ', 'XII TKJ', 'X MM', 'XI MM', 'XII MM'];

  useEffect(() => {
    fetchAttendance();
  }, [month, selectedClass]);

  const fetchAttendance = async () => {
    setLoading(true);
    const start = startOfMonth(new Date(month));
    const end = endOfMonth(new Date(month));

    let query = supabase
      .from('student_attendance')
      .select('*, students(*), profiles(*)')
      .gte('date', format(start, 'yyyy-MM-dd'))
      .lte('date', format(end, 'yyyy-MM-dd'))
      .order('date', { ascending: false });

    if (selectedClass !== 'Semua Kelas') {
      query = query.eq('class', selectedClass);
    }

    const { data, error } = await query;

    if (!error) setAttendance(data || []);
    setLoading(false);
  };

  const filteredAttendance = attendance.filter(a => 
    a.students?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.students?.nis.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-semibold text-gray-700"
            />
          </div>
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
              placeholder="Cari Nama atau NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>
        
        <button className="bg-secondary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-100 flex items-center justify-center gap-2">
          <Download size={20} />
          Export PDF
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Nama Siswa</th>
                <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Guru Pengabsen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                  </td>
                </tr>
              ) : filteredAttendance.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {format(new Date(a.date), 'dd MMM yyyy', { locale: id })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{a.students?.name}</span>
                      <span className="text-xs font-mono text-gray-500">{a.students?.nis}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-600">{a.class}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase",
                      a.status === 'hadir' ? "bg-green-100 text-green-700" :
                      a.status === 'sakit' ? "bg-orange-100 text-orange-700" :
                      a.status === 'izin' ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {a.profiles?.full_name}
                  </td>
                </tr>
              ))}
              {!loading && filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    Tidak ada data absensi siswa untuk periode ini.
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
