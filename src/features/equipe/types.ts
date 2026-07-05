export interface Membro {
  id: string
  name: string
  role: string
  phone: string
  email: string
  active: boolean
  commission?: number
  specialties?: string[]
  photo?: string
}
