export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'no-show'

export type CalendarView = 'day' | 'week'

export interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  serviceId: string
  serviceName: string
  serviceDuration: number
  servicePrice: number
  professionalId: string
  professionalName: string
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes?: string
  createdAt: string
  updatedAt?: string
  reminderSent: boolean
  confirmationSent: boolean
}

export interface TimeSlot {
  time: string
  available: boolean
  professionalId?: string
  professionalName?: string
  conflictingAppointmentId?: string
}

export interface IARecommendation {
  time: string
  professionalId: string
  professionalName: string
  score: number
  reason: string
}

export interface AgendaFilters {
  date: string
  professionalId?: string
  status?: AppointmentStatus | 'all'
  view: CalendarView
}

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  'no-show': 'Não compareceu',
}

export const STATUS_VARIANTS: Record<AppointmentStatus, string> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'destructive',
  'no-show': 'secondary',
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function formatTimeRange(start: string, end: string): string {
  return `${start} - ${end}`
}

export function getDateString(date?: Date): string {
  const d = date ?? new Date()
  return d.toISOString().split('T')[0]
}

export function getTodayDateString(): string {
  return getDateString()
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return getDateString(d)
}

export function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + 'T12:00:00').getDay()
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
}

export function formatDateFull(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}
