import { z } from 'zod'
import { timeString, phoneString, emailString } from './common'
import { dayHoursSchema } from './onboarding'

export const updateConfigSchema = z.object({
  businessName: z.string().min(1).optional(),
  businessPhone: phoneString.optional(),
  businessEmail: emailString.optional(),
  businessAddress: z.string().optional(),
  openingHours: z.array(dayHoursSchema).length(7).optional(),
  defaultAppointmentDuration: z.number().int().positive().optional(),
  allowOnlineBooking: z.boolean().optional(),
  sendReminders: z.boolean().optional(),
  reminderHoursBefore: z.number().int().positive().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
})

export type UpdateConfigInput = z.infer<typeof updateConfigSchema>
