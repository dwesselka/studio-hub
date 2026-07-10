import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, XCircle, CheckCircle, Clock } from 'lucide-react'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { apiClient } from '@/lib/api'

interface Agendamento {
  id: string
  date: string
  startTime: string
  endTime: string
  serviceName: string
  servicePrice: number
  professionalName: string
  status: string
}

export function ClientAgendamentos() {
  const { transition } = useMotionConfig()
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = () => {
    setLoading(true)
    apiClient.get<Agendamento[]>('/v1/cliente/agendamentos').then((res) => {
      setAgendamentos(res.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    let cancelled = false
    apiClient
      .get<Agendamento[]>('/v1/cliente/agendamentos')
      .then((res) => {
        if (!cancelled) setAgendamentos(res.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const cancelar = async (id: string) => {
    try {
      await apiClient.patch(`/v1/cliente/agendamentos/${id}/cancelar`)
      fetch()
    } catch {
      fetch()
    }
  }

  const statusIcon = (s: string) => {
    if (s === 'confirmed') return <CheckCircle className="h-4 w-4 text-emerald-500" />
    if (s === 'pending') return <Clock className="h-4 w-4 text-amber-500" />
    return <XCircle className="h-4 w-4 text-muted-foreground" />
  }

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      completed: 'Realizado',
    }
    return map[s] || s
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={transition}
      className="space-y-6 p-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Meus Agendamentos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Histórico completo de agendamentos</p>
      </div>

      {agendamentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Nenhum agendamento encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {agendamentos.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between"
            >
              <div className="flex items-start gap-3">
                {statusIcon(a.status)}
                <div>
                  <p className="font-medium text-foreground">{a.serviceName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.date).toLocaleDateString('pt-BR')} às {a.startTime}
                    {a.professionalName && ` — ${a.professionalName}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {statusLabel(a.status)}
                    {a.servicePrice ? ` — R$ ${(a.servicePrice / 100).toFixed(2)}` : ''}
                  </p>
                </div>
              </div>
              {a.status === 'pending' && (
                <button
                  onClick={() => cancelar(a.id)}
                  className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
