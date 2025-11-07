/**
 * React Query hooks for agent management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { AgentCreateRequest, AgentGenerateRequest } from '@/types/agent'

const AGENTS_KEY = ['agents']

export function useAgents() {
  return useQuery({
    queryKey: AGENTS_KEY,
    queryFn: () => apiClient.listAgents(),
  })
}

export function useAgent(id: string) {
  return useQuery({
    queryKey: [...AGENTS_KEY, id],
    queryFn: () => apiClient.getAgent(id),
    enabled: !!id,
  })
}

export function useCreateAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AgentCreateRequest) => apiClient.createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENTS_KEY })
    },
  })
}

export function useUpdateAgent(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<AgentCreateRequest>) => apiClient.updateAgent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENTS_KEY })
      queryClient.invalidateQueries({ queryKey: [...AGENTS_KEY, id] })
    },
  })
}

export function useDeleteAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENTS_KEY })
    },
  })
}

export function useGenerateAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AgentGenerateRequest) => apiClient.generateAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENTS_KEY })
    },
  })
}

export function useUploadAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => apiClient.uploadAgent(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENTS_KEY })
    },
  })
}
