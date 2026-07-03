import { motion } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Scissors,
  AlertCircle,
  Calendar,
  MoreHorizontal,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import type { Appointment, AppointmentStatus } from '@/features/agenda/types'
import { STATUS_LABELS } from '@/features/agenda/types'

interface AppointmentCardProps {
  appointment: Appointment
  onConfirm?: (id: string) => void
  onCancel?: (id: string) => void
  onMarkNoShow?: (id: string) => void
  onReschedule?: (appointment: Appointment) => void
  index?: number
}

const statusConfig: Record<
  AppointmentStatus,
  { variant: 'success' | 'warning' | 'destructive' | 'secondary'; icon: typeof Clock }
> = {
  confirmed: { variant: 'success', icon: CheckCircle2 },
  pending: { variant: 'warning', icon: Clock },
  cancelled: { variant: 'destructive', icon: XCircle },
  'no-show': { variant: 'secondary', icon: AlertCircle },
}

export function AppointmentCard({
  appointment,
  onConfirm,
  onCancel,
  onMarkNoShow,
  onReschedule,
  index = 0,
}: AppointmentCardProps) {
  const { transition } = useMotionConfig()
  const config = statusConfig[appointment.status]
  const StatusIcon = config.icon

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ ...transition, delay: index * 0.04 }}
      className="group rounded-lg border border-border bg-card p-3 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              appointment.status === 'confirmed'
                ? 'bg-success/15 text-success'
                : appointment.status === 'cancelled'
                  ? 'bg-destructive/15 text-destructive'
                  : appointment.status === 'no-show'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-warning/15 text-warning'
            }`}
          >
            <StatusIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {appointment.startTime}
              </span>
              <span className="text-xs text-muted-foreground">— {appointment.endTime}</span>
              <Badge
                variant={statusConfig[appointment.status].variant}
                className="text-[10px] px-1.5 py-0"
              >
                {STATUS_LABELS[appointment.status]}
              </Badge>
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate font-medium">{appointment.clientName}</span>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Scissors className="h-3 w-3 shrink-0" />
              <span className="truncate">{appointment.serviceName}</span>
              <span className="tabular-nums">({appointment.serviceDuration}min)</span>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3 shrink-0" />
              <span>{appointment.professionalName}</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Ações"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {appointment.status === 'pending' && (
              <DropdownMenuItem onClick={() => onConfirm?.(appointment.id)}>
                <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
                Confirmar
              </DropdownMenuItem>
            )}
            {appointment.status !== 'cancelled' && appointment.status !== 'no-show' && (
              <>
                <DropdownMenuItem onClick={() => onReschedule?.(appointment)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Reagendar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMarkNoShow?.(appointment.id)}>
                  <AlertCircle className="mr-2 h-4 w-4 text-warning" />
                  Não compareceu
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onCancel?.(appointment.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}
