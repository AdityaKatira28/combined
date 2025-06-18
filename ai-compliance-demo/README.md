# AI Compliance Monitoring API

A FastAPI-based backend service for monitoring AI compliance across cloud providers. This service provides endpoints to check compliance status, generate AI-driven insights, and run compliance scans.

## Features

- **Compliance Checks**: Get detailed compliance checks with filtering options
- **Dashboard Summary**: Get an overview of compliance status across frameworks and providers
- **AI Insights**: Get AI-driven insights and recommendations
- **Compliance Scans**: Run on-demand compliance scans on specified resources
- **RESTful API**: Fully documented OpenAPI/Swagger interface

## Prerequisites

- Python 3.11+
- Docker (optional, for containerized deployment)
- pip (Python package manager)

## Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-compliance-demo
   ```

2. **Set up a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. **Run the application**
   ```bash
   uvicorn app.main:app --reload
   ```

6. **Access the API documentation**
   - Swagger UI: http://localhost:8000/api/docs
   - ReDoc: http://localhost:8000/api/redoc

### Docker

1. **Build the Docker image**
   ```bash
   docker build -t ai-compliance-api .
   ```

2. **Run the container**
   ```bash
   docker run -d --name ai-compliance-api -p 8000:8000 --env-file .env ai-compliance-api
   ```

## API Endpoints

- `GET /api/health`: Health check endpoint
- `GET /api/compliance/checks`: Get compliance checks
- `GET /api/compliance/summary`: Get compliance summary
- `GET /api/compliance/insights`: Get AI-driven insights
- `POST /api/compliance/scan`: Run a compliance scan

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to run the application on | `8000` |
| `ENVIRONMENT` | Application environment (development/production) | `development` |
| `CORS_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:3000,https://uiuiui.netlify.app` |
| `SECRET_KEY` | Secret key for JWT token generation | - |
| `ALGORITHM` | Algorithm for JWT token signing | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration time in minutes | `30` |

## Development

### Code Style

This project uses:
- Black for code formatting
- isort for import sorting
- flake8 for linting

### Testing

Run tests with:
```bash
pytest
```

## Deployment

### Heroku

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```
4. Deploy your code:
   ```bash
   git push heroku main
   ```

### AWS ECS

1. Build and push the Docker image to ECR
2. Create an ECS cluster and task definition
3. Configure the service with appropriate load balancer settings
4. Update environment variables in the task definition

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- FastAPI for the awesome web framework
- Pydantic for data validation
- Faker for generating mock data
