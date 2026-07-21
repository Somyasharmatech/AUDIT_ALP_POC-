import { aiObservability } from './observability.js';
export { aiObservability };

export async function runDocumentIntelligence(input: any) {
  const { runDocumentIntelligence } = await import('./services/documentIntelligence.js');
  return runDocumentIntelligence(input);
}

export async function runHistoricalAnalyzer(input: any) {
  const { runHistoricalAnalyzer } = await import('./services/historicalAnalyzer.js');
  return runHistoricalAnalyzer(input);
}

export async function runSopAnalyzer(input: any) {
  const { runSopAnalyzer } = await import('./services/sopAnalyzer.js');
  return runSopAnalyzer(input);
}

export async function runFinancialAnalyzer(input: any) {
  const { runFinancialAnalyzer } = await import('./services/financialAnalyzer.js');
  return runFinancialAnalyzer(input);
}

export async function runRiskEngine(input: any) {
  const { runRiskEngine } = await import('./services/riskEngine.js');
  return runRiskEngine(input);
}

export async function runPlanningGenerator(input: any) {
  const { runPlanningGenerator } = await import('./services/planningGenerator.js');
  return runPlanningGenerator(input);
}

export async function runScopingGenerator(input: any) {
  const { runScopingGenerator } = await import('./services/scopingGenerator.js');
  return runScopingGenerator(input);
}

export async function runAuditProgramGenerator(input: any) {
  const { runAuditProgramGenerator } = await import('./services/auditProgramGenerator.js');
  return runAuditProgramGenerator(input);
}

export async function executeStage1(input: any) {
  const { executeStage1 } = await import('./stagedOrchestrator.js');
  return executeStage1(input);
}

export async function executeStage2(input: any) {
  const { executeStage2 } = await import('./stagedOrchestrator.js');
  return executeStage2(input);
}

export async function executeStage3(input: any) {
  const { executeStage3 } = await import('./stagedOrchestrator.js');
  return executeStage3(input);
}

export async function executeStage4(input: any) {
  const { executeStage4 } = await import('./stagedOrchestrator.js');
  return executeStage4(input);
}

export * from './types.js';
export * from './observability.js';
export * from './orchestrator.js';
export * from './validator.js';
export * from './humanReview.js';

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
