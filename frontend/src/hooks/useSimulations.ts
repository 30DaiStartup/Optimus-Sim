/**
 * React Query hooks for simulation management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { SimulationCreateRequest } from '@/types/simulation'

const SIMULATIONS_KEY = ['simulations']

export function useSimulations() {
  return useQuery({
    queryKey: SIMULATIONS_KEY,
    queryFn: () => apiClient.listSimulations(),
  })
}

export function useSimulation(id: string) {
  return useQuery({
    queryKey: [...SIMULATIONS_KEY, id],
    queryFn: () => apiClient.getSimulation(id),
    enabled: !!id,
  })
}

export function useCreateSimulation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SimulationCreateRequest) => apiClient.createSimulation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIMULATIONS_KEY })
    },
  })
}

export function useStartSimulation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.startSimulation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [...SIMULATIONS_KEY, id] })
      queryClient.invalidateQueries({ queryKey: SIMULATIONS_KEY })
    },
  })
}

export function useSimulationStatus(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...SIMULATIONS_KEY, id, 'status'],
    queryFn: () => apiClient.getSimulationStatus(id),
    enabled: enabled && !!id,
    refetchInterval: (query) => {
      const data = query.state.data
      // Poll every 2 seconds if running
      return data?.status === 'running' ? 2000 : false
    },
  })
}

export function useDeleteSimulation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteSimulation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIMULATIONS_KEY })
    },
  })
}
