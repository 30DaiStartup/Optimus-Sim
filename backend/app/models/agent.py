"""Pydantic models for TinyTroupe agents."""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class BigFivePersonality(BaseModel):
    """Big Five personality model."""
    model_config = {"arbitrary_types_allowed": True}

    openness: str
    conscientiousness: str
    extraversion: str
    agreeableness: str
    neuroticism: str


class PersonalityTraits(BaseModel):
    """Personality traits."""
    model_config = {"arbitrary_types_allowed": True}

    traits: List[str]
    big_five: Optional[BigFivePersonality] = None


class Occupation(BaseModel):
    """Occupation details."""
    model_config = {"arbitrary_types_allowed": True}

    title: str
    organization: Optional[str] = None
    description: str


class Preferences(BaseModel):
    """Agent preferences."""
    model_config = {"arbitrary_types_allowed": True}

    interests: Optional[List[str]] = []
    likes: Optional[List[str]] = []
    dislikes: Optional[List[str]] = []


class Behaviors(BaseModel):
    """Agent behaviors."""
    model_config = {"arbitrary_types_allowed": True}

    general: Optional[List[str]] = []
    routines: Optional[Dict[str, List[str]]] = {}


class Relationship(BaseModel):
    """Agent relationship."""
    model_config = {"arbitrary_types_allowed": True}

    name: str
    description: str


class Persona(BaseModel):
    """Complete persona specification."""
    model_config = {"arbitrary_types_allowed": True}

    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    residence: Optional[str] = None
    education: Optional[str] = None
    long_term_goals: Optional[List[str]] = []
    occupation: Optional[Occupation] = None
    style: Optional[str] = None
    personality: Optional[PersonalityTraits] = None
    preferences: Optional[Preferences] = None
    skills: Optional[List[str]] = []
    beliefs: Optional[List[str]] = []
    behaviors: Optional[Behaviors] = None
    health: Optional[str] = None
    relationships: Optional[List[Relationship]] = []
    other_facts: Optional[List[str]] = []


class AgentCreate(BaseModel):
    """Request model for creating an agent."""
    model_config = {"arbitrary_types_allowed": True}

    type: str = "TinyPerson"
    persona: Persona


class AgentUpdate(BaseModel):
    """Request model for updating an agent."""
    persona: Optional[Persona] = None


class AgentGenerateRequest(BaseModel):
    """Request model for generating an agent via AI."""
    description: str = Field(..., description="Natural language description of the agent to generate")
    context: Optional[str] = Field(None, description="Context for the agent (e.g., 'A hospital in São Paulo')")


class AgentResponse(BaseModel):
    """Response model for agent data."""
    model_config = {"arbitrary_types_allowed": True}

    id: str
    type: str
    persona: Persona
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class AgentListResponse(BaseModel):
    """Response model for listing agents."""
    agents: List[AgentResponse]
    total: int
