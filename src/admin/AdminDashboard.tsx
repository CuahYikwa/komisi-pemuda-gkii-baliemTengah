import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Briefcase,
  CalendarDays,
  DatabaseBackup,
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Settings as SettingsIcon,
  Share2,
  Users,
  X,
} from 'lucide-react';
import { LogoMark } from '../components/LogoMark';
import { AnimatedCounter } from '../components/MotionPrimitives';
import { useAppData } from '../context/AppDataContext';
import { logoutAdmin, watchAdminAuthorization } from '../services/auth';
import { loadPreferences, savePreferences } from '../services/storage';
import { ActivityManager } from './ActivityManager';
import { BackupManager } from './BackupManager';
import { GalleryManager } from './GalleryManager';
import { NewsManager } from './NewsManager';
import { OrganizationManager } from './OrganizationManager';
import { ProgramManager } from './ProgramManager';
import { Settings } from './Settings';
import { SocialManager } from './SocialManager';

type AdminTab =
  | 'dashboard'
  | 'news'
  | 'activities'
  | 'gallery'
  | 'organization'
  | 'programs'
  | 'social'
  | 'settings'
  | 'backup';

const NAV_ITEMS: Array<{
  id: AdminTab;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'news', label: 'Berita', icon: Newspaper },
  { id: 'activities', label: 'Kegiatan', icon: CalendarDays },
  { id: 'gallery', label: 'Galeri Foto', icon: ImageIcon },
  { id: 'organization', label: 'Struktur Organisasi', icon: Users },
  { id: 'programs', label: 'Program Kerja', icon: Briefcase },
  { id: 'social', label: 'Media Sosial', icon: Share2 },
  { id: 'settings', label: 'Pengaturan Website', icon: SettingsIcon },
  { id: 'backup', label: 'Backup Data', icon: DatabaseBackup },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { news, activities, gallery, members, programs, logs, loading } =
    useAppData();
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    const saved = loadPreferences().lastAdminTab as AdminTab | undefined;
    return saved && NAV_ITEMS.some((i) => i.id === saved) ? saved : 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    return watchAdminAuthorization((authorized) => {
      setAuthChecking(false);
      if (!authorized) navigate('/admin/login', { replace: true });
    });
  }, [navigate]);

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    savePreferences({ lastAdminTab: tab });
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Gagal keluar dari akun admin Firebase:', error);
    }
  };

  const chartData = [
    { label: 'Berita', count: news.length, color: '#0B1F3A' },
    { label: 'Kegiatan', count: activities.length, color: '#1B3F70' },
    { label: 'Foto Galeri', count: gallery.length, color: '#C89B3C' },
    { label: 'Pengurus', count: members.length, color: '#2E5B9A' },
    { label: 'Program', count: programs.length, color: '#A87E26' },
  ];
  const maxChart = Math.max(1, ...chartData.map((d) => d.count));

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-600">
        Memverifikasi akses admin...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-[#071426] text-white px-4 h-14 flex items-center justify-between border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <LogoMark className="w-8 h-8" />
          <span className="font-display font-bold text-sm">
            Panel Admin GKII
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen((s) => !s)}
          aria-label="Buka navigasi admin"
          className="p-2 rounded-lg hover:bg-white/10"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#071426] text-slate-300 flex flex-col border-r border-white/10 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <LogoMark className="w-9 h-9 shrink-0" />
          <div className="min-w-0">
            <p className="font-display font-bold text-xs text-white truncate">
              KPP GKII BALIEM TENGAH
            </p>
            <p className="text-[11px] text-[#DCB458]">Dashboard Pengelola</p>
          </div>
        </div>

        <nav
          aria-label="Navigasi dashboard admin"
          className="flex-1 p-3 space-y-1 overflow-y-auto"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                  active
                    ? 'text-[#071426] font-semibold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="admin-active-nav"
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 rounded-xl bg-[#C89B3C]"
                  />
                )}
                <Icon
                  className="relative z-10 w-4 h-4 shrink-0"
                  aria-hidden="true"
                />
                <span className="relative z-10 truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1.5">
          <Link
            to="/"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <span>Lihat Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-6xl">
        {/* Top Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#A87E26]">
              Panel Pengelola Lokal
            </p>
            <h1 className="font-display text-2xl font-bold text-[#0B1F3A]">
              {NAV_ITEMS.find((i) => i.id === activeTab)?.label}
            </h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#0B1F3A] hover:border-[#0B1F3A] transition-colors"
          >
            <span>Buka Halaman Utama</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Animated Stat Cards */}
                {loading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="h-28 rounded-2xl bg-slate-200 animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: 'Jumlah Berita',
                        value: news.length,
                        sub: `${
                          news.filter((n) => n.status === 'published').length
                        } terbit`,
                        tab: 'news' as AdminTab,
                      },
                      {
                        label: 'Jumlah Kegiatan',
                        value: activities.length,
                        sub: `${
                          activities.filter((a) => a.status === 'Akan Datang')
                            .length
                        } akan datang`,
                        tab: 'activities' as AdminTab,
                      },
                      {
                        label: 'Foto Galeri',
                        value: gallery.length,
                        sub: 'Tersimpan di Firebase',
                        tab: 'gallery' as AdminTab,
                      },
                      {
                        label: 'Jumlah Pengurus',
                        value: members.length,
                        sub: 'Aktif di bagan struktur',
                        tab: 'organization' as AdminTab,
                      },
                    ].map((stat) => (
                      <button
                        key={stat.label}
                        type="button"
                        onClick={() => handleSelectTab(stat.tab)}
                        className="text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#C89B3C] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                      >
                        <p className="text-xs font-medium text-slate-500">
                          {stat.label}
                        </p>
                        <p className="font-display text-3xl font-bold text-[#0B1F3A] mt-1 tabular-nums">
                          <AnimatedCounter value={stat.value} />
                        </p>
                        <p className="text-xs text-[#A87E26] font-medium mt-1">
                          {stat.sub}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Animated Chart & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200">
                    <h2 className="font-display font-bold text-base text-[#0B1F3A] mb-1">
                      Ringkasan Konten Organisasi
                    </h2>
                    <p className="text-xs text-slate-500 mb-6">
                      Distribusi konten yang tersimpan di Firebase
                    </p>

                    <div className="space-y-4">
                      {chartData.map((row, idx) => {
                        const pct = Math.max(
                          6,
                          Math.round((row.count / maxChart) * 100)
                        );
                        return (
                          <div key={row.label} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-medium">
                              <span className="text-slate-700">{row.label}</span>
                              <span className="font-mono font-bold text-[#0B1F3A] tabular-nums">
                                <AnimatedCounter value={row.count} />
                              </span>
                            </div>
                            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                              <motion.div
                                initial={
                                  shouldReduceMotion ? false : { scaleX: 0 }
                                }
                                animate={{ scaleX: 1 }}
                                transition={{
                                  duration: 0.65,
                                  delay: idx * 0.08,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: row.color,
                                  originX: 0,
                                }}
                                className="h-full rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200">
                    <h2 className="font-display font-bold text-base text-[#0B1F3A] mb-1">
                      Aktivitas Terbaru
                    </h2>
                    <p className="text-xs text-slate-500 mb-4">
                      Riwayat pembaruan data terakhir
                    </p>

                    {logs.length === 0 ? (
                      <p className="text-xs text-slate-500">
                        Belum ada catatan aktivitas.
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {logs.slice(0, 6).map((log) => (
                          <li
                            key={log.id}
                            className="pb-3 border-b border-slate-100 last:border-b-0 last:pb-0 text-xs"
                          >
                            <p className="font-semibold text-[#A87E26]">
                              {log.module} ·{' '}
                              <span className="font-normal text-slate-400 tabular-nums">
                                {new Date(log.timestamp).toLocaleString(
                                  'id-ID',
                                  {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )}
                              </span>
                            </p>
                            <p className="text-slate-700 mt-0.5 leading-snug">
                              {log.action}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#F9F1DC] border border-[#C89B3C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs sm:text-sm text-[#0B1F3A]">
                    <strong>Penyimpanan Firebase:</strong> Perubahan dashboard
                    tersimpan secara daring. Ekspor backup JSON secara berkala
                    sebagai salinan cadangan.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectTab('backup')}
                    className="px-4 py-2 rounded-xl bg-[#0B1F3A] text-white text-xs font-semibold whitespace-nowrap shrink-0"
                  >
                    Kelola Backup Data
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'news' && <NewsManager />}
            {activeTab === 'activities' && <ActivityManager />}
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'organization' && <OrganizationManager />}
            {activeTab === 'programs' && <ProgramManager />}
            {activeTab === 'social' && <SocialManager />}
            {activeTab === 'settings' && <Settings />}
            {activeTab === 'backup' && <BackupManager />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
