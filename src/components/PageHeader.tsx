import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
}: PageHeaderProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative bg-[#071426] pt-28 pb-14 sm:pt-32 sm:pb-16 border-b border-white/10 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,155,60,0.16),transparent_55%)]"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-400 mb-4"
        >
          <Link to="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight
            className="w-3.5 h-3.5 text-slate-500"
            aria-hidden="true"
          />
          <span className="text-[#DCB458] font-medium">{breadcrumb}</span>
        </nav>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-xs font-semibold uppercase tracking-[0.16em] text-[#DCB458] mb-2"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, y: 14, filter: 'blur(4px)' }
          }
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight text-balance max-w-3xl"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={shouldReduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
          className="mt-4 h-[2px] w-16 bg-gradient-to-r from-[#C89B3C] to-transparent"
        />

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
