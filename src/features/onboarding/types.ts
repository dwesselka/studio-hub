export interface OnboardingAccount {
  email: string
  password: string
  nome: string
}

export interface BusinessData {
  nome: string
  segmento: string
  endereco: string
  telefone: string
  logo?: string
}

export interface DayHours {
  dayOfWeek: number
  isOpen: boolean
  openTime: string
  closeTime: string
}

export interface ServiceItem {
  id: string
  name: string
  duration: number
  price: number
  category: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  phone: string
  email: string
}

export interface OnboardingProgress {
  accountCreated: boolean
  businessDataComplete: boolean
  hoursConfigured: boolean
  servicesReviewed: boolean
  teamAdded: boolean
}

export interface OnboardingData {
  account: OnboardingAccount | null
  business: BusinessData | null
  hours: DayHours[]
  services: ServiceItem[]
  team: TeamMember[]
  progress: OnboardingProgress
  completed: boolean
}

export interface AuthUser {
  id: string
  email: string
  name: string
  hashedPassword: string
  onboardingData: OnboardingData
  credits: number
  plan: 'starter' | 'pro' | 'premium'
}

export const DAY_LABELS: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
}

export const DEFAULT_HOURS: DayHours[] = [
  { dayOfWeek: 0, isOpen: false, openTime: '08:00', closeTime: '13:00' },
  { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '13:00' },
]

export const SEGMENT_SERVICES: Record<string, Omit<ServiceItem, 'id'>[]> = {
  salao: [
    { name: 'Corte Feminino', duration: 60, price: 80, category: 'Corte' },
    { name: 'Escova', duration: 45, price: 60, category: 'Finalização' },
    { name: 'Coloração', duration: 120, price: 150, category: 'Coloração' },
    { name: 'Manicure', duration: 40, price: 45, category: 'Mãos & Pés' },
    { name: 'Pedicure', duration: 40, price: 45, category: 'Mãos & Pés' },
    { name: 'Hidratação', duration: 50, price: 70, category: 'Tratamento' },
    { name: 'Luzes', duration: 150, price: 200, category: 'Coloração' },
    { name: 'Design de Sobrancelhas', duration: 20, price: 30, category: 'Sobrancelha' },
  ],
  barbearia: [
    { name: 'Corte Masculino', duration: 40, price: 50, category: 'Corte' },
    { name: 'Barba', duration: 30, price: 35, category: 'Barba' },
    { name: 'Corte + Barba', duration: 60, price: 75, category: 'Combo' },
    { name: 'Sobrancelha', duration: 15, price: 25, category: 'Sobrancelha' },
    { name: 'Hidratação Capilar', duration: 30, price: 40, category: 'Tratamento' },
    { name: 'Pigmentação Capilar', duration: 90, price: 120, category: 'Estética' },
  ],
  autonomo: [
    { name: 'Corte Feminino', duration: 60, price: 70, category: 'Corte' },
    { name: 'Escova', duration: 45, price: 50, category: 'Finalização' },
    { name: 'Coloração', duration: 120, price: 130, category: 'Coloração' },
    { name: 'Manicure', duration: 40, price: 40, category: 'Mãos & Pés' },
    { name: 'Design de Sobrancelhas', duration: 30, price: 35, category: 'Sobrancelha' },
  ],
  clinica: [
    { name: 'Limpeza de Pele', duration: 60, price: 120, category: 'Estética Facial' },
    { name: 'Peeling Químico', duration: 45, price: 150, category: 'Estética Facial' },
    { name: 'Laser', duration: 30, price: 200, category: 'Equipamentos' },
    { name: 'Massagem Modeladora', duration: 50, price: 100, category: 'Massagens' },
    { name: 'Drenagem Linfática', duration: 60, price: 90, category: 'Massagens' },
    { name: 'Microagulhamento', duration: 60, price: 180, category: 'Estética Facial' },
  ],
}

export const SEGMENTS = [
  { id: 'salao', label: 'Salão de beleza' },
  { id: 'barbearia', label: 'Barbearia' },
  { id: 'autonomo', label: 'Profissional autônomo' },
  { id: 'clinica', label: 'Clínica estética' },
] as const

export function generateId(): string {
  return crypto.randomUUID()
}
