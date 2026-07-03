import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  CalendarCheck,
  Users,
  Heart,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { fadeInUp, useMotionConfig } from '@/lib/motion'
import { cn, formatPercent } from '@/lib/utils'
import type { MetricCardData } from '@/types'

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  CalendarCheck,
  Users,
  Heart,
}

interface MetricCardProps {
  data: MetricCardData
  index?: number
}

export const MetricCard = memo(function MetricCard({ data, index = 0 }: MetricCardProps) {
  const { transition, hover, tap } = useMotionConfig()
  const Icon = iconMap[data.icon] ?? TrendingUp
  const isPositive = data.trend >= 0

  return (
    <motion.article
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ ...transition, delay: index * 0.06 }}
      whileHover={hover}
      whileTap={tap}
    >
      <Card className="group relative overflow-hidden border-border/60 hover:border-border hover:shadow-card-hover">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            {data.badge && (
              <Badge variant={data.trend < 0 ? 'warning' : 'success'} className="shrink-0">
                {data.badge}
              </Badge>
            )}
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{data.title}</p>
            <p
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              aria-label={`${data.title}: ${data.value}`}
            >
              {data.value}
            </p>
            <p className="text-xs text-muted-foreground">{data.description}</p>
          </div>

          <div className="mt-4 flex items-center gap-1.5">
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
            )}
            <span
              className={cn(
                'text-xs font-medium',
                isPositive ? 'text-success' : 'text-destructive',
              )}
            >
              {isPositive ? '+' : ''}
              {formatPercent(Math.abs(data.trend))}
            </span>
            <span className="text-xs text-muted-foreground">{data.trendLabel}</span>
          </div>
        </CardContent>
      </Card>
    </motion.article>
  )
})

export function MetricCardSkeleton() {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="mt-4 h-4 w-28" />
      </CardContent>
    </Card>
  )
}
