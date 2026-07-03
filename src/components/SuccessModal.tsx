import type { ReactNode } from 'react'

interface SuccessModalProps {
  title: string
  children: ReactNode
  onClose: () => void
}

export default function SuccessModal({ title, children, onClose }: SuccessModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl p-6 shadow-lg max-w-md w-full animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
