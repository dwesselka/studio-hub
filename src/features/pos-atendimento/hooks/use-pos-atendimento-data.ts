import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Feedback, Campaign } from '@/features/pos-atendimento/types'
import {
  getCampaigns,
  getFeedbackList,
  createFeedback,
  toggleCampaign,
  updateCampaign,
  getNPS,
} from '@/lib/pos-atendimento-db'

function fetchCampaigns(): Promise<Campaign[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getCampaigns()), 150)
  })
}

function fetchFeedback(): Promise<Feedback[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getFeedbackList()), 150)
  })
}

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  })
}

export function useFeedback() {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: fetchFeedback,
  })
}

export function useNPS() {
  return useQuery({
    queryKey: ['nps'],
    queryFn: () => new Promise<ReturnType<typeof getNPS>>((resolve) => {
      setTimeout(() => resolve(getNPS()), 100)
    }),
  })
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Feedback, 'id' | 'createdAt'>) => {
      await new Promise((r) => setTimeout(r, 200))
      return createFeedback(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] })
      queryClient.invalidateQueries({ queryKey: ['nps'] })
    },
  })
}

export function useToggleCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 200))
      return toggleCampaign(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Campaign> }) => {
      await new Promise((r) => setTimeout(r, 200))
      return updateCampaign(id, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}
