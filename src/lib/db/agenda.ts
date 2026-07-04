import { safeLocalStorage } from '@/lib/storage'
import type { Appointment } from '@/features/agenda/types'
import { generateId, getDateString } from '@/features/agenda/types'
import { sendWhatsApp } from '@/lib/services/whatsapp'

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

function buildConfirmationMessage(a: Appointment): string {
  const day = new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return [
    `✅ *Confirmação de Agendamento*`,
    ``,
    `Olá *${a.clientName}*! Seu horário foi confirmado:`,
    `📅 ${day}`,
    `⏰ ${a.startTime} — ${a.endTime}`,
    `💇 ${a.serviceName} com *${a.professionalName}*`,
    ``,
    `Em caso de imprevisto, cancele pelo link:`,
    `${window.location.origin}/app/agendamentos`,
    ``,
    `Esperamos por você! 🖐️`,
  ].join('\n')
}

function buildReminderMessage(a: Appointment): string {
  const day = new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return [
    `⏰ *Lembrete de Agendamento*`,
    ``,
    `Olá *${a.clientName}*! Seu horário é amanhã:`,
    `📅 ${day}`,
    `⏰ ${a.startTime} — ${a.endTime}`,
    `💇 ${a.serviceName} com *${a.professionalName}*`,
    ``,
    `Confirma presença? É só aparecer! 🖐️`,
  ].join('\n')
}

export function sendConfirmation(appointmentId: string): void {
  const appointment = getAppointmentById(appointmentId)
  if (!appointment) return
  const message = buildConfirmationMessage(appointment)
  sendWhatsApp({ to: appointment.clientPhone, body: message }).then(() => {
    console.info('[agenda] Confirmação WhatsApp enviada para', appointment.clientName)
  })
}

export function sendReminder(appointmentId: string): void {
  const appointment = getAppointmentById(appointmentId)
  if (!appointment) return
  const message = buildReminderMessage(appointment)
  sendWhatsApp({ to: appointment.clientPhone, body: message }).then(() => {
    console.info('[agenda] Lembrete WhatsApp enviado para', appointment.clientName)
  })
}

export function scheduleReminders(): void {
  const appointments = loadAppointments()
  const now = Date.now()
  const pending = appointments.filter((a) => a.status === 'confirmed' && !a.reminderSent)
  if (pending.length === 0) return

  const schedulable: { appointmentId: string; fireAt: number }[] = []

  for (const a of pending) {
    const [h, m] = a.startTime.split(':').map(Number)
    const aptMs = new Date(`${a.date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`).getTime()
    if (isNaN(aptMs)) continue

    const triggers = [aptMs - 24 * 60 * 60 * 1000, aptMs - 2 * 60 * 60 * 1000]

    for (const fireAt of triggers) {
      if (fireAt <= now && fireAt > now - 60_000) {
        sendReminder(a.id)
        updateAppointment(a.id, { reminderSent: true })
      } else if (fireAt > now && fireAt <= now + 24 * 60 * 60 * 1000) {
        schedulable.push({ appointmentId: a.id, fireAt })
      }
    }
  }

  if (schedulable.length === 0) return
  schedulable.sort((a, b) => a.fireAt - b.fireAt)

  const nextFire = schedulable[0].fireAt
  const delay = Math.max(nextFire - now, 1000)
  setTimeout(fireReminders, delay)
}

function fireReminders(): void {
  const now = Date.now()
  const appointments = loadAppointments()
  const pending = appointments.filter((a) => a.status === 'confirmed' && !a.reminderSent)

  for (const a of pending) {
    const [h, m] = a.startTime.split(':').map(Number)
    const aptMs = new Date(`${a.date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`).getTime()
    if (isNaN(aptMs)) continue

    if (now >= aptMs - 24 * 60 * 60 * 1000 && now < aptMs - 24 * 60 * 60 * 1000 + 5000) {
      sendReminder(a.id)
      updateAppointment(a.id, { reminderSent: true })
    } else if (now >= aptMs - 2 * 60 * 60 * 1000 && now < aptMs - 2 * 60 * 60 * 1000 + 5000) {
      sendReminder(a.id)
      updateAppointment(a.id, { reminderSent: true })
    }
  }

  scheduleReminders()
}
