import { z } from 'zod'
import { nonEmptyString } from './common'

export const atendimentoStatusEnum = z.enum(['in-progress', 'completed', 'cancelled'])

export const consumedSupplySchema = z.object({
  consumableId: z.string().uuid(),
  consumableName: nonEmptyString,
  quantity: z.number().int().positive(),
  unit: z.string(),
})

export const servicePerformedSchema = z.object({
  serviceId: z.string().uuid(),
  serviceName: nonEmptyString,
  duration: z.number().int().positive(),
  price: z.number().int().nonnegative(),
})

export const createAtendimentoSchema = z.object({
  appointmentId: z.string().uuid(),
  clientName: nonEmptyString,
  clientPhone: z.string(),
  professionalId: z.string().uuid(),
  professionalName: nonEmptyString,
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  services: z.array(servicePerformedSchema).min(1, 'Pelo menos um serviço'),
  supplies: z.array(consumedSupplySchema).default([]),
  notes: z.string().optional(),
  status: atendimentoStatusEnum.default('in-progress'),
  totalValue: z.number().int().nonnegative(),
})

export const updateAtendimentoSchema = z.object({
  endTime: z.string().optional(),
  services: z.array(servicePerformedSchema).optional(),
  supplies: z.array(consumedSupplySchema).optional(),
  notes: z.string().optional(),
  status: atendimentoStatusEnum.optional(),
  totalValue: z.number().int().nonnegative().optional(),
})

export type CreateAtendimentoInput = z.infer<typeof createAtendimentoSchema>
export type UpdateAtendimentoInput = z.infer<typeof updateAtendimentoSchema>
