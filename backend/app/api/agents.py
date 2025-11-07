"""API routes for agent management."""

from typing import List
from fastapi import APIRouter, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse
import json

from app.models.agent import (
    AgentCreate,
    AgentUpdate,
    AgentResponse,
    AgentListResponse,
    AgentGenerateRequest
)
from app.services.agent_service import agent_service

router = APIRouter()


@router.post("/", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent(agent_create: AgentCreate):
    """
    Create a new agent.

    Args:
        agent_create: Agent creation data

    Returns:
        Created agent data
    """
    try:
        agent = agent_service.create_agent(agent_create)
        return agent
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create agent: {str(e)}"
        )


@router.get("/", response_model=AgentListResponse)
async def list_agents():
    """
    List all agents.

    Returns:
        List of all agents
    """
    try:
        agents = agent_service.list_agents()
        return AgentListResponse(agents=agents, total=len(agents))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list agents: {str(e)}"
        )


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str):
    """
    Get a specific agent by ID.

    Args:
        agent_id: Agent ID

    Returns:
        Agent data
    """
    agent = agent_service.get_agent(agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID {agent_id} not found"
        )
    return agent


@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(agent_id: str, agent_update: AgentUpdate):
    """
    Update an agent.

    Args:
        agent_id: Agent ID
        agent_update: Update data

    Returns:
        Updated agent data
    """
    agent = agent_service.update_agent(agent_id, agent_update)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID {agent_id} not found"
        )
    return agent


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(agent_id: str):
    """
    Delete an agent.

    Args:
        agent_id: Agent ID
    """
    deleted = agent_service.delete_agent(agent_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID {agent_id} not found"
        )


@router.post("/generate", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def generate_agent(request: AgentGenerateRequest):
    """
    Generate an agent using AI based on a description.

    Args:
        request: Agent generation request with description and context

    Returns:
        Generated agent data
    """
    try:
        agent = agent_service.generate_agent(
            description=request.description,
            context=request.context
        )
        return agent
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate agent: {str(e)}"
        )


@router.post("/upload", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def upload_agent(file: UploadFile = File(...)):
    """
    Upload an agent from a JSON file.

    Args:
        file: Agent JSON file

    Returns:
        Created agent data
    """
    if not file.filename.endswith('.json'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a JSON file"
        )

    try:
        content = await file.read()
        agent_data = json.loads(content)

        # Validate and create agent
        agent_create = AgentCreate(**agent_data)
        agent = agent_service.create_agent(agent_create)

        return agent
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON file"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload agent: {str(e)}"
        )


@router.get("/{agent_id}/fragments")
async def list_agent_fragments(agent_id: str):
    """
    List available fragments that can be added to an agent.

    Args:
        agent_id: Agent ID

    Returns:
        List of available fragments
    """
    # This would list available fragment files
    # For now, return empty list - will be implemented when fragments are added
    return {"fragments": [], "total": 0}


@router.post("/{agent_id}/fragments/{fragment_name}", response_model=AgentResponse)
async def add_fragment_to_agent(agent_id: str, fragment_name: str):
    """
    Add a fragment to an agent.

    Args:
        agent_id: Agent ID
        fragment_name: Name of the fragment to add

    Returns:
        Updated agent data
    """
    # This would integrate a fragment into an agent
    # For now, return not implemented
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Fragment integration not yet implemented"
    )
