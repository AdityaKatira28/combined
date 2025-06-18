import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { complianceApi } from '@/services/api'; 
import { toast } from 'sonner';

interface ComplianceCheck {
  id: string;
  framework: string;
  provider: string;
  severity: string;
  status: string;
  risk_score: number;
  description: string;
  last_checked: string;
  ai_summary: string;
}

interface DashboardSummary {
  total_checks: number;
  compliant: number;
  non_compliant: number;
  critical_count: number;
  framework_scores: Record<string, number>;
  provider_stats: Record<string, { passing: number; failing: number; warning: number }>;
  recent_violations: ComplianceCheck[];
}

interface AiInsights {
  summary: {
    critical_violations: number;
    most_common_failure: string;
    most_problematic_provider: string;
    compliance_score: number;
  };
  recommendations: Array<{
    priority: string;
    action: string;
  }>;
}

export const ComplianceDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [insights, setInsights] = useState<AiInsights | null>(null);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);

  // API error state
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [summaryData, checksData, insightsData] = await Promise.all([
        complianceApi.getComplianceSummary(),
        complianceApi.getComplianceChecks(),
        complianceApi.getAiInsights()
      ]);
      
      setSummary(summaryData);
      setChecks(checksData);
      setInsights(insightsData);
      
      toast.success('Compliance data loaded successfully');
    } catch (err) {
      console.error('Error fetching compliance data:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load compliance data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRunScan = async () => {
    try {
      setScanning(true);
      setError(null);
      
      await complianceApi.runComplianceScan(['all']);
      
      // Update last scan time
      const now = new Date().toLocaleString();
      setLastScan(now);
      
      // Refresh data after a short delay to allow backend to process
      setTimeout(() => {
        fetchData();
      }, 1000);
      
      toast.success('Compliance scan completed successfully');
    } catch (err) {
      console.error('Error running compliance scan:', err);
      const errorMessage = err.response?.data?.message || 'Failed to run compliance scan';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !summary) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <span className="text-slate-400">Loading compliance data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-medium text-white">Error loading compliance data</h3>
        <p className="text-slate-400 max-w-md">{error}</p>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          className="mt-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Compliance Monitoring</h2>
          <p className="text-slate-400">Track and manage your compliance status across frameworks</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
          <Button 
            onClick={handleRunScan} 
            disabled={scanning || loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {scanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              'Run Scan'
            )}
          </Button>
        </div>
      </div>

      {lastScan && (
        <div className="text-sm text-slate-400">
          Last scan: {lastScan}
        </div>
      )}

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="checks">All Checks</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          {summary && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Total Checks
                  </CardTitle>
                  <ShieldCheck className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{summary.total_checks}</div>
                  <p className="text-xs text-slate-400">across all frameworks</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Compliant
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{summary.compliant}</div>
                  <p className="text-xs text-slate-400">
                    {Math.round((summary.compliant / summary.total_checks) * 100)}% of total
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Non-Compliant
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{summary.non_compliant}</div>
                  <p className="text-xs text-slate-400">
                    {Math.round((summary.non_compliant / summary.total_checks) * 100)}% of total
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Critical Issues
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">{summary.critical_count}</div>
                  <p className="text-xs text-slate-400">requires immediate attention</p>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Framework Scores */}
          {summary && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Compliance by Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(summary.framework_scores).map(([framework, score]) => (
                    <div key={framework} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{framework}</span>
                        <span className="font-medium text-white">{score}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full",
                            score >= 80 ? "bg-green-500" : 
                            score >= 50 ? "bg-yellow-500" : "bg-red-500"
                          )}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Recent Violations */}
          {summary?.recent_violations && summary.recent_violations.length > 0 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Violations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary.recent_violations.map((violation) => (
                    <div key={violation.id} className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-white">{violation.framework} - {violation.description}</h4>
                          <p className="text-sm text-slate-400 mt-1">{violation.ai_summary}</p>
                        </div>
                        <Badge 
                          variant={violation.severity === 'Critical' ? 'destructive' : 'warning'}
                          className="ml-2"
                        >
                          {violation.severity}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-slate-400 flex items-center">
                        <span>Provider: {violation.provider}</span>
                        <span className="mx-2">•</span>
                        <span>Risk Score: {violation.risk_score}/10</span>
                        <span className="mx-2">•</span>
                        <span>Last checked: {new Date(violation.last_checked).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="checks" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">All Compliance Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Framework
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Provider
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Severity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Last Checked
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {checks.map((check) => (
                      <tr key={check.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {check.framework}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {check.provider}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300 max-w-xs truncate">
                          {check.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            check.status === 'Passing' ? 'bg-green-100 text-green-800' :
                            check.status === 'Failing' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          )}>
                            {check.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={cn(
                            "font-medium",
                            check.severity === 'Critical' ? 'text-red-500' :
                            check.severity === 'High' ? 'text-orange-500' :
                            check.severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'
                          )}>
                            {check.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {new Date(check.last_checked).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {insights && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Compliance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-300">Overall Compliance Score</h4>
                      <div className="mt-2 flex items-center">
                        <div className="relative w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "absolute top-0 left-0 h-full",
                              insights.summary.compliance_score >= 80 ? "bg-green-500" :
                              insights.summary.compliance_score >= 50 ? "bg-yellow-500" : "bg-red-500"
                            )}
                            style={{ width: `${insights.summary.compliance_score}%` }}
                          />
                        </div>
                        <span className="ml-4 text-white font-medium">
                          {Math.round(insights.summary.compliance_score)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-300">Key Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-xs text-slate-400">Critical Violations</p>
                          <p className="text-xl font-bold text-red-500">
                            {insights.summary.critical_violations}
                          </p>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-xs text-slate-400">Most Problematic</p>
                          <p className="text-xl font-bold text-white truncate">
                            {insights.summary.most_problematic_provider}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Most Common Issue</h4>
                      <p className="text-slate-300">{insights.summary.most_common_failure}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-start">
                          <div className={cn(
                            "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3 mt-0.5",
                            rec.priority === 'High' ? 'bg-red-500' :
                            rec.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          )}>
                            {rec.priority === 'High' ? (
                              <span className="text-xs font-bold text-white">!</span>
                            ) : rec.priority === 'Medium' ? (
                              <span className="text-xs font-bold text-white">i</span>
                            ) : (
                              <span className="text-xs font-bold text-white">✓</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{rec.action}</h4>
                            <p className="text-xs text-slate-400 mt-1">
                              Priority: {rec.priority}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceDashboard;
