import { safeLocalStorage } from '@/lib/storage'
import type { Appointment } from '@/features/agenda/types'
import { generateId, getDateString } from '@/features/agenda/types'

const AGENDA_KEY = 'infinity_agenda'

function loadAppointments(): Appointment[] {
  const raw = safeLocalStorage.getItem(AGENDA_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveAppointments(appointments: Appointment[]): void {
  safeLocalStorage.setItem(AGENDA_KEY, JSON.stringify(appointments))
}

export function getAppointmentsByDate(date: string): Appointment[] {
  return loadAppointments().filter((a) => a.date === date)
}

export function getAppointmentsByDateRange(startDate: string, endDate: string): Appointment[] {
  return loadAppointments().filter((a) => a.date >= startDate && a.date <= endDate)
}

export function getAppointmentsByProfessional(professionalId: string, date: string): Appointment[] {
  return loadAppointments().filter((a) => a.professionalId === professionalId && a.date === date)
}

export function getAllAppointments(): Appointment[] {
  return loadAppointments()
}

export function getTodayAppointments(): Appointment[] {
  return getAppointmentsByDate(getDateString())
}

export function getAppointmentById(id: string): Appointment | undefined {
  return loadAppointments().find((a) => a.id === id)
}

export function createAppointment(
  appointment: Omit<Appointment, 'id' | 'createdAt' | 'reminderSent' | 'confirmationSent'>,
): Appointment {
  const appointments = loadAppointments()
  const now = new Date().toISOString()

  const newAppointment: Appointment = {
    ...appointment,
    id: generateId(),
    createdAt: now,
    reminderSent: false,
    confirmationSent: false,
  }

  appointments.push(newAppointment)
  saveAppointments(appointments)
  return newAppointment
}

export function updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
  const appointments = loadAppointments()
  const index = appointments.findIndex((a) => a.id === id)
  if (index === -1) return null

  appointments[index] = {
    ...appointments[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  }

  saveAppointments(appointments)
  return appointments[index]
}

export function cancelAppointment(id: string): Appointment | null {
  return updateAppointment(id, { status: 'cancelled' })
}

export function confirmAppointment(id: string): Appointment | null {
  return updateAppointment(id, { status: 'confirmed' })
}

export function markNoShow(id: string): Appointment | null {
  return updateAppointment(id, { status: 'no-show' })
}

export function rescheduleAppointment(
  id: string,
  date: string,
  startTime: string,
  endTime: string,
): Appointment | null {
  return updateAppointment(id, { date, startTime, endTime, status: 'confirmed' })
}

export function deleteAppointment(id: string): void {
  const appointments = loadAppointments().filter((a) => a.id !== id)
  saveAppointments(appointments)
}

export function hasConflict(
  professionalId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeId?: string,
): boolean {
  const appointments = loadAppointments().filter(
    (a) =>
      a.professionalId === professionalId &&
      a.date === date &&
      a.status !== 'cancelled' &&
      a.id !== excludeId,
  )

  return appointments.some((a) => {
    return startTime < a.endTime && endTime > a.startTime
  })
}

export function sendConfirmation(_appointmentId: string): void {
  if (_appointmentId) {
    console.info('[agenda] Confirmação automática enviada (simulado)')
  }
}

export function sendReminder(_appointmentId: string): void {
  if (_appointmentId) {
    console.info('[agenda] Lembrete enviado (simulado)')
  }
}
