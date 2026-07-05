import { z } from 'zod'
import { dateString } from './common'

export const dashboardPeriodQuery = z.object({
  startDate: dateString.optional(),
  endDate: dateString.optional(),
})

export const reportPeriodQuery = z.object({
  key: z.enum(['today', 'week', 'month', 'custom']).default('month'),
  startDate: dateString.optional(),
  endDate: dateString.optional(),
})

export type DashboardPeriodInput = z.infer<typeof dashboardPeriodQuery>
export type ReportPeriodInput = z.infer<typeof reportPeriodQuery>
