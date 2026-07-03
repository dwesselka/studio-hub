import { memo } from 'react'
import { motion } from 'framer-motion'
import { Activity, CalendarPlus, UserPlus, FileBarChart, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { quickActions } from '@/features/dashboard/data'
import { fadeInUp, useMotionConfig } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { PlatformStatus } from '@/types'

const actionIcons = {
  CalendarPlus,
  UserPlus,
  FileBarChart,
}

interface DashboardHeroProps {
  greeting: string
  status: PlatformStatus
  loading?: boolean
}

export const DashboardHero = memo(function DashboardHero({
  greeting,
  status,
  loading,
}: DashboardHeroProps) {
  const { transition } = useMotionConfig()

  if (loading) {
    return (
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-background px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-80 max-w-full" />
          <Skeleton className="h-5 w-96 max-w-full" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </section>
    )
  }

  const statusColors = {
    operational: 'text-success',
    degraded: 'text-warning',
    offline: 'text-destructive',
  }

  return (
    <section
      className="border-b bg-gradient-to-br from-primary/5 via-background to-background px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
      aria-labelledby="dashboard-hero-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{greeting}, Maria</p>
          <h1
            id="dashboard-hero-title"
            className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
          >
            Visão geral do seu negócio
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Acompanhe métricas, agendamentos e desempenho da sua operação em tempo real.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            {quickActions.map((action, index) => {
              const Icon = actionIcons[action.icon as keyof typeof actionIcons] ?? CalendarPlus
              return (
                <motion.div
                  key={action.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ ...transition, delay: 0.1 + index * 0.05 }}
                >
                  <Button variant={action.variant} size={index === 0 ? 'default' : 'sm'}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{action.label}</span>
                    <span className="sm:hidden">{action.label.split(' ')[0]}</span>
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.aside
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...transition, delay: 0.2 }}
          className="w-full shrink-0 lg:max-w-sm"
          aria-label="Status da plataforma"
        >
          <div className="rounded-xl border bg-card p-4 shadow-card sm:p-5">
            <div className="flex items-center gap-2">
              <Activity className={cn('h-4 w-4', statusColors[status.status])} aria-hidden="true" />
              <span className="text-sm font-semibold">Status da plataforma</span>
              <Badge variant="success" className="ml-auto">
                Online
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{status.label}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs text-muted-foreground">Uptime</dt>
                <dd className="text-sm font-semibold">{status.uptime}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Último incidente</dt>
                <dd className="text-sm font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                  <span className="truncate">Nenhum</span>
                </dd>
              </div>
            </dl>
          </div>
        </motion.aside>
      </motion.div>
    </section>
  )
})
