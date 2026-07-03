import { useQuery } from '@tanstack/react-query'
import { dashboardMetrics, platformStatus } from '../data'
import type { MetricCardData, PlatformStatus } from '@/types'

interface DashboardData {
  metrics: MetricCardData[]
  status: PlatformStatus
  greeting: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

async function fetchDashboardData(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    metrics: dashboardMetrics,
    status: platformStatus,
    greeting: getGreeting(),
  }
}

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  })
}
