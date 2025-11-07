/**
 * TypeScript types for simulations
 */

export enum SimulationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum EnvironmentType {
  CHAT_ROOM = 'chat_room',
  FOCUS_GROUP = 'focus_group',
  INTERVIEW = 'interview',
  CUSTOM = 'custom',
}

export interface SimulationConfig {
  steps: number
  initial_prompt: string
  environment_type: EnvironmentType
  parallel_actions?: boolean
  cache_enabled?: boolean
}

export interface SimulationCreateRequest {
  name: string
  agent_ids: string[]
  config: SimulationConfig
}

export interface InteractionMessage {
  timestamp: string
  agent_id: string
  agent_name: string
  message_type: string
  content: string
}

export interface SimulationResult {
  interactions: InteractionMessage[]
  summary?: string
  extracted_data?: Record<string, any>
}

export interface Simulation {
  id: string
  name: string
  agent_ids: string[]
  config: SimulationConfig
  status: SimulationStatus
  created_at: string
  started_at?: string
  completed_at?: string
  result?: SimulationResult
  error?: string
}

export interface SimulationListResponse {
  simulations: Simulation[]
  total: number
}

export interface SimulationStatusResponse {
  id: string
  status: SimulationStatus
  progress?: number
  current_step?: number
  total_steps?: number
  message?: string
}
