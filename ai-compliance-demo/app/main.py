from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles
from typing import List, Dict, Any, Optional
from datetime import datetime
import os
from dotenv import load_dotenv

from .routers import compliance

# Load environment variables
load_dotenv()

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="AI Compliance Monitoring API",
        description="API for monitoring and managing AI compliance across cloud providers",
        version="1.0.0",
        docs_url=None,  # Disable default docs to use custom ones
        redoc_url=None
    )

    # Configure CORS
    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,https://uiuiui.netlify.app").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(compliance.router, prefix="/api", tags=["Compliance"])

    # Health check endpoint
    @app.get("/api/health")
    async def health_check():
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "environment": os.getenv("ENVIRONMENT", "development")
        }

    # Custom API documentation
    @app.get("/api/docs", include_in_schema=False)
    async def custom_swagger_ui_html():
        return get_swagger_ui_html(
            openapi_url="/api/openapi.json",
            title="AI Compliance API - Swagger UI",
            oauth2_redirect_url=None,
            swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-bundle.js",
            swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.css",
        )

    @app.get("/api/redoc", include_in_schema=False)
    async def redoc_html():
        return get_redoc_html(
            openapi_url="/api/openapi.json",
            title="AI Compliance API - ReDoc",
            redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"
        )

    @app.get("/api/openapi.json", include_in_schema=False)
    async def get_open_api_endpoint():
        return get_openapi(
            title=app.title,
            version=app.version,
            description=app.description,
            routes=app.routes,
        )

    return app

# Create the FastAPI application
app = create_app()

# Add a simple root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to the AI Compliance Monitoring API",
        "docs": "/api/docs",
        "environment": os.getenv("ENVIRONMENT", "development")
    }
