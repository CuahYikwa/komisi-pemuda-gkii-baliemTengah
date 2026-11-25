import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  Facebook,
  Instagram,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  PlaySquare,
  Youtube,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { normalizeWhatsAppDigits } from '../utils/logic';
import { LogoMark } from './LogoMark';

export function Footer() {
  const { settings } = useAppData();
  const shouldReduceMotion = useReducedMotion();
  const waDigits = normalizeWhatsAppDigits(
    settings.socialLinks.whatsapp || settings.whatsappNumber
  );

  const socialItems = [
    {
      label: 'Facebook',
      href: settings.socialLinks.facebook,
      icon: Facebook,
    },
    {
      label: 'Instagram',
      href: settings.socialLinks.instagram,
      icon: Instagram,
    },
    {
      label: 'TikTok',
      href: settings.socialLinks.tiktok,
      icon: PlaySquare,
    },
    {
      label: 'YouTube',
      href: settings.socialLinks.youtube,
      icon: Youtube,
    },
    {
      label: 'WhatsApp',
      href: waDigits ? `https://wa.me/${waDigits}` : '#kontak',
      icon: MessageCircle,
    },
  ];

  return (
    <footer className="relative bg-[#071426] text-slate-300 border-t border-white/10 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(200,155,60,0.08),transparent_45%)]"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Organization Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <LogoMark className="w-10 h-10 shrink-0" />
              <div>
                <p className="font-display font-bold text-white text-sm leading-snug">
                  {settings.organizationName}
                </p>
                <p className="text-xs text-[#DCB458] mt-0.5">
                  Papua Pegunungan
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.tagline} {settings.heroDescription}
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {socialItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#071426] hover:bg-[#C89B3C] hover:border-[#C89B3C] hover:shadow-[0_0_16px_rgba(200,155,60,0.35)] transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-white mb-4">
                Organisasi
              </h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { to: '/', label: 'Beranda' },
                  { to: '/tentang', label: 'Tentang Kami' },
                  { to: '/struktur', label: 'Struktur Organisasi' },
                  { to: '/program', label: 'Program Kerja' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-block text-slate-400 hover:text-[#DCB458] hover:translate-x-1 transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-white mb-4">
                Informasi
              </h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { to: '/berita', label: 'Berita Terbaru' },
                  { to: '/kegiatan', label: 'Kegiatan Pemuda' },
                  { to: '/galeri', label: 'Galeri Foto' },
                  { to: '/kontak', label: 'Kontak Kami' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-block text-slate-400 hover:text-[#DCB458] hover:translate-x-1 transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Sekretariat & Pelayanan
            </h3>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin
                className="w-4 h-4 text-[#C89B3C] shrink-0 mt-1"
                aria-hidden="true"
              />
              <span className="leading-relaxed">
                {settings.secretariatAddress}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Mail
                className="w-4 h-4 text-[#C89B3C] shrink-0"
                aria-hidden="true"
              />
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-white transition-colors"
              >
                {settings.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <MessageCircle
                className="w-4 h-4 text-[#C89B3C] shrink-0"
                aria-hidden="true"
              />
              <a
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors tabular-nums"
              >
                +{waDigits} (WhatsApp Pengurus)
              </a>
            </div>
            <p className="text-xs text-slate-500 pt-2">
              Jadwal Ibadah Pemuda: {settings.serviceSchedule}
            </p>
          </div>
        </div>

        {/* Animated Separator */}
        <motion.div
          initial={shouldReduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
          className="mt-12 h-px bg-gradient-to-r from-[#C89B3C]/50 via-white/15 to-transparent"
        />

        {/* Bottom Copyright & Subtle Admin Login Button at Far Bottom-Right */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-slate-400 text-center sm:text-left">
            © 2026 KOMISI PEMUDA DAERAH GKII BALIEM TENGAH. All Rights Reserved.
          </p>
          <Link
            to="/admin/login"
            aria-label="Login Admin"
            className="relative z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#C89B3C]/20 border border-white/10 hover:border-[#C89B3C]/50 text-xs font-medium text-slate-300 hover:text-[#DCB458] transition-colors select-none cursor-pointer shrink-0"
          >
            <Lock className="w-3 h-3 text-[#DCB458]/80" aria-hidden="true" />
            <span>Admin</span>
          </Link>
        </motion.div>
      </div>
    </footer>
  );
}
