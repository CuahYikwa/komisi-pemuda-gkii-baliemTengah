import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowRight, Calendar, ChevronDown } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { HERO_IMAGES } from '../services/seedData';
import { HighlightedTagline, TypewriterText } from './MotionPrimitives';

const LIGHT_PARTICLES = [
  { left: '12%', top: '24%', size: 6, dur: 7.5, delay: 0 },
  { left: '28%', top: '68%', size: 4, dur: 9.2, delay: 0.8 },
  { left: '46%', top: '18%', size: 5, dur: 8.4, delay: 1.4 },
  { left: '64%', top: '42%', size: 7, dur: 10.1, delay: 0.4 },
  { left: '78%', top: '22%', size: 4, dur: 8.8, delay: 1.9 },
  { left: '86%', top: '64%', size: 6, dur: 7.9, delay: 0.6 },
  { left: '54%', top: '76%', size: 5, dur: 9.5, delay: 1.1 },
  { left: '20%', top: '46%', size: 4, dur: 8.1, delay: 1.7 },
];

export function Hero() {
  const { settings, gallery } = useAppData();
  const shouldReduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);

  const slides = useMemo(() => {
    const extraFromGallery = gallery
      .filter(
        (g) =>
          g.imageUrl &&
          !HERO_IMAGES.some((h) => h.src === g.imageUrl)
      )
      .slice(0, 2)
      .map((g) => ({
        src: g.imageUrl,
        alt: g.title,
        caption: g.title,
      }));
    return [...HERO_IMAGES, ...extraFromGallery];
  }, [gallery]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const lineOneWords = ['KOMISI', 'PEMUDA', 'DAERAH'];

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] sm:min-h-screen flex items-center overflow-hidden bg-[#071426]"
    >
      {/* Cinematic Parallax Slideshow with Ken Burns */}
      <motion.div
        style={shouldReduceMotion ? undefined : { y: bgY }}
        className="absolute inset-0 will-change-transform"
        aria-hidden="true"
      >
        <AnimatePresence mode="sync">
          {slides[activeSlide] && (
            <motion.img
              key={slides[activeSlide].src}
              src={slides[activeSlide].src}
              alt={slides[activeSlide].alt}
              referrerPolicy="no-referrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover object-[50%_50%] sm:object-center animate-ken-burns"
            />
          )}
        </AnimatePresence>

        {/* Measured Navy Blue & Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071426]/85 via-[#0B1F3A]/68 to-[#071426]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071426]/88 via-[#071426]/45 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(200,155,60,0.12),transparent_48%)]" />
      </motion.div>

      {/* Lightweight Animated Light Particles */}
      {!shouldReduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {LIGHT_PARTICLES.map((p, idx) => (
            <motion.span
              key={idx}
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
              }}
              animate={{
                y: [0, -22, 0],
                opacity: [0.15, 0.55, 0.15],
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: p.dur,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute rounded-full bg-[#DCB458]/70 will-change-transform"
            />
          ))}
        </div>
      )}

      {/* Subtle Floating Architectural Rings */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
            className="pointer-events-none hidden lg:block absolute right-16 top-28 w-60 h-60 rounded-full border border-[#C89B3C]/20 bg-white/[0.02] backdrop-blur-[2px]"
          />
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
            className="pointer-events-none hidden lg:block absolute right-40 bottom-28 w-32 h-32 rounded-2xl rotate-12 border border-white/10 bg-[#C89B3C]/[0.04]"
          />
        </>
      )}

      {/* Hero Typography & Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-28 sm:pb-24 w-full">
        <div className="max-w-3xl">
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#DCB458] mb-4"
          >
            Website Resmi Pelayanan Pemuda · Lembah Baliem, Papua Pegunungan
          </motion.p>

          {/* Staggered Word & Blur-to-Focus Headline */}
          <h1 className="font-display font-extrabold text-white text-[clamp(2rem,4.5vw,3.9rem)] leading-[1.08] tracking-tight text-balance">
            <span className="block">
              {lineOneWords.map((word, idx) => (
                <motion.span
                  key={word}
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, y: 20, filter: 'blur(6px)' }
                  }
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.55,
                    delay: shouldReduceMotion ? 0 : 0.08 + idx * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-[0.26em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>

            <motion.span
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 22,
                      filter: 'blur(8px)',
                      letterSpacing: '0.06em',
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                letterSpacing: '-0.02em',
              }}
              transition={{
                duration: 0.7,
                delay: shouldReduceMotion ? 0 : 0.34,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="block mt-1 text-gold-gradient"
            >
              GKII BALIEM TENGAH
            </motion.span>
          </h1>

          {/* Animated Tagline with Highlights on Iman, Kasih, Melayani */}
          <HighlightedTagline text={settings.tagline} />

          {/* Smooth Typewriter Identity */}
          <div className="mt-3">
            <TypewriterText />
          </div>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl"
          >
            {settings.heroDescription}
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/tentang"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C89B3C] hover:bg-[#DCB458] text-[#071426] font-semibold text-sm sm:text-base transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:scale-[0.98] whitespace-nowrap"
            >
              <span>Mengenal Kami</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            <Link
              to="/kegiatan"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm font-semibold text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] whitespace-nowrap"
            >
              <Calendar
                className="w-4 h-4 text-[#DCB458] transition-transform duration-200 group-hover:scale-110"
                aria-hidden="true"
              />
              <span>Lihat Kegiatan</span>
            </Link>
          </motion.div>

          {/* Slideshow Controls */}
          <div className="mt-10 sm:mt-12 flex items-center gap-3">
            {slides.map((slide, idx) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Tampilkan latar ${slide.caption}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeSlide
                    ? 'w-10 bg-[#C89B3C]'
                    : 'w-4 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
            <span className="ml-2 text-xs text-slate-300 truncate max-w-[260px] sm:max-w-none">
              {slides[activeSlide]?.caption}
            </span>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <a
        href="#ringkasan-beranda"
        aria-label="Gulir ke bagian bawah"
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors"
      >
        <span className="text-[11px] uppercase tracking-widest">Jelajahi</span>
        <motion.span
          animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-[#DCB458]" />
        </motion.span>
      </a>
    </section>
  );
}
