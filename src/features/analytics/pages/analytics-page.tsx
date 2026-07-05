import { motion } from 'framer-motion'
import { Eye, UserPlus, TrendingUp, ArrowRightLeft, Globe } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { OfflineState } from '@/components/ui/state-panel'
import { useAnalyticsData } from '../hooks/use-analytics-data'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye,
  UserPlus,
  TrendingUp,
  ArrowRightLeft,
}

export function AnalyticsPage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()
  const { data } = useAnalyticsData()

  if (!online) return <OfflineState />

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={transition}
      className="space-y-6 p-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Métricas de marketing e presença digital
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data.metrics.map((m) => {
          const Icon = iconMap[m.icon] ?? Eye
          return (
            <div key={m.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-foreground truncate">{m.value}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{m.label}</p>
                </div>
              </div>
              <div
                className={`mt-2 text-[11px] font-medium ${m.change >= 0 ? 'text-success' : 'text-destructive'}`}
              >
                {m.change >= 0 ? '↑' : '↓'} {Math.abs(m.change)}%
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            Visualizações por Dia
          </h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {data.pageViews.map((day) => {
              const max = Math.max(...data.pageViews.map((d) => d.value))
              const height = (day.value / max) * 100
              return (
                <div
                  key={day.label}
                  className="flex flex-1 flex-col items-center gap-1 h-full justify-end"
                >
                  <div
                    className="w-full rounded-sm bg-primary transition-all hover:bg-primary/80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{day.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            Origem do Tráfego
          </h3>
          <div className="space-y-4">
            {data.trafficSource.map((src) => (
              <div key={src.source}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground">{src.source}</span>
                  <span className="text-muted-foreground font-medium">{src.percentage}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${src.color}`}
                    style={{ width: `${src.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
