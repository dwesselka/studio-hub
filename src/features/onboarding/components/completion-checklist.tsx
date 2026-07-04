import { CheckCircle2, Circle } from 'lucide-react'
import type { OnboardingProgress } from '@/features/onboarding/types'
import { calculateProgress } from '@/features/onboarding/db'

interface CompletionChecklistProps {
  progress: OnboardingProgress
}

const ITEMS: { key: keyof OnboardingProgress; label: string }[] = [
  { key: 'accountCreated', label: 'Conta criada' },
  { key: 'businessDataComplete', label: 'Dados do negócio' },
  { key: 'hoursConfigured', label: 'Horários configurados' },
  { key: 'servicesReviewed', label: 'Serviços definidos' },
  { key: 'teamAdded', label: 'Equipe cadastrada' },
]

export function CompletionChecklist({ progress }: CompletionChecklistProps) {
  const percent = calculateProgress(progress)

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Progresso do perfil</h3>
        <span className="text-sm font-bold text-primary">{percent}%</span>
      </div>

      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <ul className="space-y-1.5">
        {ITEMS.map((item) => {
          const done = progress[item.key]
          return (
            <li key={item.key} className="flex items-center gap-2 text-sm">
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className={done ? 'text-foreground' : 'text-muted-foreground'}>
                {item.label}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
