"""Application configuration."""

import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # API Configuration
    app_name: str = "OptimusSim"
    app_version: str = "0.1.0"
    debug: bool = False

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # OpenAI Configuration
    openai_api_key: Optional[str] = None
    azure_openai_key: Optional[str] = None
    azure_openai_endpoint: Optional[str] = None

    # API Type (openai or azure)
    api_type: str = "openai"

    # TinyTroupe Configuration
    tinytroupe_model: str = "gpt-4.1-mini"
    tinytroupe_max_tokens: int = 32000
    tinytroupe_temperature: float = 1.5
    tinytroupe_cache_api_calls: bool = False

    # File Storage
    upload_dir: str = "uploads"
    agents_dir: str = "agents"
    simulations_dir: str = "simulations"

    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()


def validate_api_configuration() -> dict[str, any]:
    """
    Validate that required API keys are configured.

    Returns:
        dict: Status information about API configuration
    """
    status = {
        "configured": False,
        "api_type": settings.api_type,
        "issues": []
    }

    if settings.api_type == "openai":
        if not settings.openai_api_key:
            status["issues"].append("OPENAI_API_KEY not set")
        else:
            status["configured"] = True
    elif settings.api_type == "azure":
        if not settings.azure_openai_key:
            status["issues"].append("AZURE_OPENAI_KEY not set")
        if not settings.azure_openai_endpoint:
            status["issues"].append("AZURE_OPENAI_ENDPOINT not set")

        if not status["issues"]:
            status["configured"] = True
    else:
        status["issues"].append(f"Invalid API_TYPE: {settings.api_type}")

    return status
