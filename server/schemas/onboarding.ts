import { z } from 'zod'
import { timeString, phoneString, nonEmptyString } from './common'

export const businessDataSchema = z.object({
  nome: nonEmptyString,
  segmento: z.enum(['salao', 'barbearia', 'autonomo', 'clinica']),
  endereco: nonEmptyString,
  telefone: phoneString,
  logo: z.string().optional(),
})

export const dayHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  isOpen: z.boolean(),
  openTime: timeString,
  closeTime: timeString,
})

export const hoursSchema = z.array(dayHoursSchema).length(7, 'Deve conter horários para os 7 dias da semana')

export const serviceItemSchema = z.object({
  name: nonEmptyString,
  duration: z.number().int().positive('Duração deve ser positiva'),
  price: z.number().int().nonnegative('Preço deve ser não negativo'),
  category: nonEmptyString,
})

export const servicesSchema = z.array(serviceItemSchema).min(1, 'Pelo menos um serviço é obrigatório')

export const teamMemberSchema = z.object({
  name: nonEmptyString,
  role: nonEmptyString,
  phone: phoneString,
  email: z.string().email('E-mail inválido').toLowerCase().trim(),
})

export const teamSchema = z.array(teamMemberSchema)

export const onboardingCompleteSchema = z.object({
  completed: z.literal(true),
})

export type BusinessDataInput = z.infer<typeof businessDataSchema>
export type DayHoursInput = z.infer<typeof dayHoursSchema>
export type ServiceItemInput = z.infer<typeof serviceItemSchema>
export type TeamMemberInput = z.infer<typeof teamMemberSchema>
