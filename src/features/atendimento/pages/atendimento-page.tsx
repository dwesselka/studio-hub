import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, User, Scissors, Search, Calendar } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { ErrorState, OfflineState } from '@/components/ui/state-panel'
import { getTodayAppointments, getAppointmentsByDate } from '@/lib/agenda-db'
import { useAtendimentos } from '@/features/atendimento/hooks/use-atendimento-data'
import { AtendimentoFlow } from '@/features/atendimento/components/atendimento-flow'
import { AtendimentoCard } from '@/features/atendimento/components/atendimento-card'
import { getDateString, addDays, formatDate } from '@/features/agenda/types'
import type { Appointment } from '@/features/agenda/types'
import type { Atendimento } from '@/features/atendimento/types'

export function AtendimentoPage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()

  const [currentDate, setCurrentDate] = useState(getDateString())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const appointments = useMemo(() => {
    const all = currentDate === getDateString()
      ? getTodayAppointments()
      : getAppointmentsByDate(currentDate)
    return all
      .filter((a) => a.status === 'confirmed' || a.status === 'pending')
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [currentDate])

  const { data: atendimentos = [], isError, refetch } = useAtendimentos(currentDate)

  const existingAtendimentos = useMemo(() => {
    const map = new Map<string, Atendimento>()
    for (const a of atendimentos) {
      map.set(a.appointmentId, a)
    }
    return map
  }, [atendimentos])

  const pendingAppointments = useMemo(() => {
    return appointments.filter((a) => !existingAtendimentos.has(a.id))
  }, [appointments, existingAtendimentos])

  const filteredAppointments = useMemo(() => {
    if (!searchTerm) return pendingAppointments
    const q = searchTerm.toLowerCase()
    return pendingAppointments.filter(
      (a) =>
        a.clientName.toLowerCase().includes(q) ||
        a.serviceName.toLowerCase().includes(q),
    )
  }, [pendingAppointments, searchTerm])

  const existingAtendimentoForSelected = selectedAppointment
    ? existingAtendimentos.get(selectedAppointment.id) ?? null
    : null

  const handleStart = (apt: Appointment) => {
    setSelectedAppointment(apt)
  }

  const handleClose = () => {
    setSelectedAppointment(null)
    refetch()
  }

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Atendimento</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Registre os serviços realizados e insumos consumidos
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentDate((d) => addDays(d, -1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
          aria-label="Dia anterior"
        >
          ←
        </button>
        <span className="text-sm font-medium text-foreground min-w-[180px] text-center">
          {formatDate(currentDate)}
        </span>
        <button
          onClick={() => setCurrentDate((d) => addDays(d, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
          aria-label="Próximo dia"
        >
          →
        </button>
        {currentDate !== getDateString() && (
          <button
            onClick={() => setCurrentDate(getDateString())}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            Hoje
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            {selectedAppointment ? (
              <AtendimentoFlow
                appointment={selectedAppointment}
                onClose={handleClose}
                onSuccess={() => {
                  setSelectedAppointment(null)
                  refetch()
                }}
                existingAtendimento={existingAtendimentoForSelected}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar por cliente ou serviço..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Agendamentos do dia
                    {filteredAppointments.length > 0 && (
                      <span className="text-xs text-muted-foreground font-normal">
                        ({filteredAppointments.length} pendentes)
                      </span>
                    )}
                  </h3>

                  {filteredAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Clock className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-sm font-medium text-foreground">
                        Nenhum agendamento pendente
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Todos os agendamentos já foram atendidos ou não há agendamentos para esta data.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                      {filteredAppointments.map((apt, i) => (
                        <motion.div
                          key={apt.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="rounded-lg border border-border bg-card hover:border-primary/30 transition-colors cursor-pointer"
                          onClick={() => handleStart(apt)}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1 min-w-0 flex-1">
                                <span className="text-sm font-semibold text-foreground block truncate">
                                  {apt.clientName}
                                </span>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {apt.startTime} — {apt.endTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {apt.professionalName}
                                  </span>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary mt-1">
                                  <Scissors className="h-3 w-3" />
                                  {apt.serviceName}
                                </span>
                              </div>
                              <span className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                                Iniciar
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Atendimentos do dia
              </h3>
              {atendimentos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Scissors className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Nenhum atendimento registrado</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {atendimentos.map((a, i) => (
                    <AtendimentoCard
                      key={a.id}
                      atendimento={a}
                      index={i}
                      onComplete={() => refetch()}
                      onCancel={() => refetch()}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
