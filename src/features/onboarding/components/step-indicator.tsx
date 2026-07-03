interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="w-full" role="navigation" aria-label="Progresso do cadastro">
      <div className="flex items-center justify-between mb-2">
        {labels.map((label, i) => {
          const isActive = i === currentStep
          const isCompleted = i < currentStep
          const stepNum = i + 1
          return (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isActive
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                        : 'bg-muted text-muted-foreground'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`mt-1 text-xs font-medium hidden sm:block ${
                    isActive
                      ? 'text-primary'
                      : isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`mx-2 flex-1 h-0.5 rounded transition-colors ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
