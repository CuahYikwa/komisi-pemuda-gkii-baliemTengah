import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type RevealVariant =
  | 'fadeUp'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'blurReveal';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}

const VARIANT_MAP: Record<
  RevealVariant,
  {
    initial: Record<string, string | number>;
    animate: Record<string, string | number>;
  }
> = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
  },
  blurReveal: {
    initial: { opacity: 0, y: 14, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
};

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  variant = 'fadeUp',
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const preset = VARIANT_MAP[variant];

  return (
    <motion.div
      initial={shouldReduceMotion ? false : preset.initial}
      whileInView={preset.animate}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.48, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
