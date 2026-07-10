import { z } from 'zod'
import { phoneString, emailString, dateString, nonEmptyString } from './common'

export const clienteStatusEnum = z.enum(['ativo', 'inativo', 'novo'])

export const createClienteSchema = z.object({
  nome: nonEmptyString,
  email: emailString,
  telefone: phoneString,
  segmento: z.string().optional(),
  ultimaVisita: dateString.optional(),
  totalVisitas: z.number().int().nonnegative().default(0),
  totalGasto: z.number().int().nonnegative().default(0),
  status: clienteStatusEnum.default('novo'),
  aniversario: z.string().regex(/^\d{2}\/\d{2}$/, 'Deve estar no formato DD/MM').optional(),
})

export const updateClienteSchema = createClienteSchema.partial()

export const clienteFiltersQuery = z.object({
  status: clienteStatusEnum.or(z.literal('todos')).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(50),
})

export type CreateClienteInput = z.infer<typeof createClienteSchema>
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>
