import { z } from 'zod'
import { phoneString, emailString, nonEmptyString } from './common'

export const createTeamMemberSchema = z.object({
  name: nonEmptyString,
  role: nonEmptyString,
  phone: phoneString,
  email: emailString,
  active: z.boolean().default(true),
  commission: z.number().int().min(0).max(100).optional(),
  specialties: z.array(z.string()).optional(),
  photo: z.string().optional(),
})

export const updateTeamMemberSchema = createTeamMemberSchema.partial()

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>
