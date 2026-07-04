import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  LoyaltyProgram,
  LoyaltyPromotion,
  ClientPoints,
  PointsTransaction,
} from '@/features/fidelizacao/types'
import {
  getLoyaltyProgram,
  updateLoyaltyProgram,
  getAllClientsPoints,
  getPointsTransactions,
  getPromotions,
  createPromotion,
  togglePromotion,
  updatePromotion,
  seedPromotions,
} from '@/lib/fidelizacao-db'

function fetchProgram(): Promise<LoyaltyProgram> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getLoyaltyProgram()), 100)
  })
}

function fetchClientsPoints(): Promise<ClientPoints[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getAllClientsPoints()), 150)
  })
}

function fetchTransactions(): Promise<PointsTransaction[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getPointsTransactions()), 150)
  })
}

function fetchPromotions(): Promise<LoyaltyPromotion[]> {
  return new Promise((resolve) => {
    seedPromotions()
    setTimeout(() => resolve(getPromotions()), 150)
  })
}

export function useLoyaltyProgram() {
  return useQuery({
    queryKey: ['loyalty-program'],
    queryFn: fetchProgram,
  })
}

export function useUpdateLoyaltyProgram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updates: Partial<LoyaltyProgram>) => {
      await new Promise((r) => setTimeout(r, 200))
      return updateLoyaltyProgram(updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-program'] })
    },
  })
}

export function useClientsPoints() {
  return useQuery({
    queryKey: ['clients-points'],
    queryFn: fetchClientsPoints,
  })
}

export function usePointsTransactions() {
  return useQuery({
    queryKey: ['points-transactions'],
    queryFn: fetchTransactions,
  })
}

export function usePromotions() {
  return useQuery({
    queryKey: ['loyalty-promotions'],
    queryFn: fetchPromotions,
  })
}

export function useCreatePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<LoyaltyPromotion, 'id' | 'createdAt' | 'stats'>) => {
      await new Promise((r) => setTimeout(r, 200))
      return createPromotion(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-promotions'] })
    },
  })
}

export function useTogglePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 200))
      return togglePromotion(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-promotions'] })
    },
  })
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LoyaltyPromotion> }) => {
      await new Promise((r) => setTimeout(r, 200))
      return updatePromotion(id, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-promotions'] })
    },
  })
}
