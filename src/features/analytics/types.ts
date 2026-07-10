export interface AnalyticsMetric {
  id: string
  label: string
  value: string
  change: number
  icon: string
}

export interface AnalyticsData {
  pageViews: { label: string; value: number }[]
  trafficSource: { source: string; percentage: number; color: string }[]
  metrics: AnalyticsMetric[]
}
