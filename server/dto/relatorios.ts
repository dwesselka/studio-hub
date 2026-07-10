export interface ReportKPIsResponse {
  occupancyRate: number
  totalRevenue: number
  averageTicket: number
  retentionRate: number
  noShowRate: number
  cancellationRate: number
  totalAppointments: number
  completedAtendimentos: number
  recurringClients: number
  newClients: number
  revenueByProfessional: { name: string; total: number }[]
  revenueByService: { name: string; total: number }[]
  occupancyByDay: { date: string; rate: number; appointments: number; available: number }[]
  revenueByDay: { date: string; total: number }[]
}

export interface AIRecommendationResponse {
  id: string
  type: 'opportunity' | 'warning' | 'insight'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
}
