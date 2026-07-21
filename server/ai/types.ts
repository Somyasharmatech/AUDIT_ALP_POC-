/**
 * Enterprise AI Layer Types
 */

export interface AiObservabilityLog {
  id: string;
  moduleName: string;
  promptLength: number;
  responseLength: number;
  startTime: string;
  endTime: string;
  durationMs: number;
  retryCount: number;
  latencyMs: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCostUSD: number;
  status: 'SUCCESS' | 'RATE_LIMITED' | 'TIMEOUT' | 'ERROR' | 'FALLBACK';
  validationResult: 'PASSED' | 'FAILED_VALIDATION' | 'NEEDS_HUMAN_REVIEW';
  validationErrors?: string[];
  humanApprovalStatus: 'Pending Review' | 'Approved' | 'Rejected' | 'Needs Revision';
  errorDetails?: string;
  timestamp: string;
}

export type AiApprovalStatus = 'Pending Review' | 'Approved' | 'Rejected' | 'Needs Revision';

export interface AiValidationResult {
  isValid: boolean;
  validationResult: 'PASSED' | 'FAILED_VALIDATION' | 'NEEDS_HUMAN_REVIEW';
  errors: string[];
  warnings: string[];
  evidenceCitationsCount: number;
  lowConfidenceItemsCount: number;
  validatedAt: string;
}

export interface AiApprovalRecord {
  status: AiApprovalStatus;
  reviewedBy?: string;
  reviewerName?: string;
  reviewedAt?: string;
  comments?: string;
  revisionRequest?: string;
  version: number;
}

export interface ValidatedAiOutput<T> {
  data: T;
  validation: AiValidationResult;
  approval: AiApprovalRecord;
}

export interface AiServiceOptions {
  timeoutMs?: number;
  maxRetries?: number;
  userId?: string;
  userName?: string;
  engagementId?: string;
}

// 1. Document Intelligence Types
export interface DocumentIntelligenceInput {
  documentName: string;
  category?: string;
  rawText: string;
  filePath?: string;
}

