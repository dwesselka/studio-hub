import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange } from 'lucide-react'
import type { CalendarView } from '@/features/agenda/types'
import { formatDateFull } from '@/features/agenda/types'

interface CalendarHeaderProps {
  currentDate: string
  view: CalendarView
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onViewChange: (view: CalendarView) => void
}

export function CalendarHeader({
  currentDate,
  view,
  onPrev,
  onNext,
  onToday,
  onViewChange,
}: CalendarHeaderProps) {
  const isToday = currentDate === new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Próximo"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-bold text-foreground ml-1">{formatDateFull(currentDate)}</h2>

        {!isToday && (
          <button onClick={onToday} className="btn btn--sm btn--outline text-xs">
            Hoje
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
        <button
          onClick={() => onViewChange('day')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            view === 'day'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          <span className="hidden sm:inline">Dia</span>
        </button>
        <button
          onClick={() => onViewChange('week')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            view === 'week'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <CalendarRange className="h-4 w-4" />
          <span className="hidden sm:inline">Semana</span>
        </button>
      </div>
    </div>
  )
}
