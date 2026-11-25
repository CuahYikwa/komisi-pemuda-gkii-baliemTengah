import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { normalizeWhatsAppDigits } from '../utils/logic';
import { SafeImage } from './SafeImage';

export function AnimatedCounter({
  value,
  durationMs = 1000,
}: {
  value: number;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion || value <= 0) {
      setDisplay(value);
      return;
    }

    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, value, durationMs, shouldReduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

export function TypewriterText() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-[1.75rem] flex items-center text-sm sm:text-base font-medium text-[#F9E7B2]">
      <motion.span
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.45 }}
      >
        GROWING TOGETHER EPHESIANS 4:15-16
      </motion.span>
    </div>
  );
}

const HIGHLIGHT_KEYWORDS = new Set(['iman', 'kasih', 'melayani']);

export function HighlightedTagline({ text }: { text: string }) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <p className="mt-5 font-display text-lg sm:text-xl font-medium text-slate-100 leading-snug">
      <span aria-hidden="true">“</span>
      {words.map((word, idx) => {
        const clean = word.toLowerCase().replace(/[.,!?"'”]/g, '');
        const isHighlighted = HIGHLIGHT_KEYWORDS.has(clean);

        return (
          <motion.span
            key={`${word}-${idx}`}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.35,
              delay: shouldReduceMotion ? 0 : 0.45 + idx * 0.055,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`inline-block ${
              idx < words.length - 1 ? 'mr-[0.28em]' : ''
            } ${
              isHighlighted
                ? 'text-[#DCB458] font-semibold underline decoration-[#C89B3C]/60 underline-offset-4'
                : ''
            }`}
          >
            {word}
          </motion.span>
        );
      })}
      <span aria-hidden="true">”</span>
    </p>
  );
}

export function RevealImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  priority?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : { opacity: 0.4, scale: 1.04, filter: 'blur(4px)' }
      }
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full"
    >
      <SafeImage
        src={src}
        alt={alt}
        fallbackTitle={fallbackTitle}
        priority={priority}
        className={className}
      />
    </motion.div>
  );
}

export function FloatingActions() {
  const { settings } = useAppData();
  const [showTop, setShowTop] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 420);
      const remaining =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);
      setNearBottom(remaining < 120);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const waDigits = normalizeWhatsAppDigits(
    settings.socialLinks.whatsapp || settings.whatsappNumber
  );

  return (
    <div
      className={`fixed left-4 sm:left-6 z-30 flex flex-col items-start gap-2.5 transition-all duration-300 ${
        nearBottom ? 'bottom-32 sm:bottom-20' : 'bottom-4 sm:bottom-5'
      }`}
    >
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Kembali ke atas halaman"
            className="w-10 h-10 rounded-full bg-white/95 text-[#0B1F3A] border border-slate-200 shadow-lg hover:bg-[#0B1F3A] hover:text-white transition-colors flex items-center justify-center"
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href={`https://wa.me/${waDigits}?text=${encodeURIComponent(
          'Shalom Pengurus Komisi Pemuda Pemudi GKII Baliem Tengah, saya ingin berkomunikasi terkait pelayanan pemuda.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi pengurus melalui WhatsApp"
        whileHover={{ y: -2, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0B1F3A] text-white border border-[#C89B3C]/50 shadow-lg hover:bg-[#122D52] transition-colors text-xs font-semibold"
      >
        <MessageCircle className="w-4 h-4 text-[#DCB458]" aria-hidden="true" />
        <span className="hidden sm:inline">WhatsApp</span>
      </motion.a>
    </div>
  );
}
