import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Atendimento, Consumable, ConsumedSupply } from '@/features/atendimento/types'
import {
  getAtendimentosByDate,
  getConsumables,
  createAtendimento,
  completeAtendimento,
  cancelAtendimento,
  updateAtendimento,
} from '@/lib/atendimento-db'

function fetchAtendimentos(date: string): Promise<Atendimento[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getAtendimentosByDate(date))
    }, 150)
  })
}

function fetchConsumables(): Promise<Consumable[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getConsumables())
    }, 100)
  })
}

export function useAtendimentos(date: string) {
  return useQuery({
    queryKey: ['atendimentos', date],
    queryFn: () => fetchAtendimentos(date),
  })
}

export function useConsumables() {
  return useQuery({
    queryKey: ['consumables'],
    queryFn: fetchConsumables,
  })
}

export function useCreateAtendimento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Atendimento, 'id' | 'createdAt'>) => {
      await new Promise((r) => setTimeout(r, 200))
      return createAtendimento(data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos', data.date] })
    },
  })
}

export function useCompleteAtendimento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      supplies,
    }: {
      id: string
      date?: string
      supplies: ConsumedSupply[]
    }) => {
      await new Promise((r) => setTimeout(r, 200))
      return completeAtendimento(id, supplies)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] })
      queryClient.invalidateQueries({ queryKey: ['consumables'] })
    },
  })
}

export function useCancelAtendimento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string; date?: string }) => {
      await new Promise((r) => setTimeout(r, 200))
      return cancelAtendimento(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] })
    },
  })
}

export function useUpdateAtendimento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Atendimento> }) => {
      await new Promise((r) => setTimeout(r, 200))
      return updateAtendimento(id, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos'] })
    },
  })
}
