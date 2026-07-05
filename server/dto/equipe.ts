export interface TeamMemberResponse {
  id: string
  name: string
  role: string
  phone: string
  email: string
  active: boolean
  commission: number | null
  specialties: string[]
  photo: string | null
}

export function toTeamMemberResponse(member: {
  id: string
  name: string
  role: string
  phone: string
  email: string
  active: boolean
  commission: number | null
  specialties: string[]
  photo: string | null
}): TeamMemberResponse {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    phone: member.phone,
    email: member.email,
    active: member.active,
    commission: member.commission,
    specialties: member.specialties,
    photo: member.photo,
  }
}
