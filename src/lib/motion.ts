import { useReducedMotion } from '@/hooks/use-reduced-motion'

export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
}

export function useMotionConfig() {
  const reducedMotion = useReducedMotion()

  return {
    reducedMotion,
    transition: reducedMotion
      ? { duration: 0 }
      : { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
    spring: reducedMotion
      ? { duration: 0 }
      : { type: 'spring' as const, stiffness: 400, damping: 30 },
    hover: reducedMotion ? {} : { scale: 1.02 },
    tap: reducedMotion ? {} : { scale: 0.98 },
  }
}
