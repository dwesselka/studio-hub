import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido').toLowerCase().trim(),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
})

export const signupSchema = z.object({
  email: z.string().email('E-mail inválido').toLowerCase().trim(),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
  name: z.string().min(1, 'Nome é obrigatório').trim(),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type RefreshInput = z.infer<typeof refreshSchema>
