interface LoadingSpinnerProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}

export function LoadingSpinner({ label = 'Carregando...', size = 'md' }: LoadingSpinnerProps) {
  return (
    <div
      className="flex min-h-svh items-center justify-center bg-background"
      role="status"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={`flex ${sizeMap[size]} items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground animate-pulse`}
        >
          IP
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
