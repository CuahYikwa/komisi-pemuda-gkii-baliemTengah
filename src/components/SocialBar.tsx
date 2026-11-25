import { motion, useReducedMotion } from 'motion/react';
import {
  Facebook,
  Instagram,
  MessageCircle,
  PlaySquare,
  Youtube,
  ExternalLink,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { normalizeWhatsAppDigits } from '../utils/logic';

export function SocialBar() {
  const { settings } = useAppData();
  const shouldReduceMotion = useReducedMotion();
  const waDigits = normalizeWhatsAppDigits(
    settings.socialLinks.whatsapp || settings.whatsappNumber
  );

  const channels = [
    {
      name: 'Facebook',
      handle: 'Komisi Pemuda Pemudi GKII Baliem Tengah',
      href: settings.socialLinks.facebook,
      icon: Facebook,
      accent: 'hover:border-[#1877F2]/40 hover:bg-[#1877F2]/5',
    },
    {
      name: 'Instagram',
      handle: '@kppgkiibaliemtengah',
      href: settings.socialLinks.instagram,
      icon: Instagram,
      accent: 'hover:border-[#E4405F]/40 hover:bg-[#E4405F]/5',
    },
    {
      name: 'TikTok',
      handle: '@kppgkiibaliemtengah',
      href: settings.socialLinks.tiktok,
      icon: PlaySquare,
      accent: 'hover:border-slate-900/30 hover:bg-slate-900/5',
    },
    {
      name: 'YouTube',
      handle: 'GKII Baliem Tengah Youth',
      href: settings.socialLinks.youtube,
      icon: Youtube,
      accent: 'hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {channels.map((ch, idx) => {
        const Icon = ch.icon;
        return (
          <motion.a
            key={ch.name}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            whileHover={shouldReduceMotion ? undefined : { y: -3 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            className={`group flex items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 transition-colors duration-200 hover:shadow-md ${ch.accent}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] text-[#DCB458] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold text-sm text-[#0B1F3A]">
                  {ch.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{ch.handle}</p>
              </div>
            </div>
            <ExternalLink
              className="w-4 h-4 text-slate-400 group-hover:text-[#0B1F3A] shrink-0 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </motion.a>
        );
      })}

      <motion.a
        href={`https://wa.me/${waDigits}?text=${encodeURIComponent(
          'Shalom Pengurus Komisi Pemuda Pemudi GKII Baliem Tengah, saya ingin terhubung dengan pelayanan pemuda.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        whileHover={shouldReduceMotion ? undefined : { y: -3 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        className="group flex items-center justify-between gap-3 p-4 rounded-xl bg-[#0B1F3A] text-white border border-[#0B1F3A] hover:bg-[#122D52] transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#C89B3C] text-[#071426] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3">
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-sm text-white">
              WhatsApp Pengurus
            </p>
            <p className="text-xs text-slate-300 truncate">
              Hubungi langsung via WA
            </p>
          </div>
        </div>
        <ExternalLink
          className="w-4 h-4 text-[#DCB458] shrink-0 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </motion.a>
    </div>
  );
}
