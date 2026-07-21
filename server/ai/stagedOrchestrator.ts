import { runDocumentIntelligence } from './services/documentIntelligence.js';
import { runHistoricalAnalyzer } from './services/historicalAnalyzer.js';
import { runSopAnalyzer } from './services/sopAnalyzer.js';
import { runFinancialAnalyzer } from './services/financialAnalyzer.js';
import { runRiskEngine } from './services/riskEngine.js';
import { runPlanningGenerator } from './services/planningGenerator.js';
import { runScopingGenerator } from './services/scopingGenerator.js';
import { runAuditProgramGenerator } from './services/auditProgramGenerator.js';
import { humanReviewManager } from './humanReview.js';
import { aiObservability } from './observability.js';

export interface StagedPipelineInput {
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
 * Stage 1 Execution: Risk Matrix & Background Analysis
 * Executed: Document Intelligence -> Historical Analyzer -> SOP Analyzer -> Financial Analyzer -> Risk Engine
 * STOP: Halts pipeline execution and waits for Human Review and Approval of Stage 1.
 */
export async function executeStage1(input: StagedPipelineInput) {
  const startTime = Date.now();
  const check = humanReviewManager.canExecuteStage(input.engagementId, 1);
  if (!check.allowed) throw new Error(check.reason);

  // 1. Document Intelligence
  const docResults = await Promise.all(
    (input.documents || []).map(doc => runDocumentIntelligence({
      documentName: doc.name,
      category: doc.category,
      rawText: doc.rawText
    }))
  );

  // 2. Historical Analysis
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

  const stageOutputs = {
    documentIntelligence: docResults,
    historicalAnalysis: historicalResult,
    sopAnalysis: sopResult,
    financialAnalysis: financialResult,
    riskMatrix: riskResult
  };

  const stageState = humanReviewManager.saveStageOutputs(input.engagementId, 1, stageOutputs);
  const totalTimeMs = Date.now() - startTime;

  return {
    stageNumber: 1,
    stageName: 'Stage 1: Multi-Source Risk Matrix & Background Analysis',
    status: stageState.status,
    nextAction: 'WAIT_FOR_HUMAN_APPROVAL_STAGE_1',
    executionTimeMs: totalTimeMs,
    stageState,
    results: stageOutputs,
    metricsSummary: aiObservability.getMetricsSummary()
  };
}

/**
 * Stage 2 Execution: Planning Memorandum Generator
 * Pre-requisite: Stage 1 MUST be Approved by a human reviewer.
 * STOP: Halts pipeline execution and waits for Human Review and Approval of Stage 2.
 */
export async function executeStage2(input: StagedPipelineInput) {
  const startTime = Date.now();
  const check = humanReviewManager.canExecuteStage(input.engagementId, 2);
  if (!check.allowed) throw new Error(check.reason);

  const stage1Data = humanReviewManager.getStageState(input.engagementId, 1).aiOutputs;

  const planningResult = await runPlanningGenerator({
    engagementName: input.engagementName,
    department: input.department || 'Internal Audit',
    financialYear: input.financialYear || 'FY2025',
    auditType: input.auditType || 'Operational Review',
    riskEngineOutput: stage1Data.riskMatrix?.data,
    financialOutput: stage1Data.financialAnalysis?.data,
    historicalOutput: stage1Data.historicalAnalysis?.data,
    questionnaireResponses: input.questionnaireResponses
  });

  const stageOutputs = {
    planningMemorandum: planningResult
  };

  const stageState = humanReviewManager.saveStageOutputs(input.engagementId, 2, stageOutputs);
  const totalTimeMs = Date.now() - startTime;

  return {
    stageNumber: 2,
    stageName: 'Stage 2: Planning Memorandum',
    status: stageState.status,
    nextAction: 'WAIT_FOR_HUMAN_APPROVAL_STAGE_2',
    executionTimeMs: totalTimeMs,
    stageState,
    results: stageOutputs,
    metricsSummary: aiObservability.getMetricsSummary()
  };
}

/**
 * Stage 3 Execution: Audit Scoping Document Generator
 * Pre-requisite: Stage 2 MUST be Approved by a human reviewer.
 * STOP: Halts pipeline execution and waits for Human Review and Approval of Stage 3.
 */
export async function executeStage3(input: StagedPipelineInput) {
  const startTime = Date.now();
  const check = humanReviewManager.canExecuteStage(input.engagementId, 3);
  if (!check.allowed) throw new Error(check.reason);

  const stage1Data = humanReviewManager.getStageState(input.engagementId, 1).aiOutputs;

  const scopingResult = await runScopingGenerator({
    engagementName: input.engagementName,
    department: input.department || 'Finance',
    auditType: input.auditType || 'Operational Review',
    sopOutput: stage1Data.sopAnalysis?.data,
    riskOutput: stage1Data.riskMatrix?.data
  });

  const stageOutputs = {
    scopingDocument: scopingResult
  };

  const stageState = humanReviewManager.saveStageOutputs(input.engagementId, 3, stageOutputs);
  const totalTimeMs = Date.now() - startTime;

  return {
    stageNumber: 3,
    stageName: 'Stage 3: Audit Scoping Document',
    status: stageState.status,
    nextAction: 'WAIT_FOR_HUMAN_APPROVAL_STAGE_3',
    executionTimeMs: totalTimeMs,
    stageState,
    results: stageOutputs,
    metricsSummary: aiObservability.getMetricsSummary()
  };
}

/**
 * Stage 4 Execution: Tailored Audit Test Program Generator
 * Pre-requisite: Stage 3 MUST be Approved by a human reviewer.
 * Complete: Final Stage of Pipeline.
 */
export async function executeStage4(input: StagedPipelineInput) {
  const startTime = Date.now();
  const check = humanReviewManager.canExecuteStage(input.engagementId, 4);
  if (!check.allowed) throw new Error(check.reason);

  const stage1Data = humanReviewManager.getStageState(input.engagementId, 1).aiOutputs;
  const stage3Data = humanReviewManager.getStageState(input.engagementId, 3).aiOutputs;

  const auditProgramResult = await runAuditProgramGenerator({
    engagementName: input.engagementName,
    auditType: input.auditType || 'Operational Review',
    riskOutput: stage1Data.riskMatrix?.data,
    scopingOutput: stage3Data.scopingDocument?.data
  });

  const stageOutputs = {
    auditProgram: auditProgramResult
  };

  const stageState = humanReviewManager.saveStageOutputs(input.engagementId, 4, stageOutputs);
  const totalTimeMs = Date.now() - startTime;

  return {
    stageNumber: 4,
    stageName: 'Stage 4: Tailored Audit Test Program',
    status: stageState.status,
    nextAction: 'PIPELINE_STAGES_COMPLETED',
    executionTimeMs: totalTimeMs,
    stageState,
    results: stageOutputs,
    metricsSummary: aiObservability.getMetricsSummary()
  };
}
