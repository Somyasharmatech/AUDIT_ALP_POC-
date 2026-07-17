export interface Audit {
  id: string;
  name: string;
  department: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  createdAt: string;
  logs: AuditLog[];
  analytics?: AuditAnalytics;
  findings: Finding[];
}

export interface AuditLog {
  timestamp: string;
  message: string;
}

export interface Finding {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  confidence: string;
  evidence: string;
  reasoning: string;
  impact: string;
  recommendation: string;
  status: 'pending' | 'accepted' | 'rejected' | 'revision';
}

export interface AuditAnalytics {
  healthScore: number;
  aiConfidence: string;
  timeSaved: string;
  controlsTested: number;
  exceptionsFound: number;
  kpis: { label: string; value: string; trend: string; explanation?: string }[];
  riskHeatmap: { category: string; risk: string; score: number }[];
  monthlyTrend?: { name: string; exceptions: number; amount: number }[];
  vendorDistribution?: { name: string; value: number }[];
  budgetVsActual?: { category: string; budget: number; actual: number }[];
}
