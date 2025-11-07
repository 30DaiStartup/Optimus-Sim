"""Pydantic models for simulations."""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class SimulationStatus(str, Enum):
    """Simulation status enum."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class EnvironmentType(str, Enum):
    """Environment type enum."""
    CHAT_ROOM = "chat_room"
    FOCUS_GROUP = "focus_group"
    INTERVIEW = "interview"
    CUSTOM = "custom"


class SimulationConfig(BaseModel):
    """Simulation configuration."""
    model_config = {"arbitrary_types_allowed": True}

    steps: int = Field(default=5, ge=1, le=50, description="Number of simulation steps")
    initial_prompt: str = Field(..., description="Initial prompt to start the simulation")
    environment_type: EnvironmentType = Field(default=EnvironmentType.CHAT_ROOM)
    parallel_actions: bool = Field(default=True, description="Run agent actions in parallel")
    cache_enabled: bool = Field(default=False, description="Enable API call caching")


class SimulationCreate(BaseModel):
    """Request model for creating a simulation."""
    model_config = {"arbitrary_types_allowed": True}

    name: str = Field(..., description="Name of the simulation")
    agent_ids: List[str] = Field(..., min_length=1, description="List of agent IDs to include")
    config: SimulationConfig


class InteractionMessage(BaseModel):
    """A single interaction message in the simulation."""
    model_config = {"arbitrary_types_allowed": True}

    timestamp: str
    agent_id: str
    agent_name: str
    message_type: str  # e.g., "TALK", "THOUGHT", "DONE"
    content: str


class SimulationResult(BaseModel):
    """Results from a simulation run."""
    model_config = {"arbitrary_types_allowed": True}

    interactions: List[InteractionMessage]
    summary: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None


class SimulationResponse(BaseModel):
    """Response model for simulation data."""
    model_config = {"arbitrary_types_allowed": True}

    id: str
    name: str
    agent_ids: List[str]
    config: SimulationConfig
    status: SimulationStatus
    created_at: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    result: Optional[SimulationResult] = None
    error: Optional[str] = None


class SimulationListResponse(BaseModel):
    """Response model for listing simulations."""
    model_config = {"arbitrary_types_allowed": True}

    simulations: List[SimulationResponse]
    total: int


class SimulationStatusResponse(BaseModel):
    """Response model for simulation status."""
    model_config = {"arbitrary_types_allowed": True}

    id: str
    status: SimulationStatus
    progress: Optional[int] = Field(None, ge=0, le=100, description="Progress percentage")
    current_step: Optional[int] = None
    total_steps: Optional[int] = None
    message: Optional[str] = None
