export interface AppointmentResponse {
  id: string
  clientName: string
  clientPhone: string
  clientEmail?: string | null
  serviceId: string
  serviceName: string
  serviceDuration: number
  servicePrice: number
  professionalId: string
  professionalName: string
  date: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'no-show'
  notes?: string | null
  createdAt: string
  updatedAt?: string | null
  reminderSent: boolean
  confirmationSent: boolean
}

export interface ConflictCheckResponse {
  hasConflict: boolean
  conflicts: AppointmentResponse[]
}

export interface SuggestionResponse {
  time: string
  professionalId: string
  professionalName?: string
  score: number
  reason: string
}

export function toAppointmentResponse(appointment: {
  id: string
  clientName: string
  clientPhone: string
  clientEmail: string | null
  serviceId: string
  serviceName: string
  serviceDuration: number
  servicePrice: number
  professionalId: string
  professionalName: string
  date: string
  startTime: string
  endTime: string
  status: string
  notes: string | null
  createdAt: Date
  updatedAt: Date | null
  reminderSent: boolean
  confirmationSent: boolean
}): AppointmentResponse {
  return {
    id: appointment.id,
    clientName: appointment.clientName,
    clientPhone: appointment.clientPhone,
    clientEmail: appointment.clientEmail,
    serviceId: appointment.serviceId,
    serviceName: appointment.serviceName,
    serviceDuration: appointment.serviceDuration,
    servicePrice: appointment.servicePrice,
    professionalId: appointment.professionalId,
    professionalName: appointment.professionalName,
    date: appointment.date,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    status: appointment.status as AppointmentResponse['status'],
    notes: appointment.notes,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt?.toISOString() ?? null,
    reminderSent: appointment.reminderSent,
    confirmationSent: appointment.confirmationSent,
  }
}
