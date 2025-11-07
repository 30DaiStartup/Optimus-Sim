/**
 * API client for OptimusSim backend
 */

import type { Agent, AgentCreateRequest, AgentGenerateRequest, AgentListResponse } from '@/types/agent'
import type { Simulation, SimulationCreateRequest, SimulationListResponse, SimulationStatusResponse } from '@/types/simulation'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Agent endpoints
  async createAgent(data: AgentCreateRequest): Promise<Agent> {
    return this.request<Agent>('/api/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async listAgents(): Promise<AgentListResponse> {
    return this.request<AgentListResponse>('/api/agents')
  }

  async getAgent(id: string): Promise<Agent> {
    return this.request<Agent>(`/api/agents/${id}`)
  }

  async updateAgent(id: string, data: Partial<AgentCreateRequest>): Promise<Agent> {
    return this.request<Agent>(`/api/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAgent(id: string): Promise<void> {
    return this.request<void>(`/api/agents/${id}`, {
      method: 'DELETE',
    })
  }

  async generateAgent(data: AgentGenerateRequest): Promise<Agent> {
    return this.request<Agent>('/api/agents/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async uploadAgent(file: File): Promise<Agent> {
    const formData = new FormData()
    formData.append('file', file)

    const url = `${this.baseUrl}/api/agents/upload`
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Simulation endpoints
  async createSimulation(data: SimulationCreateRequest): Promise<Simulation> {
    return this.request<Simulation>('/api/simulations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async listSimulations(): Promise<SimulationListResponse> {
    return this.request<SimulationListResponse>('/api/simulations')
  }

  async getSimulation(id: string): Promise<Simulation> {
    return this.request<Simulation>(`/api/simulations/${id}`)
  }

  async deleteSimulation(id: string): Promise<void> {
    return this.request<void>(`/api/simulations/${id}`, {
      method: 'DELETE',
    })
  }

  async startSimulation(id: string): Promise<Simulation> {
    return this.request<Simulation>(`/api/simulations/${id}/start`, {
      method: 'POST',
    })
  }

  async getSimulationStatus(id: string): Promise<SimulationStatusResponse> {
    return this.request<SimulationStatusResponse>(`/api/simulations/${id}/status`)
  }

  async getSimulationResults(id: string): Promise<Simulation> {
    return this.request<Simulation>(`/api/simulations/${id}/results`)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
