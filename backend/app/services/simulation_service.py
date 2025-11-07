"""Service layer for simulation management with TinyTroupe integration."""

import os
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pathlib import Path
import asyncio

from app.core.config import settings
from app.models.simulation import (
    SimulationCreate,
    SimulationResponse,
    SimulationStatus,
    SimulationResult,
    InteractionMessage
)


class SimulationService:
    """Service for managing TinyTroupe simulations."""

    def __init__(self):
        """Initialize the simulation service."""
        self.simulations_dir = Path(settings.simulations_dir)
        self.simulations_dir.mkdir(parents=True, exist_ok=True)
        self.active_simulations: Dict[str, Any] = {}

    def _get_simulation_file_path(self, simulation_id: str) -> Path:
        """Get the file path for a simulation."""
        return self.simulations_dir / f"{simulation_id}.json"

    def _load_simulation_from_file(self, simulation_id: str) -> Optional[Dict[str, Any]]:
        """Load simulation data from file."""
        file_path = self._get_simulation_file_path(simulation_id)
        if not file_path.exists():
            return None

        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _save_simulation_to_file(self, simulation_id: str, simulation_data: Dict[str, Any]):
        """Save simulation data to file."""
        file_path = self._get_simulation_file_path(simulation_id)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(simulation_data, f, indent=2, ensure_ascii=False)

    def create_simulation(self, simulation_create: SimulationCreate) -> SimulationResponse:
        """
        Create a new simulation.

        Args:
            simulation_create: Simulation creation data

        Returns:
            Created simulation response
        """
        simulation_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()

        simulation_data = {
            "id": simulation_id,
            "name": simulation_create.name,
            "agent_ids": simulation_create.agent_ids,
            "config": simulation_create.config.model_dump(),
            "status": SimulationStatus.PENDING,
            "created_at": now,
            "started_at": None,
            "completed_at": None,
            "result": None,
            "error": None
        }

        self._save_simulation_to_file(simulation_id, simulation_data)

        return SimulationResponse(**simulation_data)

    def get_simulation(self, simulation_id: str) -> Optional[SimulationResponse]:
        """
        Get a simulation by ID.

        Args:
            simulation_id: Simulation ID

        Returns:
            Simulation response or None if not found
        """
        simulation_data = self._load_simulation_from_file(simulation_id)
        if not simulation_data:
            return None

        return SimulationResponse(**simulation_data)

    def list_simulations(self) -> List[SimulationResponse]:
        """
        List all simulations.

        Returns:
            List of simulation responses
        """
        simulations = []
        for simulation_file in self.simulations_dir.glob("*.json"):
            try:
                with open(simulation_file, 'r', encoding='utf-8') as f:
                    simulation_data = json.load(f)
                    simulations.append(SimulationResponse(**simulation_data))
            except Exception as e:
                print(f"Error loading simulation from {simulation_file}: {e}")
                continue

        # Sort by created_at descending
        simulations.sort(key=lambda x: x.created_at, reverse=True)
        return simulations

    def delete_simulation(self, simulation_id: str) -> bool:
        """
        Delete a simulation.

        Args:
            simulation_id: Simulation ID

        Returns:
            True if deleted, False if not found
        """
        file_path = self._get_simulation_file_path(simulation_id)
        if not file_path.exists():
            return False

        file_path.unlink()
        return True

    async def run_simulation(self, simulation_id: str):
        """
        Run a simulation asynchronously.

        Args:
            simulation_id: Simulation ID
        """
        simulation_data = self._load_simulation_from_file(simulation_id)
        if not simulation_data:
            raise ValueError(f"Simulation {simulation_id} not found")

        # Update status to running
        simulation_data["status"] = SimulationStatus.RUNNING
        simulation_data["started_at"] = datetime.utcnow().isoformat()
        self._save_simulation_to_file(simulation_id, simulation_data)

        try:
            # This is where we'll integrate with TinyTroupe
            # For now, create a placeholder result
            result = await self._execute_tinytroupe_simulation(simulation_data)

            # Update with result
            simulation_data["status"] = SimulationStatus.COMPLETED
            simulation_data["completed_at"] = datetime.utcnow().isoformat()
            simulation_data["result"] = result
            simulation_data["error"] = None

        except Exception as e:
            # Handle error
            simulation_data["status"] = SimulationStatus.FAILED
            simulation_data["completed_at"] = datetime.utcnow().isoformat()
            simulation_data["error"] = str(e)

        finally:
            self._save_simulation_to_file(simulation_id, simulation_data)
            if simulation_id in self.active_simulations:
                del self.active_simulations[simulation_id]

    async def _execute_tinytroupe_simulation(self, simulation_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the actual TinyTroupe simulation.

        Args:
            simulation_data: Simulation configuration data

        Returns:
            Simulation results
        """
        # Import TinyTroupe components
        try:
            import sys
            tinytroupe_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "TinyTroupe")
            if tinytroupe_path not in sys.path:
                sys.path.insert(0, tinytroupe_path)

            from tinytroupe.agent import TinyPerson
            from tinytroupe.environment import TinyWorld
            from app.services.agent_service import agent_service

            # Load agents
            agents = []
            for agent_id in simulation_data["agent_ids"]:
                agent = agent_service.get_agent(agent_id)
                if not agent:
                    raise ValueError(f"Agent {agent_id} not found")

                # Create TinyPerson from agent data
                # Note: This is simplified - actual implementation needs proper TinyPerson creation
                tiny_person = TinyPerson(agent.persona.name)
                # TODO: Properly configure TinyPerson from persona data
                agents.append(tiny_person)

            # Create TinyWorld
            world_name = simulation_data["name"]
            world = TinyWorld(world_name, agents)
            world.make_everyone_accessible()

            # Give initial prompt to first agent
            config = simulation_data["config"]
            if agents:
                agents[0].listen(config["initial_prompt"])

            # Run simulation
            steps = config["steps"]
            world.run(steps)

            # Extract results
            # TODO: Properly extract and format interaction results
            interactions = []
            result = {
                "interactions": interactions,
                "summary": f"Simulation completed with {steps} steps",
                "extracted_data": {}
            }

            return result

        except Exception as e:
            raise Exception(f"Failed to execute TinyTroupe simulation: {str(e)}")


# Global instance
simulation_service = SimulationService()
