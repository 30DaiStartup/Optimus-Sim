"""Main FastAPI application entry point."""

import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add TinyTroupe to path
tinytroupe_path = os.path.join(os.path.dirname(__file__), "..", "..", "TinyTroupe")
sys.path.insert(0, tinytroupe_path)

from app.core.config import settings, validate_api_configuration


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Runs on startup and shutdown.
    """
    # Startup
    print(f"\n{'='*60}")
    print(f"{settings.app_name} v{settings.app_version}")
    print(f"{'='*60}\n")

    # Validate API configuration
    api_status = validate_api_configuration()
    if api_status["configured"]:
        print(f"✓ API Configuration: {api_status['api_type'].upper()}")
    else:
        print(f"✗ API Configuration Issues:")
        for issue in api_status["issues"]:
            print(f"  - {issue}")
        print("\nPlease configure API keys in .env file or environment variables")

    # Create necessary directories
    os.makedirs(settings.upload_dir, exist_ok=True)
    os.makedirs(settings.agents_dir, exist_ok=True)
    os.makedirs(settings.simulations_dir, exist_ok=True)

    print(f"\n{settings.app_name} is ready! 🚀\n")

    yield

    # Shutdown
    print(f"\n{settings.app_name} shutting down...")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="Web interface for TinyTroupe multiagent simulations",
    version=settings.app_version,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint - API status."""
    api_status = validate_api_configuration()

    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "api_configured": api_status["configured"],
        "api_type": api_status["api_type"],
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# API Routes
from app.api import agents, simulations

app.include_router(agents.router, prefix="/api/agents", tags=["agents"])
app.include_router(simulations.router, prefix="/api/simulations", tags=["simulations"])
