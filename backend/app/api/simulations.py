"""API routes for simulation management."""

from typing import List
from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from fastapi.responses import JSONResponse

from app.models.simulation import (
    SimulationCreate,
    SimulationResponse,
    SimulationListResponse,
    SimulationStatusResponse,
    SimulationStatus
)
from app.services.simulation_service import simulation_service

router = APIRouter()


@router.post("/", response_model=SimulationResponse, status_code=status.HTTP_201_CREATED)
async def create_simulation(simulation_create: SimulationCreate):
    """
    Create a new simulation.

    Args:
        simulation_create: Simulation creation data

    Returns:
        Created simulation data
    """
    try:
        simulation = simulation_service.create_simulation(simulation_create)
        return simulation
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create simulation: {str(e)}"
        )


@router.get("/", response_model=SimulationListResponse)
async def list_simulations():
    """
    List all simulations.

    Returns:
        List of all simulations
    """
    try:
        simulations = simulation_service.list_simulations()
        return SimulationListResponse(simulations=simulations, total=len(simulations))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list simulations: {str(e)}"
        )


@router.get("/{simulation_id}", response_model=SimulationResponse)
async def get_simulation(simulation_id: str):
    """
    Get a specific simulation by ID.

    Args:
        simulation_id: Simulation ID

    Returns:
        Simulation data
    """
    simulation = simulation_service.get_simulation(simulation_id)
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation with ID {simulation_id} not found"
        )
    return simulation


@router.delete("/{simulation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_simulation(simulation_id: str):
    """
    Delete a simulation.

    Args:
        simulation_id: Simulation ID
    """
    deleted = simulation_service.delete_simulation(simulation_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation with ID {simulation_id} not found"
        )


@router.post("/{simulation_id}/start", response_model=SimulationResponse)
async def start_simulation(simulation_id: str, background_tasks: BackgroundTasks):
    """
    Start running a simulation.

    Args:
        simulation_id: Simulation ID
        background_tasks: FastAPI background tasks

    Returns:
        Updated simulation data
    """
    simulation = simulation_service.get_simulation(simulation_id)
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation with ID {simulation_id} not found"
        )

    if simulation.status != SimulationStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Simulation is already {simulation.status}"
        )

    # Start simulation in background
    background_tasks.add_task(simulation_service.run_simulation, simulation_id)

    # Return updated simulation
    simulation = simulation_service.get_simulation(simulation_id)
    return simulation


@router.get("/{simulation_id}/status", response_model=SimulationStatusResponse)
async def get_simulation_status(simulation_id: str):
    """
    Get the status of a simulation.

    Args:
        simulation_id: Simulation ID

    Returns:
        Simulation status
    """
    simulation = simulation_service.get_simulation(simulation_id)
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation with ID {simulation_id} not found"
        )

    # Calculate progress if running
    progress = None
    current_step = None
    total_steps = None

    if simulation.status == SimulationStatus.RUNNING:
        total_steps = simulation.config.steps
        # This would need to be tracked during execution
        current_step = 0  # Placeholder
        progress = int((current_step / total_steps) * 100) if total_steps > 0 else 0
    elif simulation.status == SimulationStatus.COMPLETED:
        progress = 100

    return SimulationStatusResponse(
        id=simulation.id,
        status=simulation.status,
        progress=progress,
        current_step=current_step,
        total_steps=total_steps,
        message=simulation.error if simulation.error else None
    )


@router.get("/{simulation_id}/results", response_model=SimulationResponse)
async def get_simulation_results(simulation_id: str):
    """
    Get the results of a completed simulation.

    Args:
        simulation_id: Simulation ID

    Returns:
        Simulation data with results
    """
    simulation = simulation_service.get_simulation(simulation_id)
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation with ID {simulation_id} not found"
        )

    if simulation.status != SimulationStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Simulation is not completed yet (status: {simulation.status})"
        )

    return simulation
