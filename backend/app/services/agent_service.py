"""Service layer for agent management with TinyTroupe integration."""

import os
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pathlib import Path

from app.core.config import settings
from app.models.agent import AgentCreate, AgentResponse, AgentUpdate


class AgentService:
    """Service for managing TinyTroupe agents."""

    def __init__(self):
        """Initialize the agent service."""
        self.agents_dir = Path(settings.agents_dir)
        self.agents_dir.mkdir(parents=True, exist_ok=True)

    def _get_agent_file_path(self, agent_id: str) -> Path:
        """Get the file path for an agent."""
        return self.agents_dir / f"{agent_id}.json"

    def _load_agent_from_file(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Load agent data from file."""
        file_path = self._get_agent_file_path(agent_id)
        if not file_path.exists():
            return None

        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _save_agent_to_file(self, agent_id: str, agent_data: Dict[str, Any]):
        """Save agent data to file."""
        file_path = self._get_agent_file_path(agent_id)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(agent_data, f, indent=2, ensure_ascii=False)

    def create_agent(self, agent_create: AgentCreate) -> AgentResponse:
        """
        Create a new agent.

        Args:
            agent_create: Agent creation data

        Returns:
            Created agent response
        """
        agent_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()

        agent_data = {
            "id": agent_id,
            "type": agent_create.type,
            "persona": agent_create.persona.model_dump(),
            "created_at": now,
            "updated_at": now
        }

        self._save_agent_to_file(agent_id, agent_data)

        return AgentResponse(**agent_data)

    def get_agent(self, agent_id: str) -> Optional[AgentResponse]:
        """
        Get an agent by ID.

        Args:
            agent_id: Agent ID

        Returns:
            Agent response or None if not found
        """
        agent_data = self._load_agent_from_file(agent_id)
        if not agent_data:
            return None

        return AgentResponse(**agent_data)

    def list_agents(self) -> List[AgentResponse]:
        """
        List all agents.

        Returns:
            List of agent responses
        """
        agents = []
        for agent_file in self.agents_dir.glob("*.json"):
            try:
                with open(agent_file, 'r', encoding='utf-8') as f:
                    agent_data = json.load(f)
                    agents.append(AgentResponse(**agent_data))
            except Exception as e:
                print(f"Error loading agent from {agent_file}: {e}")
                continue

        return agents

    def update_agent(self, agent_id: str, agent_update: AgentUpdate) -> Optional[AgentResponse]:
        """
        Update an agent.

        Args:
            agent_id: Agent ID
            agent_update: Update data

        Returns:
            Updated agent response or None if not found
        """
        agent_data = self._load_agent_from_file(agent_id)
        if not agent_data:
            return None

        if agent_update.persona:
            agent_data["persona"] = agent_update.persona.model_dump()
            agent_data["updated_at"] = datetime.utcnow().isoformat()

        self._save_agent_to_file(agent_id, agent_data)

        return AgentResponse(**agent_data)

    def delete_agent(self, agent_id: str) -> bool:
        """
        Delete an agent.

        Args:
            agent_id: Agent ID

        Returns:
            True if deleted, False if not found
        """
        file_path = self._get_agent_file_path(agent_id)
        if not file_path.exists():
            return False

        file_path.unlink()
        return True

    def generate_agent(self, description: str, context: Optional[str] = None) -> AgentResponse:
        """
        Generate an agent using TinyPersonFactory.

        Args:
            description: Natural language description of the agent
            context: Optional context for the agent

        Returns:
            Generated agent response
        """
        try:
            # Import TinyTroupe here to avoid issues if not properly configured
            from tinytroupe.factory import TinyPersonFactory

            # Create factory with context
            factory = TinyPersonFactory(context=context or "A modern workplace")

            # Generate the person
            tiny_person = factory.generate_person(description)

            # Extract persona data from TinyPerson
            # This is a simplified extraction - you may need to adjust based on TinyPerson structure
            persona_dict = {
                "name": tiny_person.get("name", "Generated Agent"),
                "age": tiny_person.get("age"),
                "gender": tiny_person.get("gender"),
                "nationality": tiny_person.get("nationality"),
                "residence": tiny_person.get("residence"),
                "education": tiny_person.get("education"),
                "occupation": tiny_person.get("occupation"),
                "personality": tiny_person.get("personality"),
                "preferences": tiny_person.get("preferences"),
                "skills": tiny_person.get("skills"),
                "beliefs": tiny_person.get("beliefs"),
                "behaviors": tiny_person.get("behaviors"),
            }

            # Create agent from generated persona
            from app.models.agent import Persona
            persona = Persona(**persona_dict)
            agent_create = AgentCreate(persona=persona)

            return self.create_agent(agent_create)

        except Exception as e:
            raise Exception(f"Failed to generate agent: {str(e)}")


# Global instance
agent_service = AgentService()
