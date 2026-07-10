import { z } from 'zod'

export const paymentMethodEnum = z.enum(['pix', 'credit', 'debit', 'cash'])
export const paymentStatusEnum = z.enum(['paid', 'pending', 'refunded', 'partially-paid'])

export const createPaymentSchema = z.object({
  atendimentoId: z.string().uuid(),
  clientName: z.string().min(1),
  clientPhone: z.string().min(1),
  professionalName: z.string().min(1),
  serviceNames: z.array(z.string()).min(1),
  date: z.string(),
  totalValue: z.number().int().nonnegative(),
  method: paymentMethodEnum,
  status: paymentStatusEnum.default('pending'),
  paidValue: z.number().int().nonnegative().default(0),
  feeValue: z.number().int().nonnegative().default(0),
  netValue: z.number().int().nonnegative().default(0),
})

export const updatePaymentSchema = z.object({
  method: paymentMethodEnum.optional(),
  status: paymentStatusEnum.optional(),
  paidValue: z.number().int().nonnegative().optional(),
  feeValue: z.number().int().nonnegative().optional(),
  netValue: z.number().int().nonnegative().optional(),
  pixQrCode: z.string().optional(),
  pixCopyPaste: z.string().optional(),
  receiptNumber: z.string().optional(),
})

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>
