import { z } from 'zod'
import { dateString, timeString, phoneString, emailString, nonEmptyString } from './common'

export const appointmentStatusEnum = z.enum(['pending', 'confirmed', 'cancelled', 'no-show'])

export const createAppointmentSchema = z.object({
  clientName: nonEmptyString,
  clientPhone: phoneString,
  clientEmail: emailString.optional(),
  serviceId: z.string().uuid(),
  serviceName: nonEmptyString,
  serviceDuration: z.number().int().positive(),
  servicePrice: z.number().int().nonnegative(),
  professionalId: z.string().uuid(),
  professionalName: nonEmptyString,
  date: dateString,
  startTime: timeString,
  endTime: timeString,
  notes: z.string().optional(),
})

export const updateAppointmentSchema = createAppointmentSchema.partial()

export const agendaFiltersQuery = z.object({
  date: dateString.optional(),
  view: z.enum(['day', 'week']).optional(),
  professionalId: z.string().uuid().optional(),
  status: appointmentStatusEnum.or(z.literal('all')).optional(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(50),
})

export const dateParam = z.object({
  date: dateString,
})

export const dateRangeQuery = z.object({
  startDate: dateString,
  endDate: dateString,
})

export const rescheduleSchema = z.object({
  date: dateString,
  startTime: timeString,
  endTime: timeString,
})

export const conflictCheckQuery = z.object({
  professionalId: z.string().uuid(),
  date: dateString,
  startTime: timeString,
  endTime: timeString,
  excludeId: z.string().uuid().optional(),
})

export const suggestionsQuery = z.object({
  date: dateString,
  professionalId: z.string().uuid().optional(),
  serviceDuration: z.coerce.number().int().positive().default(60),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>
export type RescheduleInput = z.infer<typeof rescheduleSchema>