export interface DocumentIntelligenceOutput {
  documentType: string;
  confidenceScore: number;
  metadata: {
    title: string;
    department: string;
    author: string;
    effectiveDate: string;
    version: string;
    complianceFrameworks: string[];
  };
  summary: string;
  keySections: {
    heading: string;
    keyTakeaways: string[];
  }[];
  extractedEntities: string[];
  riskIndicators: {
    indicator: string;
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
}

// 2. Historical Audit Analyzer Types
export interface HistoricalAnalyzerInput {
  engagementName?: string;
  department?: string;
  historicalAudits: any[];
  historicalFindings: any[];
}

export interface HistoricalAnalyzerOutput {
  totalHistoricalAuditsAnalyzed: number;
  findingsSummary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    repeatCount: number;
    openCount: number;
  };
  previousFindings: {
    findingCode: string;
    auditYear: string;
    title: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    isRepeat: boolean;
    repeatCount: number;
    managementResponse: string;
    issueStatus: 'Open' | 'In Progress' | 'Closed' | 'Overdue';
    targetClosureDate: string;
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
  repeatFindingsPattern: {
    findingTitle: string;
    occurrences: number;
    rootCause: string;
    recommendation: string;
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
  historicalTrends: {
    area: string;
    trendDirection: 'Improving' | 'Deteriorating' | 'Stable';
    analysis: string;
  }[];
}

// 3. SOP Analyzer Types
export interface SopAnalyzerInput {
  sopTitle: string;
  department?: string;
  sopText: string;
}

export interface SopAnalyzerOutput {
  sopTitle: string;
  department: string;
  businessProcesses: {
    processName: string;
    description: string;
    subProcesses: string[];
  }[];
  rolesAndResponsibilities: {
    role: string;
    responsibilities: string[];
  }[];
  controls: {
    controlId: string;
    controlName: string;
    controlType: 'Preventative' | 'Detective' | 'Automated' | 'Manual';
    controlOwner: string;
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | 'Ad-hoc';
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
  segregationOfDutiesRisks: {
    riskDescription: string;
    conflictingRoles: string[];
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
  dependencies: {
    systemOrVendor: string;
    type: 'System Interface' | 'Manual Handoff' | 'Third-Party Vendor';
    description: string;
  }[];
}

// 4. Financial Analyzer Types
export interface FinancialAnalyzerInput {
  financialYear?: string;
  department?: string;
  rawFinancialData?: string;
  trialBalanceEntries?: any[];
}

export interface FinancialAnalyzerOutput {
  materialityBenchmark: {
    planningMaterialityUSD: number;
    performanceMaterialityUSD: number;
    clearlyTrivialThresholdUSD: number;
    benchmarkBasis: string;
  };
  materialAccounts: {
    accountCode: string;
    accountName: string;
    currentBalanceUSD: number;
    priorBalanceUSD: number;
    variancePercent: number;
    isMaterial: boolean;
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
  abnormalChanges: {
    accountName: string;
    anomalyType: 'Unusual Spike' | 'Negative Balance' | 'Reclassification Error' | 'Unexplained Variance';
    details: string;
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
  financialRatios: {
    ratioName: string;
    currentValue: number;
    priorValue: number;
    benchmark: string;
    assessment: 'Normal' | 'Watchlist' | 'High Concern';
  }[];
}

// 5. Risk Engine Types
export interface RiskEngineInput {
  engagementName: string;
  department: string;
  historicalAnalysis?: HistoricalAnalyzerOutput;
  financialAnalysis?: FinancialAnalyzerOutput;
  sopAnalysis?: SopAnalyzerOutput;
  questionnaireResponses?: any[];
  documentsSummary?: any[];
}

export interface RiskEngineOutput {
  overallRiskRating: 'High' | 'Medium' | 'Low';
  inherentRiskScore: number;
  controlRiskScore: number;
  residualRiskScore: number;
  riskMatrix: {
    riskId: string;
    riskCategory: 'Financial' | 'Operational' | 'Compliance' | 'Technology' | 'Fraud';
    riskTitle: string;
    riskDescription: string;
    likelihood: number;
    impact: number;
    riskRating: 'High' | 'Medium' | 'Low';
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
  highPriorityFocusAreas: string[];
}

// 6. Planning Generator Types
export interface PlanningGeneratorInput {
  engagementName: string;
  department: string;
  financialYear: string;
  auditType: string;
  riskEngineOutput?: RiskEngineOutput;
  financialOutput?: FinancialAnalyzerOutput;
  historicalOutput?: HistoricalAnalyzerOutput;
  questionnaireResponses?: any;
}

export interface PlanningGeneratorOutput {
  title: string;
  engagementId: string;
  financialYear: string;
  auditType: string;
  executiveSummary: string;
  sections: {
    sectionTitle: string;
    content: string;
    keySubpoints: string[];
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
  planningLeadRecommendations: {
    recommendation: string;
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
}

// 7. Scoping Generator Types
export interface ScopingGeneratorInput {
  engagementName: string;
  department: string;
  auditType: string;
  sopOutput?: SopAnalyzerOutput;
  riskOutput?: RiskEngineOutput;
}

export interface ScopingGeneratorOutput {
  engagementName: string;
  inScopeProcesses: {
    processName: string;
    rationale: string;
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
  outOfScope: {
    item: string;
    exclusionReason: string;
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
  systemsAndApplications: {
    systemName: string;
    vendor: string;
    systemType: 'ERP' | 'Database' | 'Payment Gateway' | 'Core Banking' | 'Cloud Service';
    testingRequired: boolean;
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
  departmentsAndLocations: {
    departmentOrEntity: string;
    location: string;
    inScope: boolean;
  }[];
}

// 8. Audit Program Generator Types
export interface AuditProgramGeneratorInput {
  engagementName: string;
  auditType: string;
  riskOutput?: RiskEngineOutput;
  scopingOutput?: ScopingGeneratorOutput;
}

export interface AuditProgramGeneratorOutput {
  auditProgramTitle: string;
  totalProcedures: number;
  procedures: {
    procedureId: string;
    riskRef: string;
    controlObjective: string;
    procedureDescription: string;
    testingMethodology: 'Inspection' | 'Reperformance' | 'Observation' | 'Inquiry' | 'Analytical Procedure';
    requiredEvidence: string;
    sampleSize: string;
    assignedRole: string;
    reason: string;
    evidence: string;
    businessImpact: string;
    confidence: 'High' | 'Medium' | 'Low';
  }[];
}
