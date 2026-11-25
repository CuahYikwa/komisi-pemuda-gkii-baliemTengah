import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { LogoMark } from './LogoMark';

export function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isHome = pathname === '/';
  const solid = !isHome || scrolled || mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOrgDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOrgDropdownOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOrgDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const isOrgActive =
    pathname === '/tentang' ||
    pathname === '/struktur' ||
    pathname === '/program';

  const navLinkClass = (active: boolean) =>
    `relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 ${
      active
        ? 'text-[#DCB458]'
        : 'text-white/90 hover:text-white after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#C89B3C]/70 after:transition-all after:duration-200'
    }`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        solid
          ? 'bg-[#0B1F3A]/92 backdrop-blur-lg border-b border-white/15 shadow-lg'
          : 'bg-gradient-to-b from-[#071426]/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Mark & Full Title */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 min-w-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C] rounded-lg"
        >
          <LogoMark className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 transition-transform duration-200 group-hover:scale-105" />
          <span className="font-display font-bold text-white tracking-normal sm:tracking-tight text-[11px] sm:text-sm xl:text-[15px] leading-snug sm:whitespace-nowrap">
            KOMISI PEMUDA DAERAH GKII BALIEM TENGAH
          </span>
        </Link>

        {/* Zone 2: Desktop Navigation */}
        <nav
          aria-label="Navigasi utama"
          className="hidden lg:flex items-center gap-6"
        >
          <Link to="/" className={navLinkClass(pathname === '/')}>
            <span>Beranda</span>
            {pathname === '/' && (
              <motion.span
                layoutId="nav-active-underline"
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#C89B3C]"
              />
            )}
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOrgDropdownOpen((prev) => !prev)}
              aria-expanded={orgDropdownOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 ${navLinkClass(isOrgActive)}`}
            >
              <span>Organisasi</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  orgDropdownOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
              {isOrgActive && (
                <motion.span
                  layoutId="nav-active-underline"
                  className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#C89B3C]"
                />
              )}
            </button>

            <AnimatePresence>
              {orgDropdownOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 top-full mt-3 w-56 rounded-xl bg-[#0B1F3A]/95 border border-white/15 shadow-2xl py-2 backdrop-blur-xl"
                >
                  <Link
                    role="menuitem"
                    to="/tentang"
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      pathname === '/tentang'
                        ? 'text-[#DCB458] bg-white/10 font-semibold'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Tentang Kami
                  </Link>
                  <Link
                    role="menuitem"
                    to="/struktur"
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      pathname === '/struktur'
                        ? 'text-[#DCB458] bg-white/10 font-semibold'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Struktur Organisasi
                  </Link>
                  <Link
                    role="menuitem"
                    to="/program"
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      pathname === '/program'
                        ? 'text-[#DCB458] bg-white/10 font-semibold'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Program Kerja
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/berita"
            className={navLinkClass(pathname.startsWith('/berita'))}
          >
            <span>Berita</span>
            {pathname.startsWith('/berita') && (
              <motion.span
                layoutId="nav-active-underline"
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#C89B3C]"
              />
            )}
          </Link>

          <Link to="/kegiatan" className={navLinkClass(pathname === '/kegiatan')}>
            <span>Kegiatan</span>
            {pathname === '/kegiatan' && (
              <motion.span
                layoutId="nav-active-underline"
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#C89B3C]"
              />
            )}
          </Link>

          <Link to="/galeri" className={navLinkClass(pathname === '/galeri')}>
            <span>Galeri</span>
            {pathname === '/galeri' && (
              <motion.span
                layoutId="nav-active-underline"
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#C89B3C]"
              />
            )}
          </Link>
        </nav>

        {/* Zone 3: Primary CTA + Animated Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/kontak"
            className="hidden lg:inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-[#C89B3C] hover:bg-[#DCB458] text-[#071426] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] whitespace-nowrap shrink-0 shadow-sm"
          >
            Kontak
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Smooth Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            aria-label="Navigasi mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#0B1F3A]/98 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-1 shadow-2xl"
          >
            {[
              { to: '/', label: 'Beranda' },
              { to: '/tentang', label: 'Tentang Kami' },
              { to: '/struktur', label: 'Struktur Organisasi' },
              { to: '/program', label: 'Program Kerja' },
              { to: '/berita', label: 'Berita' },
              { to: '/kegiatan', label: 'Kegiatan' },
              { to: '/galeri', label: 'Galeri' },
              { to: '/kontak', label: 'Kontak' },
            ].map((item) => {
              const active =
                item.to === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-white/10 text-[#DCB458]'
                      : 'text-slate-100 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
