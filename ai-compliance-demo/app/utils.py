from faker import Faker
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any

fake = Faker()

class ComplianceDataGenerator:
    def __init__(self):
        # Include ISO 27001 for completeness
        self.frameworks = ["SOC 2", "HIPAA", "GDPR", "PCI-DSS", "NIST", "ISO 27001"]
        self.providers = ["AWS", "Azure", "GCP"]
        self.severities = ["Critical", "High", "Medium", "Low"]
        self.control_descriptions = {
            "SOC 2": ["Quarterly access reviews", "Formal code approvals", "Vulnerability scans & remediation"],
            "NIST": ["MFA on admin accounts", "Database encryption at rest", "Protection against malware"],
            "GDPR": ["Data subject rights", "Data breach notification", "Data protection impact assessments"],
            "PCI-DSS": ["Cardholder data encryption", "Access control", "Network security"],
            "HIPAA": ["Encryption of PHI at rest", "Access logging for ePHI", "Periodic risk analysis"],
            "ISO 27001": ["Risk assessments", "Information security policies", "Incident management"]
        }

    def generate_compliance_data(self, count: int = 50) -> List[Dict[str, Any]]:
        """
        Generate a list of mock compliance check records.
        Internally uses datetime for last_checked, but returns ISO strings when packaging for response.
        """
        data: List[Dict[str, Any]] = []
        now = datetime.now()
        for _ in range(count):
            framework = random.choice(self.frameworks)
            descriptions = self.control_descriptions.get(framework, ["General compliance check"])
            description = random.choice(descriptions)
            provider = random.choice(self.providers)
            severity = random.choice(self.severities)
            # Slightly different weights: Passing majority, Warning moderate, Failing fewer
            status = random.choices(["Passing", "Failing", "Warning"], weights=[0.7, 0.2, 0.1])[0]

            # Generate AI summary
            if status == "Passing":
                summary = f"AI confirmed {description} requirements are met."
            else:
                summary = f"AI detected non-compliance with {description} requirements."

            # Generate last_checked as datetime between now and 30 days ago
            delta_days = random.randint(0, 30)
            delta_hours = random.randint(0, 23)
            delta_minutes = random.randint(0, 59)
            last_checked_dt = now - timedelta(days=delta_days, hours=delta_hours, minutes=delta_minutes)

            data.append({
                "id": fake.uuid4(),
                "framework": framework,
                "provider": provider,
                "severity": severity,
                "status": status,
                "risk_score": round(random.uniform(1, 10), 1),
                "description": description,
                "last_checked": last_checked_dt.isoformat(),  # Convert to ISO string
                "ai_summary": summary
            })
        return data

    def perform_scan(self, resources: List[str]) -> Dict[str, Any]:
        """
        Simulate a compliance scan over given resources.
        Returns a dict with scanned count, issues_found, and timestamp.
        """
        issues_found = random.randint(0, len(resources))
        timestamp = datetime.now().isoformat()
        return {
            "scanned": len(resources),
            "issues_found": issues_found,
            "timestamp": timestamp
        }

    def get_dashboard_summary(self) -> Dict[str, Any]:
        """
        Generate a summary of compliance status across all frameworks and providers.
        """
        checks = self.generate_compliance_data(100)  # Generate a larger sample for better stats
        
        total_checks = len(checks)
        compliant = sum(1 for check in checks if check["status"] == "Passing")
        non_compliant = total_checks - compliant
        critical_count = sum(1 for check in checks if check["severity"] == "Critical" and check["status"] != "Passing")
        
        # Calculate framework scores
        framework_scores = {}
        for framework in self.frameworks:
            framework_checks = [c for c in checks if c["framework"] == framework]
            if framework_checks:
                passing = sum(1 for c in framework_checks if c["status"] == "Passing")
                framework_scores[framework] = round((passing / len(framework_checks)) * 100, 1)
        
        # Calculate provider stats
        provider_stats = {}
        for provider in self.providers:
            provider_checks = [c for c in checks if c["provider"] == provider]
            if provider_checks:
                passing = sum(1 for c in provider_checks if c["status"] == "Passing")
                failing = sum(1 for c in provider_checks if c["status"] == "Failing")
                warning = sum(1 for c in provider_checks if c["status"] == "Warning")
                provider_stats[provider] = {
                    "passing": passing,
                    "failing": failing,
                    "warning": warning
                }
        
        # Get recent violations (last 5 failing checks)
        recent_violations = sorted(
            [c for c in checks if c["status"] != "Passing"],
            key=lambda x: x["last_checked"],
            reverse=True
        )[:5]
        
        return {
            "total_checks": total_checks,
            "compliant": compliant,
            "non_compliant": non_compliant,
            "critical_count": critical_count,
            "framework_scores": framework_scores,
            "provider_stats": provider_stats,
            "recent_violations": recent_violations
        }

    def get_ai_insights(self) -> Dict[str, Any]:
        """
        Generate AI-driven insights and recommendations.
        """
        dashboard = self.get_dashboard_summary()
        
        # Count critical violations by provider
        critical_by_provider = {
            provider: sum(1 for v in dashboard["recent_violations"] 
                        if v["provider"] == provider and v["severity"] == "Critical")
            for provider in self.providers
        }
        
        # Find most common failure description
        all_descriptions = [v["description"] for v in dashboard["recent_violations"]]
        most_common_failure = max(set(all_descriptions), key=all_descriptions.count) if all_descriptions else "No recent failures"
        
        # Find most problematic provider
        most_problematic_provider = max(
            dashboard["provider_stats"].items(), 
            key=lambda x: x[1]["failing"] + x[1]["warning"]
        )[0] if dashboard["provider_stats"] else "N/A"
        
        # Generate recommendations
        recommendations = []
        if dashboard["critical_count"] > 0:
            recommendations.append({
                "priority": "High",
                "action": f"Address {dashboard['critical_count']} critical compliance issues"
            })
        
        if dashboard["non_compliant"] / max(1, dashboard["total_checks"]) > 0.2:
            recommendations.append({
                "priority": "Medium",
                "action": "Review and update compliance policies and controls"
            })
        
        if not recommendations:
            recommendations.append({
                "priority": "Low",
                "action": "Continue monitoring compliance status"
            })
        
        return {
            "summary": {
                "critical_violations": dashboard["critical_count"],
                "most_common_failure": most_common_failure,
                "most_problematic_provider": most_problematic_provider,
                "compliance_score": round((dashboard["compliant"] / dashboard["total_checks"]) * 100, 1)
            },
            "recommendations": recommendations
        }
