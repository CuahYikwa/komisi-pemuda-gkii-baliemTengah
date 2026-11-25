import { motion, useReducedMotion } from 'motion/react';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
}: SectionTitleProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = title.split(' ');

  return (
    <div
      className={
        align === 'center' ? 'max-w-2xl mx-auto text-center' : 'max-w-2xl'
      }
    >
      <motion.p
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.35 }}
        className={`text-xs font-semibold tracking-[0.14em] uppercase mb-2.5 ${
          light ? 'text-[#DCB458]' : 'text-[#A87E26]'
        }`}
      >
        {eyebrow}
      </motion.p>

      <h2
        className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-balance leading-[1.18] ${
          light ? 'text-white' : 'text-[#0B1F3A]'
        }`}
      >
        {words.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 14, filter: 'blur(3px)' }
            }
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.4,
              delay: shouldReduceMotion ? 0 : idx * 0.045,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block mr-[0.26em]"
          >
            {word}
          </motion.span>
        ))}
      </h2>

      {/* Animated Gold Underline */}
      <motion.div
        initial={shouldReduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: align === 'center' ? 0.5 : 0 }}
        className={`mt-3 h-[2px] w-16 bg-gradient-to-r from-[#C89B3C] to-[#DCB458]/40 ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />

      {description && (
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            light ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
