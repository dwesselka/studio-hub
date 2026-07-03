import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { ErrorState, OfflineState } from '@/components/ui/state-panel'
import { CalendarHeader } from '@/features/agenda/components/calendar-header'
import { TimeLine } from '@/features/agenda/components/time-line'
import { AppointmentList } from '@/features/agenda/components/appointment-list'
import { NewAppointmentDialog } from '@/features/agenda/components/new-appointment-dialog'
import {
  useAgendaData,
  useConfirmAppointment,
  useCancelAppointment,
  useMarkNoShow,
} from '@/features/agenda/hooks/use-agenda-data'
import type { CalendarView, AppointmentStatus } from '@/features/agenda/types'
import { getDateString, addDays } from '@/features/agenda/types'

export function AgendaPage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()

  const [currentDate, setCurrentDate] = useState(getDateString())
  const [view, setView] = useState<CalendarView>('day')
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const filters = { date: currentDate, view, status: statusFilter }
  const { data: appointments = [], isLoading, isError, refetch } = useAgendaData(filters)
  const confirmMutation = useConfirmAppointment()
  const cancelMutation = useCancelAppointment()
  const noShowMutation = useMarkNoShow()

  const handlePrev = useCallback(() => {
    setCurrentDate((d) => addDays(d, -1))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentDate((d) => addDays(d, 1))
  }, [])

  const handleToday = useCallback(() => {
    setCurrentDate(getDateString())
  }, [])

  const handleViewChange = useCallback((newView: CalendarView) => {
    setView(newView)
  }, [])

  const handleConfirm = useCallback(
    (id: string) => {
      confirmMutation.mutate(id)
    },
    [confirmMutation],
  )

  const handleCancel = useCallback(
    (id: string) => {
      cancelMutation.mutate(id)
    },
    [cancelMutation],
  )

  const handleMarkNoShow = useCallback(
    (id: string) => {
      noShowMutation.mutate(id)
    },
    [noShowMutation],
  )

  const handleReschedule = useCallback(() => {
    setDialogOpen(true)
  }, [])

  if (!online) {
    return <OfflineState />
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={transition}
      className="space-y-6 p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Agendamentos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie os agendamentos do seu negócio
          </p>
        </div>
        <button onClick={() => setDialogOpen(true)} className="btn btn--primary btn--lg gap-2">
          <Plus className="h-5 w-5" />
          Novo Agendamento
        </button>
      </div>

      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <TimeLine appointments={appointments} date={currentDate} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Lista de Agendamentos</h3>
            <AppointmentList
              appointments={appointments}
              isLoading={isLoading}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onMarkNoShow={handleMarkNoShow}
              onReschedule={handleReschedule}
            />
          </div>
        </div>
      </div>

      <NewAppointmentDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedDate={currentDate}
      />
    </motion.div>
  )
}
