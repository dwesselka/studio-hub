import { useState } from 'react'
import { DAY_LABELS } from '@/features/onboarding/types'
import type { DayHours } from '@/features/onboarding/types'

interface StepHoursProps {
  defaultHours: DayHours[]
  onSubmit: (hours: DayHours[]) => void
  onBack: () => void
}

export function StepHours({ defaultHours, onSubmit, onBack }: StepHoursProps) {
  const [hours, setHours] = useState<DayHours[]>(
    defaultHours.length > 0
      ? defaultHours
      : [0, 1, 2, 3, 4, 5, 6].map((d) => ({
          dayOfWeek: d,
          isOpen: d !== 0,
          openTime: '08:00',
          closeTime: d === 6 ? '13:00' : '18:00',
        })),
  )

  const updateDay = (dayOfWeek: number, partial: Partial<DayHours>) => {
    setHours((prev) => prev.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, ...partial } : h)))
  }

  const toggleDay = (dayOfWeek: number) => {
    const day = hours.find((h) => h.dayOfWeek === dayOfWeek)
    if (day) {
      updateDay(dayOfWeek, { isOpen: !day.isOpen })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(hours)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Horários de funcionamento</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Defina os dias e horários de atendimento do seu negócio
        </p>
      </div>

      <div className="space-y-2">
        {hours.map((day) => (
          <div
            key={day.dayOfWeek}
            className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 transition-colors ${
              day.isOpen
                ? 'bg-card border-border'
                : 'bg-muted/30 border-dashed border-muted-foreground/30'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleDay(day.dayOfWeek)}
              className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${
                day.isOpen
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground'
              }`}
              aria-label={
                day.isOpen
                  ? `Fechar ${DAY_LABELS[day.dayOfWeek]}`
                  : `Abrir ${DAY_LABELS[day.dayOfWeek]}`
              }
            >
              {day.isOpen && (
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            <span
              className={`text-sm font-medium min-w-[7rem] ${
                day.isOpen ? 'text-foreground' : 'text-muted-foreground line-through'
              }`}
            >
              {DAY_LABELS[day.dayOfWeek]}
            </span>

            {day.isOpen && (
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="time"
                  value={day.openTime}
                  onChange={(e) => updateDay(day.dayOfWeek, { openTime: e.target.value })}
                  className="w-28 rounded border border-border bg-background px-2 py-1.5 text-sm"
                  aria-label={`Horário de abertura ${DAY_LABELS[day.dayOfWeek]}`}
                />
                <span className="text-sm text-muted-foreground">às</span>
                <input
                  type="time"
                  value={day.closeTime}
                  onChange={(e) => updateDay(day.dayOfWeek, { closeTime: e.target.value })}
                  className="w-28 rounded border border-border bg-background px-2 py-1.5 text-sm"
                  aria-label={`Horário de fechamento ${DAY_LABELS[day.dayOfWeek]}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="btn btn--outline btn--lg flex-1 justify-center"
        >
          Voltar
        </button>
        <button type="submit" className="btn btn--primary btn--lg flex-1 justify-center">
          Continuar
        </button>
      </div>
    </form>
  )
}
