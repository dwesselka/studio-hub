import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  CalendarX,
  Percent,
  Download,
  Lightbulb,
  AlertTriangle,
  Info,
  ArrowUpRight,
} from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { useMotionConfig, fadeInUp } from '@/lib/motion'
import { ErrorState, OfflineState } from '@/components/ui/state-panel'
import { useReportData } from '@/features/relatorios/hooks/use-relatorios-data'
import { exportToCSV } from '@/lib/relatorios-db'
import type { PeriodKey, AIRecommendation } from '@/features/relatorios/types'

const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: 'today', label: 'Hoje' },
  { key: 'week', label: 'Esta Semana' },
  { key: 'month', label: 'Este Mês' },
  { key: 'custom', label: 'Personalizado' },
]

function formatCurrency(value: number): string {
  return `R$ ${(value / 100).toFixed(2)}`
}

export function RelatoriosPage() {
  const online = useOnlineStatus()
  const { transition } = useMotionConfig()

  const [period, setPeriod] = useState<PeriodKey>('month')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const periodLabel = PERIOD_OPTIONS.find((o) => o.key === period)?.label ?? ''

  const { data, isLoading, isError, refetch } = useReportData(period, customStart, customEnd)

  const kpis = data?.kpis
  const recommendations = data?.recommendations

  function handleExport() {
    if (!kpis) return
    exportToCSV(kpis, periodLabel)
  }

  if (!online) return <OfflineState />
  if (isError) return <ErrorState onRetry={() => refetch()} />

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Relatórios</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Métricas e desempenho do seu negócio
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={!kpis}
          className="btn btn--primary btn--lg gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setPeriod(opt.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              period === opt.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
        {period === 'custom' && (
          <div className="flex items-center gap-2 ml-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="text-xs text-muted-foreground">até</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : kpis ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KpiCard
              icon={DollarSign}
              label="Receita Total"
              value={formatCurrency(kpis.totalRevenue)}
              color="primary"
            />
            <KpiCard
              icon={TrendingUp}
              label="Ticket Médio"
              value={formatCurrency(kpis.averageTicket)}
              color="success"
            />
            <KpiCard
              icon={BarChart3}
              label="Ocupação"
              value={`${kpis.occupancyRate}%`}
              color="warning"
            />
            <KpiCard
              icon={Users}
              label="Retenção"
              value={`${kpis.retentionRate}%`}
              color="info"
            />
            <KpiCard
              icon={CalendarX}
              label="No-show"
              value={`${kpis.noShowRate}%`}
              color={kpis.noShowRate > 15 ? 'destructive' : 'secondary'}
            />
            <KpiCard
              icon={Percent}
              label="Cancelamentos"
              value={`${kpis.cancellationRate}%`}
              color={kpis.cancellationRate > 10 ? 'destructive' : 'secondary'}
            />
            <KpiCard
              icon={Users}
              label="Recorrentes"
              value={String(kpis.recurringClients)}
              color="success"
            />
            <KpiCard
              icon={Users}
              label="Novos Clientes"
              value={String(kpis.newClients)}
              color="primary"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 shadow-card">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Receita por Dia
                </h3>
                <TrendChart
                  data={kpis.revenueByDay.map((d) => ({
                    label: new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short',
                    }),
                    value: d.total,
                    formatted: formatCurrency(d.total),
                  }))}
                  maxRef={Math.max(...kpis.revenueByDay.map((d) => d.total), 1)}
                />
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-card">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  Ocupação por Dia
                </h3>
                <TrendChart
                  data={kpis.occupancyByDay.map((d) => ({
                    label: new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short',
                    }),
                    value: d.rate,
                    formatted: `${d.rate}% (${d.appointments}/${d.available})`,
                  }))}
                  maxRef={100}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 shadow-card">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                  Recomendações da IA
                </h3>
                {recommendations && recommendations.length > 0 ? (
                  <div className="space-y-2">
                    {recommendations.map((rec) => (
                      <RecommendationCard key={rec.id} rec={rec} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Info className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Dados insuficientes para gerar recomendações.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-card">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Receita por Profissional
                </h3>
                <HorizontalBarChart
                  data={kpis.revenueByProfessional.map((r) => ({
                    label: r.name,
                    value: r.total,
                    formatted: formatCurrency(r.total),
                  }))}
                />
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-card">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Receita por Serviço
                </h3>
                <HorizontalBarChart
                  data={kpis.revenueByService.map((r) => ({
                    label: r.name,
                    value: r.total,
                    formatted: formatCurrency(r.total),
                  }))}
                />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </motion.div>
  )
}

interface KpiCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'secondary'
}

const colorMap: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning-foreground',
  destructive: 'bg-destructive/10 text-destructive',
  info: 'bg-sky-500/10 text-sky-500',
  secondary: 'bg-muted text-muted-foreground',
}

function KpiCard({ icon: Icon, label, value, color }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold text-foreground truncate">{value}</p>
          <p className="text-[11px] text-muted-foreground truncate">{label}</p>
        </div>
      </div>
    </div>
  )
}

interface TrendChartProps {
  data: { label: string; value: number; formatted: string }[]
  maxRef: number
}

function TrendChart({ data, maxRef }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
        Sem dados no período
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {data.map((d) => {
        const pct = maxRef > 0 ? Math.round((d.value / maxRef) * 100) : 0
        return (
          <div key={d.label} className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-muted-foreground shrink-0 text-right">
              {d.label}
            </span>
            <div className="flex-1 h-5 rounded bg-muted overflow-hidden">
              <div
                className="h-full rounded bg-primary transition-all duration-500"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
            <span className="w-20 text-[10px] text-foreground font-medium text-right shrink-0">
              {d.formatted}
            </span>
          </div>
        )
      })}
    </div>
  )
}

interface BarChartData {
  label: string
  value: number
  formatted: string
}

function HorizontalBarChart({ data }: { data: BarChartData[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
        Sem dados
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {data.map((d) => {
        const pct = Math.round((d.value / max) * 100)
        return (
          <div key={d.label}>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-foreground truncate">{d.label}</span>
              <span className="text-muted-foreground font-medium shrink-0 ml-2">{d.formatted}</span>
            </div>
            <div className="h-3 rounded bg-muted overflow-hidden">
              <div
                className="h-full rounded bg-primary/70 transition-all duration-500"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const recIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  opportunity: ArrowUpRight,
  warning: AlertTriangle,
  insight: Info,
}

const recColors: Record<string, string> = {
  opportunity: 'border-l-success',
  warning: 'border-l-destructive',
  insight: 'border-l-primary',
}

function RecommendationCard({ rec }: { rec: AIRecommendation }) {
  const Icon = recIcons[rec.type]
  return (
    <div
      className={`rounded-lg border border-border bg-card p-3 border-l-4 ${recColors[rec.type]}`}
    >
      <div className="flex items-start gap-2">
        <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground">{rec.title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{rec.description}</p>
        </div>
      </div>
    </div>
  )
}
