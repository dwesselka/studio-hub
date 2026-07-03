import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Appointment, AgendaFilters } from '@/features/agenda/types'
import {
  getAppointmentsByDate,
  getAppointmentsByDateRange,
  createAppointment as dbCreate,
  updateAppointment as dbUpdate,
  cancelAppointment as dbCancel,
  confirmAppointment as dbConfirm,
  markNoShow as dbMarkNoShow,
  rescheduleAppointment as dbReschedule,
  deleteAppointment as dbDelete,
  sendConfirmation,
} from '@/lib/agenda-db'

function fetchAgenda(filters: AgendaFilters): Promise<Appointment[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appointments =
        filters.view === 'week'
          ? getAppointmentsByDateRange(filters.date, filters.date)
          : getAppointmentsByDate(filters.date)

      let filtered = appointments

      if (filters.professionalId) {
        filtered = filtered.filter((a) => a.professionalId === filters.professionalId)
      }

      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter((a) => a.status === filters.status)
      }

      resolve(filtered.sort((a, b) => a.startTime.localeCompare(b.startTime)))
    }, 200)
  })
}

export function useAgendaData(filters: AgendaFilters) {
  return useQuery({
    queryKey: ['agenda', filters],
    queryFn: () => fetchAgenda(filters),
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      data: Omit<Appointment, 'id' | 'createdAt' | 'reminderSent' | 'confirmationSent'>,
    ) => {
      await new Promise((r) => setTimeout(r, 300))
      const appointment = dbCreate(data)
      sendConfirmation(appointment.id)
      return appointment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
    },
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Appointment> }) => {
      await new Promise((r) => setTimeout(r, 200))
      return dbUpdate(id, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
    },
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 200))
      return dbCancel(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
    },
  })
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 200))
      return dbConfirm(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
    },
  })
}

export function useMarkNoShow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 200))
      return dbMarkNoShow(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
    },
  })
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      date,
      startTime,
      endTime,
    }: {
      id: string
      date: string
      startTime: string
      endTime: string
    }) => {
      await new Promise((r) => setTimeout(r, 200))
      return dbReschedule(id, date, startTime, endTime)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
    },
  })
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 200))
      dbDelete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
    },
  })
}
