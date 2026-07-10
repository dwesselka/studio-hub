import { useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SuccessModalProps {
  title: string
  children: ReactNode
  onClose: () => void
}

export default function SuccessModal({ title, children, onClose }: SuccessModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    closeRef.current?.focus()
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <motion.div
          className="bg-card rounded-xl p-6 shadow-lg max-w-md w-full mx-4"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <button
              ref={closeRef}
              aria-label="Fechar"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              ✕
            </button>
          </div>
          <div>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
