import { useMemo } from 'react'
import type { Appointment } from '@/features/agenda/types'
import { User, Scissors } from 'lucide-react'

interface TimeLineProps {
  appointments: Appointment[]
  date: string
}

function getHoursRange(appointments: Appointment[]): number[] {
  if (appointments.length === 0) {
    return Array.from({ length: 13 }, (_, i) => i + 7)
  }

  const allHours = appointments.flatMap((a) => {
    const startH = parseInt(a.startTime)
    const endH = parseInt(a.endTime) + (a.endTime.endsWith(':00') ? 0 : 1)
    return [startH, endH]
  })

  const minH = Math.max(6, Math.min(...allHours) - 1)
  const maxH = Math.min(22, Math.max(...allHours) + 1)
  return Array.from({ length: maxH - minH + 1 }, (_, i) => i + minH)
}

export function TimeLine({ appointments }: TimeLineProps) {
  const hours = useMemo(() => getHoursRange(appointments), [appointments])

  const getAppointmentsForHour = (hour: number): Appointment[] => {
    return appointments.filter((a) => {
      const startH = parseInt(a.startTime)
      const endH = parseInt(a.endTime)
      return startH <= hour && endH > hour
    })
  }

  return (
    <div className="space-y-0.5">
      {hours.map((hour) => {
        const hourApps = getAppointmentsForHour(hour)
        const hasAppointments = hourApps.length > 0

        return (
          <div
            key={hour}
            className={`flex gap-3 rounded-lg p-2 min-h-[3.5rem] transition-colors ${
              hasAppointments ? 'bg-card' : 'bg-muted/20'
            }`}
          >
            <div className="w-12 shrink-0 pt-0.5 text-right">
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {String(hour).padStart(2, '0')}:00
              </span>
            </div>

            <div className="flex-1 space-y-1">
              {hourApps.map((app) => {
                const statusColors: Record<string, string> = {
                  confirmed: 'border-l-success bg-success/5',
                  pending: 'border-l-warning bg-warning/5',
                  cancelled: 'border-l-destructive bg-destructive/5 opacity-50',
                  'no-show': 'border-l-muted-foreground bg-muted/20 opacity-60',
                }

                return (
                  <div
                    key={app.id}
                    className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-md border border-border border-l-4 px-3 py-2 ${statusColors[app.status] ?? 'border-l-border'}`}
                  >
                    <span className="text-xs font-bold text-foreground tabular-nums">
                      {app.startTime}
                    </span>

                    <span className="text-sm font-medium text-foreground">{app.clientName}</span>

                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Scissors className="h-3 w-3" />
                      {app.serviceName}
                    </span>

                    <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                      <User className="h-3 w-3" />
                      {app.professionalName}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
