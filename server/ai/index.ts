import { runDocumentIntelligence } from './services/documentIntelligence.js';
import { runHistoricalAnalyzer } from './services/historicalAnalyzer.js';
import { runSopAnalyzer } from './services/sopAnalyzer.js';
import { runFinancialAnalyzer } from './services/financialAnalyzer.js';
import { runRiskEngine } from './services/riskEngine.js';
import { runPlanningGenerator } from './services/planningGenerator.js';
import { runScopingGenerator } from './services/scopingGenerator.js';
import { runAuditProgramGenerator } from './services/auditProgramGenerator.js';
import { aiObservability } from './observability.js';

export * from './types.js';
export * from './observability.js';
export * from './orchestrator.js';
export * from './validator.js';
export * from './humanReview.js';
export * from './stagedOrchestrator.js';
export {
  runDocumentIntelligence,
  runHistoricalAnalyzer,
  runSopAnalyzer,
  runFinancialAnalyzer,
  runRiskEngine,
  runPlanningGenerator,
  runScopingGenerator,
  runAuditProgramGenerator
};

export interface FullAuditPipelineInput {
  engagementId: string;
  engagementName: string;
  department?: string;
  auditType?: string;
  financialYear?: string;
  documents?: Array<{ name: string; category?: string; rawText: string }>;
  historicalFindings?: any[];
  historicalAudits?: any[];
  sopText?: string;
  financialData?: any;
  questionnaireResponses?: any;
}

/**
 * Orchestrates the complete end-to-end AI Audit Planning Pipeline:
 * 1. Document Intelligence
 * 2. Historical Audit Analysis
 * 3. SOP Analysis
 * 4. Financial Analysis
 * 5. Multi-Source Risk Matrix Engine
 * 6. Scoping Document Generator
 * 7. Planning Memorandum Generator
 * 8. Tailored Audit Test Program Generator
 */
export async function orchestrateFullAuditPipeline(input: FullAuditPipelineInput) {
  const startTime = Date.now();

  // 1. Document Intelligence on all uploaded files
  const docResults = await Promise.all(
    (input.documents || []).map(doc => runDocumentIntelligence({
      documentName: doc.name,
      category: doc.category,
      rawText: doc.rawText
    }))
  );

  // 2. Historical Audit Analysis
  const historicalResult = await runHistoricalAnalyzer({
    engagementName: input.engagementName,
    department: input.department,
    historicalAudits: input.historicalAudits || [],
    historicalFindings: input.historicalFindings || []
  });

  // 3. SOP Analysis
  const primarySop = input.documents?.find(d => d.category === 'SOP' || d.name.toLowerCase().includes('sop') || d.name.toLowerCase().includes('procedure'));
  const sopResult = await runSopAnalyzer({
    sopTitle: primarySop?.name || `${input.engagementName} Standard Operating Procedure`,
    department: input.department,
    sopText: primarySop?.rawText || input.sopText || 'Standard Operating Procedure details...'
  });

  // 4. Financial Analysis
  const financialResult = await runFinancialAnalyzer({
    financialYear: input.financialYear || 'FY2025',
    department: input.department,
    rawFinancialData: typeof input.financialData === 'string' ? input.financialData : JSON.stringify(input.financialData || {})
  });

  // 5. Risk Engine synthesis
  const riskResult = await runRiskEngine({
    engagementName: input.engagementName,
    department: input.department || 'Internal Audit',
    historicalAnalysis: historicalResult.data,
    financialAnalysis: financialResult.data,
    sopAnalysis: sopResult.data,
    questionnaireResponses: input.questionnaireResponses || [],
    documentsSummary: docResults.map(d => d.data)
  });

  // 6. Scoping Generator
  const scopingResult = await runScopingGenerator({
    engagementName: input.engagementName,
    department: input.department || 'Finance',
    auditType: input.auditType || 'Operational & Financial Control Review',
    sopOutput: sopResult.data,
    riskOutput: riskResult.data
  });

  // 7. Planning Memorandum Generator
  const planningResult = await runPlanningGenerator({
    engagementName: input.engagementName,
    department: input.department || 'Finance',
    financialYear: input.financialYear || 'FY2025',
    auditType: input.auditType || 'Operational & Financial Control Review',
    riskEngineOutput: riskResult.data,
    financialOutput: financialResult.data,
    historicalOutput: historicalResult.data,
    questionnaireResponses: input.questionnaireResponses
  });

  // 8. Audit Program Generator
  const auditProgramResult = await runAuditProgramGenerator({
    engagementName: input.engagementName,
    auditType: input.auditType || 'Operational & Financial Control Review',
    riskOutput: riskResult.data,
    scopingOutput: scopingResult.data
  });

  const totalTimeMs = Date.now() - startTime;

  return {
    engagementId: input.engagementId,
    executionTimeMs: totalTimeMs,
    completedAt: new Date().toISOString(),
    results: {
      documentIntelligence: docResults,
      historicalAnalysis: historicalResult,
      sopAnalysis: sopResult,
      financialAnalysis: financialResult,
      riskMatrix: riskResult,
      scopingDocument: scopingResult,
      planningMemorandum: planningResult,
      auditProgram: auditProgramResult
    },
    metricsSummary: aiObservability.getMetricsSummary()
  };
}
