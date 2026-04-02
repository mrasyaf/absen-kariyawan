import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, Users, BookOpen, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">SMK <span className="text-primary">Prima Unggul</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#profile" className="text-gray-600 hover:text-primary transition-colors">Profil</a>
              <a href="#jurusan" className="text-gray-600 hover:text-primary transition-colors">Jurusan</a>
              <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-red-800 transition-all shadow-lg shadow-red-200">
                Login Aplikasi
              </Link>
            </div>

            <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-gray-100 p-4 flex flex-col gap-4"
          >
            <a href="#profile" className="text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Profil</a>
            <a href="#jurusan" className="text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Jurusan</a>
            <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-lg text-center font-medium">
              Login Aplikasi
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-primary uppercase bg-red-50 rounded-full">
              Sistem Absensi Terintegrasi
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Membangun Masa Depan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Unggul & Berkarakter</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              SMK Prima Unggul berkomitmen menciptakan lulusan yang kompeten di bidang teknologi dan siap bersaing di dunia industri global.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-800 transition-all flex items-center justify-center gap-2 group">
                Mulai Absensi <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#profile" className="w-full sm:w-auto bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all">
                Pelajari Profil
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profile Section */}
      <section id="profile" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1523050853063-bd8012fbb72a?auto=format&fit=crop&q=80&w=1000" 
                  alt="School Building" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-secondary p-6 rounded-2xl shadow-xl hidden lg:block">
                <p className="text-white font-bold text-2xl">Akreditasi A</p>
                <p className="text-white/80">Unggul & Terpercaya</p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Profil SMK Prima Unggul</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                SMK Prima Unggul adalah institusi pendidikan kejuruan yang berfokus pada pengembangan bakat dan minat siswa di bidang teknologi informasi. Kami menyediakan fasilitas modern dan kurikulum yang selaras dengan kebutuhan industri.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg text-primary">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">500+</h4>
                    <p className="text-sm text-gray-500">Siswa Aktif</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg text-primary">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">3</h4>
                    <p className="text-sm text-gray-500">Jurusan Unggulan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section id="jurusan" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Jurusan Unggulan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Kami menawarkan program keahlian yang paling dicari di era digital saat ini.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "TKJ",
                full: "Teknik Komputer & Jaringan",
                desc: "Mempelajari instalasi jaringan, administrasi server, dan keamanan siber.",
                icon: "🌐"
              },
              {
                title: "RPL",
                full: "Rekayasa Perangkat Lunak",
                desc: "Fokus pada pengembangan aplikasi web, mobile, dan logika pemrograman.",
                icon: "💻"
              },
              {
                title: "Multimedia",
                full: "Desain Komunikasi Visual",
                desc: "Mengasah kreativitas dalam desain grafis, videografi, dan animasi digital.",
                icon: "🎨"
              }
            ].map((j, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-6">{j.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{j.title}</h3>
                <p className="text-primary font-semibold mb-4">{j.full}</p>
                <p className="text-gray-600 leading-relaxed">{j.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <GraduationCap className="text-secondary" size={32} />
            <span className="font-bold text-2xl">SMK Prima Unggul</span>
          </div>
          <p className="text-gray-400 mb-8">Jl. Pendidikan No. 123, Kota Inspirasi, Indonesia</p>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500 text-sm">© 2026 SMK Prima Unggul. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
