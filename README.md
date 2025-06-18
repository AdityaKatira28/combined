# AI Compliance Monitoring System

A comprehensive AI compliance monitoring system with a React frontend and FastAPI backend, designed to monitor and manage AI compliance across cloud providers.

## 🚀 Features

- **Compliance Dashboard**: Real-time monitoring of compliance status
- **AI-Driven Insights**: Automated analysis and recommendations
- **Multi-Provider Support**: AWS, Azure, GCP compliance monitoring
- **Framework Coverage**: SOC 2, HIPAA, GDPR, PCI-DSS, NIST, ISO 27001
- **Interactive UI**: Modern React interface with real-time updates
- **RESTful API**: Fully documented FastAPI backend

## 📁 Project Structure

```
combined/
├── ai-compliance-demo/     # Backend API (FastAPI)
│   ├── app/
│   │   ├── routers/       # API routes
│   │   ├── main.py        # FastAPI application
│   │   ├── models.py      # Pydantic models
│   │   └── utils.py       # Data generation utilities
│   ├── Dockerfile         # Backend containerization
│   └── requirements.txt   # Python dependencies
├── UI-main/               # Frontend UI (React + Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── hooks/         # Custom React hooks
│   ├── Dockerfile         # Frontend containerization
│   ├── captain-definition # Coolify deployment config
│   └── package.json       # Node.js dependencies
├── docker-compose.yml     # Local development orchestration
└── DEPLOYMENT.md         # Deployment guide
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd combined
   ```

2. **Start with Docker Compose (Recommended)**
   ```bash
   docker-compose up --build
   ```
   
   Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/api/docs

3. **Manual Development Setup**

   **Backend:**
   ```bash
   cd ai-compliance-demo
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   **Frontend:**
   ```bash
   cd UI-main
   npm install --legacy-peer-deps
   npm run dev
   ```

## 🚀 Deployment

### Coolify Deployment

This project is configured for Coolify deployment. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

**Quick Deployment Steps:**

1. **Backend Service**
   - Source: Git repository
   - Root Directory: `ai-compliance-demo`
   - Build Command: `docker build -t ai-compliance-api .`

2. **Frontend Service**
   - Source: Git repository  
   - Root Directory: `UI-main`
   - Build Command: `docker build -t ai-compliance-ui .`

### Environment Variables

**Backend:**
- `ENVIRONMENT`: production/development
- `CORS_ORIGINS`: Comma-separated list of allowed origins

**Frontend:**
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_ENV`: production/development

## 📊 API Endpoints

- `GET /api/health` - Health check
- `GET /api/compliance/checks` - Get compliance checks
- `GET /api/compliance/summary` - Get compliance summary
- `GET /api/compliance/insights` - Get AI insights
- `POST /api/compliance/scan` - Run compliance scan
- `GET /api/docs` - Swagger documentation

## 🔧 Development

### Backend Development

The backend is built with FastAPI and provides:
- RESTful API endpoints
- Automatic API documentation
- CORS middleware
- Health checks
- Mock data generation

### Frontend Development

The frontend is built with:
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Shadcn/ui components
- React Router for navigation
- TanStack Query for data fetching

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure all dependencies are installed
   - Check Node.js and Python versions
   - Verify Docker is running

2. **API Connection Issues**
   - Check CORS configuration
   - Verify environment variables
   - Ensure backend is accessible

3. **Port Conflicts**
   - Backend: 8000
   - Frontend: 3000 (dev) / 80 (prod)

### Health Checks

- Backend: `GET /api/health`
- Frontend: `GET /health`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For deployment issues, refer to [DEPLOYMENT.md](DEPLOYMENT.md) or check the troubleshooting section above. 