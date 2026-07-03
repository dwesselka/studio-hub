import { memo, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import { DashboardHero } from '@/features/dashboard/components/dashboard-hero'
import { MetricCard, MetricCardSkeleton } from '@/features/dashboard/components/metric-card'
import { useDashboardData } from '@/features/dashboard/hooks/use-dashboard-data'
import { ErrorState, EmptyState, OfflineState } from '@/components/ui/state-panel'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { staggerContainer } from '@/lib/motion'
import { Badge } from '@/components/ui/badge'

function DashboardContent() {
  const online = useOnlineStatus()
  const { data, isLoading, isError, refetch, isFetching } = useDashboardData()

  if (!online && !data) {
    return (
      <section className="p-4 sm:p-6 lg:p-8">
        <OfflineState />
      </section>
    )
  }

  return (
    <>
      <DashboardHero
        greeting={data?.greeting ?? ''}
        status={data?.status ?? { label: '', status: 'operational', uptime: '' }}
        loading={isLoading}
      />

      <section
        className="p-4 sm:p-6 lg:p-8"
        aria-labelledby="metrics-heading"
        aria-busy={isLoading || isFetching}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="metrics-heading" className="text-lg font-semibold tracking-tight">
            Indicadores rápidos
          </h2>
          {isFetching && !isLoading && (
            <span className="text-xs text-muted-foreground" role="status">
              Atualizando...
            </span>
          )}
        </div>

        {isError && <ErrorState onRetry={() => refetch()} />}

        {!isError && isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isError && !isLoading && data?.metrics.length === 0 && <EmptyState />}

        {!isError && !isLoading && data && data.metrics.length > 0 && (
          <motion.div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {data.metrics.map((metric, index) => (
              <MetricCard key={metric.id} data={metric} index={index} />
            ))}
          </motion.div>
        )}

        {!isLoading && data && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mt-8 grid gap-4 lg:grid-cols-3"
            aria-label="Atividades recentes"
          >
            <article className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold">Próximos agendamentos</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Hoje</p>
                </div>
                <Link
                  to="/app/agendamentos"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  Ver todos
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {data.todayAppointments.length > 0 ? (
                <ul className="space-y-2" role="list">
                  {data.todayAppointments.slice(0, 5).map((item) => (
                    <li
                      key={item.time + item.client}
                      className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                    >
                      <time className="text-sm font-mono font-medium text-primary tabular-nums">
                        {item.time}
                      </time>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.client}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.service}</p>
                      </div>
                      <Badge
                        variant={
                          item.status === 'confirmed'
                            ? 'success'
                            : item.status === 'pending'
                              ? 'warning'
                              : 'secondary'
                        }
                        className="text-[10px] px-1.5 py-0"
                      >
                        {item.status === 'confirmed'
                          ? 'Confirmado'
                          : item.status === 'pending'
                            ? 'Pendente'
                            : item.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhum agendamento para hoje</p>
                </div>
              )}
            </article>

            <article className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="text-sm font-semibold">Desempenho semanal</h3>
              <p className="mt-1 text-xs text-muted-foreground">Últimos 7 dias</p>
              <div
                className="mt-6 flex items-end justify-between gap-2"
                role="img"
                aria-label="Gráfico de barras do desempenho semanal"
              >
                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-sm bg-primary/20 transition-all hover:bg-primary/40"
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </motion.section>
        )}
      </section>
    </>
  )
}

function DashboardFallback() {
  return (
    <>
      <DashboardHero
        greeting=""
        status={{ label: '', status: 'operational', uptime: '' }}
        loading
      />
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </>
  )
}

export const DashboardPage = memo(function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent />
    </Suspense>
  )
})
