/**
 * TypeScript types for TinyTroupe agents
 */

export interface BigFivePersonality {
  openness: string
  conscientiousness: string
  extraversion: string
  agreeableness: string
  neuroticism: string
}

export interface PersonalityTraits {
  traits: string[]
  big_five?: BigFivePersonality
}

export interface Occupation {
  title: string
  organization?: string
  description: string
}

export interface Preferences {
  interests?: string[]
  likes?: string[]
  dislikes?: string[]
}

export interface Behaviors {
  general?: string[]
  routines?: Record<string, string[]>
}

export interface Relationship {
  name: string
  description: string
}

export interface Persona {
  name: string
  age?: number
  gender?: string
  nationality?: string
  residence?: string
  education?: string
  long_term_goals?: string[]
  occupation?: Occupation
  style?: string
  personality?: PersonalityTraits
  preferences?: Preferences
  skills?: string[]
  beliefs?: string[]
  behaviors?: Behaviors
  health?: string
  relationships?: Relationship[]
  other_facts?: string[]
}

export interface Agent {
  id: string
  type: string
  persona: Persona
  created_at?: string
  updated_at?: string
}

export interface AgentCreateRequest {
  type: string
  persona: Persona
}

export interface AgentGenerateRequest {
  description: string
  context?: string
}

export interface AgentListResponse {
  agents: Agent[]
  total: number
}
