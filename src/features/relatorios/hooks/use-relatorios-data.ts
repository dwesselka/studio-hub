import { useQuery } from '@tanstack/react-query'
import { computeKPIs, computeRecommendations } from '@/lib/relatorios-db'
import type { PeriodKey } from '@/features/relatorios/types'

export function useReportData(periodKey: PeriodKey, customStart?: string, customEnd?: string) {
  return useQuery({
    queryKey: ['relatorios', periodKey, customStart, customEnd],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200))
      const kpis = computeKPIs(periodKey, customStart, customEnd)
      const recommendations = computeRecommendations(kpis)
      return { kpis, recommendations } as const
    },
  })
}
