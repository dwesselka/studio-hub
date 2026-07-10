import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, Star, History } from 'lucide-react'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { apiClient } from '@/lib/api'

interface FidelidadeData {
  points: { balance: number; lifetime: number; clientName: string }
  history: { type: string; amount: number; description: string; createdAt: string }[]
  promotions: {
    id: string
    name: string
    requiredPoints: number
    discountPercent: number
    expiresAt: string
  }[]
}

export function ClientFidelidade() {
  const { transition } = useMotionConfig()
  const [data, setData] = useState<FidelidadeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    apiClient
      .get<FidelidadeData>('/v1/cliente/fidelidade')
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Fidelidade</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Seus pontos e recompensas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <Star className="h-5 w-5 text-amber-500" />
            <h2 className="font-semibold text-foreground">Saldo</h2>
          </div>
          <p className="text-3xl font-bold text-foreground">{data?.points.balance ?? 0}</p>
          <p className="text-xs text-muted-foreground">pontos</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="h-5 w-5 text-purple-500" />
            <h2 className="font-semibold text-foreground">Total acumulado</h2>
          </div>
          <p className="text-3xl font-bold text-foreground">{data?.points.lifetime ?? 0}</p>
          <p className="text-xs text-muted-foreground">pontos ganhos</p>
        </div>
      </div>

      {data?.promotions && data.promotions.length > 0 && (
        <div>
          <h2 className="font-semibold text-foreground mb-3">Promoções disponíveis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.promotions.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <p className="font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {p.requiredPoints} pontos • {p.discountPercent}% off
                </p>
                {p.expiresAt && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Válido até {new Date(p.expiresAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.history && data.history.length > 0 && (
        <div>
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            Histórico
          </h2>
          <div className="space-y-2">
            {data.history.map((h, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-foreground">{h.description}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(h.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span
                  className={`text-sm font-bold ${h.type === 'earn' ? 'text-emerald-500' : 'text-destructive'}`}
                >
                  {h.type === 'earn' ? '+' : '-'}
                  {h.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
