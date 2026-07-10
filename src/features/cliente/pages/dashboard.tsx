import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Gift, Sparkles } from 'lucide-react'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/features/auth/use-auth'

interface DashboardData {
  name: string
  nextAppointment: {
    id: string
    date: string
    startTime: string
    serviceName: string
    professionalName: string
    status: string
  } | null
  points: { balance: number; lifetime: number }
}

export function ClientDashboard() {
  const { user } = useAuth()
  const { transition } = useMotionConfig()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    apiClient
      .get<DashboardData>('/v1/cliente/dashboard')
      .then((res) => {
        if (!cancelled) setData(res.data)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Olá, {data?.name || user?.name || 'Cliente'}{' '}
          <Sparkles className="inline h-6 w-6 text-amber-400" />
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Bem-vindo ao seu portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.nextAppointment ? (
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Próximo agendamento</h2>
            </div>
            <p className="text-sm text-foreground">{data.nextAppointment.serviceName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(data.nextAppointment.date).toLocaleDateString('pt-BR')} às{' '}
              {data.nextAppointment.startTime}
            </p>
            <p className="text-xs text-muted-foreground">
              com {data.nextAppointment.professionalName}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="font-semibold text-foreground">Nenhum agendamento</h2>
                <p className="text-xs text-muted-foreground">
                  Você ainda não tem agendamentos futuros
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="h-5 w-5 text-amber-500" />
            <h2 className="font-semibold text-foreground">Fidelidade</h2>
          </div>
          <p className="text-2xl font-bold text-foreground">{data?.points.balance ?? 0}</p>
          <p className="text-xs text-muted-foreground">pontos acumulados</p>
        </div>
      </div>
    </motion.div>
  )
}
