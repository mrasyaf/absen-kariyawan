import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ClipboardList, 
  GraduationCap, 
  LogOut, 
  ChevronRight,
  Settings,
  FileText,
  UserPlus
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
  submenu?: { title: string; path: string }[];
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      path: '/app',
      icon: <LayoutDashboard size={20} />,
      roles: ['admin', 'guru', 'staff']
    },
    {
      title: 'Absensi Karyawan',
      path: '/app/absensi-karyawan',
      icon: <UserCheck size={20} />,
      roles: ['admin', 'guru', 'staff']
    },
    {
      title: 'Absensi Siswa',
      path: '/app/absensi-siswa',
      icon: <ClipboardList size={20} />,
      roles: ['admin', 'guru']
    },
    {
      title: 'Rekap Absensi',
      path: '/app/rekap',
      icon: <FileText size={20} />,
      roles: ['admin', 'guru'],
      submenu: [
        { title: 'Absensi Karyawan', path: '/app/rekap/karyawan' },
        { title: 'Absensi Siswa', path: '/app/rekap/siswa' }
      ]
    },
    {
      title: 'Data Siswa',
      path: '/app/data-siswa',
      icon: <GraduationCap size={20} />,
      roles: ['admin']
    },
    {
      title: 'User Management',
      path: '/app/users',
      icon: <UserPlus size={20} />,
      roles: ['admin']
    }
  ];

  const filteredMenu = menuItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transition-transform lg:translate-x-0 lg:static lg:inset-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-red-100">
                <GraduationCap className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900 leading-tight">SMK Prima</span>
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Unggul</span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredMenu.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              
              // Special case for guru rekap (only siswa)
              const displaySubmenu = profile?.role === 'guru' && item.path === '/app/rekap' 
                ? item.submenu?.filter(s => s.path.includes('siswa'))
                : item.submenu;

              return (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                      isActive 
                        ? "bg-red-50 text-primary font-bold" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "transition-colors",
                        isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-900"
                      )}>
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </div>
                    {hasSubmenu && <ChevronRight size={16} className={cn("transition-transform", isActive && "rotate-90")} />}
                  </Link>

                  {isActive && displaySubmenu && (
                    <div className="mt-1 ml-11 space-y-1">
                      {displaySubmenu.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={cn(
                            "block px-4 py-2 text-sm rounded-lg transition-colors",
                            location.pathname === sub.path
                              ? "text-primary font-semibold bg-red-50/50"
                              : "text-gray-500 hover:text-gray-900"
                          )}
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Profile Mini */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm text-gray-900 truncate">{profile?.full_name}</span>
                <span className="text-xs text-gray-500 capitalize">{profile?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <LayoutDashboard size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {menuItems.find(i => location.pathname.startsWith(i.path))?.title || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-gray-900">{profile?.full_name}</span>
              <span className="text-xs text-gray-500">{profile?.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 text-gray-500 hover:text-primary hover:bg-red-50 rounded-xl transition-all border border-gray-100"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
