export interface MetricCardResponse {
  id: string
  title: string
  description: string
  value: string
  trend: number
  trendLabel: string
  badge?: string
  icon: string
}

export interface TodayAppointmentResponse {
  time: string
  client: string
  service: string
  status: string
}

export interface DashboardMetricsResponse {
  metrics: MetricCardResponse[]
  todayAppointments: TodayAppointmentResponse[]
  greeting: string
  status: {
    label: string
    status: string
    uptime: string
    lastIncident: string
  }
}

export interface DashboardTodayResponse {
  appointments: {
    id: string
    clientName: string
    clientPhone: string
    serviceName: string
    professionalName: string
    startTime: string
    endTime: string
    status: string
  }[]
  totalAppointments: number
  confirmedCount: number
  totalRevenue: number
  occupancyRate: number
}

export interface DashboardAnalyticsResponse {
  statusDistribution: Record<string, number>
  totalAppointments: number
  totalRevenue: number
  revenueByDay: Record<string, number>
  topServices: { name: string; count: number }[]
}

export interface SystemStatusResponse {
  label: string
  status: string
  uptime: string
  lastIncident: string
  services: { name: string; status: string; latency: string }[]
}
