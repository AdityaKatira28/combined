# Deployment Guide

This guide covers deploying the AI Compliance Monitoring application to Coolify.

## Prerequisites

- Coolify instance configured
- Docker and Docker Compose installed (for local testing)
- Git repository access

## Project Structure

```
combined/
├── ai-compliance-demo/     # Backend API (FastAPI)
├── UI-main/               # Frontend UI (React + Vite)
├── docker-compose.yml     # Local development orchestration
└── DEPLOYMENT.md         # This file
```

## Deployment Options

### Option 1: Separate Services (Recommended for Coolify)

Deploy the backend and frontend as separate services in Coolify:

#### Backend API Deployment

1. **Create a new service in Coolify**
   - Source: Git repository
   - Branch: main
   - Root Directory: `ai-compliance-demo`

2. **Build Configuration**
   - Build Command: `docker build -t ai-compliance-api .`
   - Dockerfile: `ai-compliance-demo/Dockerfile`

3. **Environment Variables**
   ```
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-frontend-domain.com
   ```

4. **Port Configuration**
   - Container Port: 8000
   - Exposed Port: 8000

#### Frontend UI Deployment

1. **Create a new service in Coolify**
   - Source: Git repository
   - Branch: main
   - Root Directory: `UI-main`

2. **Build Configuration**
   - Build Command: `docker build -t ai-compliance-ui .`
   - Dockerfile: `UI-main/Dockerfile`

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-domain.com/api
   VITE_ENV=production
   ```

4. **Port Configuration**
   - Container Port: 80
   - Exposed Port: 80

### Option 2: Using captain-definition (Alternative)

The `UI-main/captain-definition` file can be used for CapRover/Coolify deployment:

1. **Deploy using captain-definition**
   - Coolify will automatically detect and use the captain-definition file
   - No additional configuration needed

## Local Development

### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
```

### Manual Development

#### Backend
```bash
cd ai-compliance-demo
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd UI-main
npm install
npm run dev
```

## Troubleshooting

### Common Issues

1. **Backend Build Fails**
   - Ensure `requirements.txt` exists in `ai-compliance-demo/`
   - Check Python version compatibility (3.11+)

2. **Frontend Build Fails**
   - Ensure all dependencies are installed: `npm install --legacy-peer-deps`
   - Check Node.js version (18+)

3. **API Connection Issues**
   - Verify CORS configuration in backend
   - Check `VITE_API_BASE_URL` environment variable
   - Ensure backend is accessible from frontend domain

4. **Port Conflicts**
   - Backend uses port 8000
   - Frontend uses port 80 (nginx) or 3000 (development)

### Health Checks

- Backend Health: `GET /api/health`
- Frontend Health: `GET /health`

### Logs

Check container logs for debugging:
```bash
# Backend logs
docker logs <backend-container-id>

# Frontend logs
docker logs <frontend-container-id>
```

## Environment Variables

### Backend (ai-compliance-demo)
- `ENVIRONMENT`: production/development
- `CORS_ORIGINS`: Comma-separated list of allowed origins

### Frontend (UI-main)
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_ENV`: production/development
- `VITE_ENABLE_ANALYTICS`: true/false
- `VITE_ENABLE_LOGGING`: true/false

## Security Considerations

1. **CORS Configuration**: Ensure CORS origins are properly configured
2. **Environment Variables**: Use secure environment variables in production
3. **Health Checks**: Implement proper health checks for monitoring
4. **HTTPS**: Use HTTPS in production environments

## Monitoring

- Backend health endpoint: `/api/health`
- Frontend health endpoint: `/health`
- API documentation: `/api/docs`
- ReDoc documentation: `/api/redoc` 