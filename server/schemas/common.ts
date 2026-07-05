import { z } from 'zod'

export const uuidParam = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
})

export const userIdParam = z.object({
  userId: z.string().uuid('ID do usuário deve ser um UUID válido'),
})

export const paginationQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(50),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
})

export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')

export const timeString = z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM')

export const phoneString = z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Telefone inválido')

export const emailString = z.string().email('E-mail inválido').toLowerCase().trim()

export const nonEmptyString = z.string().min(1, 'Campo obrigatório').trim()
