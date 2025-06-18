from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional, Dict, Any
from datetime import datetime
from ..models import ComplianceCheck, DashboardSummary, AiInsights, ScanRequest, ScanResult
from ..utils import ComplianceDataGenerator

router = APIRouter()
data_generator = ComplianceDataGenerator()

@router.get("/compliance/checks", response_model=List[ComplianceCheck])
async def get_compliance_checks(
    status: Optional[str] = Query(None, description="Filter by status: Passing, Failing, Warning"),
    severity: Optional[str] = Query(None, description="Filter by severity: Critical, High, Medium, Low")
):
    """
    Get all compliance checks with optional filtering by status and severity.
    """
    checks = data_generator.generate_compliance_data(50)
    
    if status:
        status = status.capitalize()
        if status not in ["Passing", "Failing", "Warning"]:
            raise HTTPException(status_code=400, detail="Invalid status filter. Use: Passing, Failing, or Warning")
        checks = [c for c in checks if c["status"] == status]
    
    if severity:
        severity = severity.capitalize()
        if severity not in ["Critical", "High", "Medium", "Low"]:
            raise HTTPException(status_code=400, detail="Invalid severity filter. Use: Critical, High, Medium, or Low")
        checks = [c for c in checks if c["severity"] == severity]
    
    return checks

@router.get("/compliance/summary", response_model=DashboardSummary)
async def get_compliance_summary():
    """
    Get a summary of compliance status across all frameworks and providers.
    """
    return data_generator.get_dashboard_summary()

@router.get("/compliance/insights", response_model=AiInsights)
async def get_ai_insights():
    """
    Get AI-driven insights and recommendations.
    """
    return data_generator.get_ai_insights()

@router.post("/compliance/scan", response_model=ScanResult)
async def run_compliance_scan(scan_request: ScanRequest):
    """
    Run a compliance scan on the specified resources.
    """
    if not scan_request.resources:
        raise HTTPException(status_code=400, detail="No resources specified for scanning")
    
    return data_generator.perform_scan(scan_request.resources)

@router.get("/health")
async def health_check():
    """
    Health check endpoint for load balancers and monitoring.
    """
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
