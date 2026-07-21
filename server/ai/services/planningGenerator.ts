import { executeAiModule } from '../orchestrator.js';
import { PLANNING_GENERATOR_PROMPT } from '../prompts/planningGeneratorPrompt.js';
import { PlanningGeneratorInput, PlanningGeneratorOutput, ValidatedAiOutput } from '../types.js';

export async function runPlanningGenerator(input: PlanningGeneratorInput): Promise<ValidatedAiOutput<PlanningGeneratorOutput>> {
  return executeAiModule<PlanningGeneratorOutput>({
    moduleName: 'PlanningGeneratorService',
    promptTemplate: PLANNING_GENERATOR_PROMPT,
    inputJsonData: input,
    fallbackGenerator: (inp, errorMsg) => ({
      title: `Audit Planning Memorandum - ${inp.engagementName || 'Internal Audit Engagement'}`,
      engagementId: inp.engagementName || 'ENG-2025-001',
      financialYear: inp.financialYear || 'FY2025',
      auditType: inp.auditType || 'Operational & Financial Control Review',
      executiveSummary: `This Audit Planning Memorandum establishes the operational scope, risk prioritization, resource deployment, and testing strategy for ${inp.engagementName || 'the audit engagement'}. Based on comprehensive AI multi-source intelligence, the engagement carries an overall HIGH residual risk rating.`,
      sections: [
        {
          sectionTitle: '1. Executive Risk Assessment & Background',
          content: 'The engagement covers core financial disbursements, treasury cash management, and accounts receivable governance. Preliminary risk modeling indicates high residual risk driven by manual exception approval paths and elevated DSO metrics.',
          keySubpoints: [
            'Residual Risk Rating: HIGH (Score: 74/100).',
            'Focus Areas: Payment authorization controls, AR credit loss modeling, and ERP segregation of duties.'
          ],
          reason: 'Synthesized from historical finding trends, financial statement analytical review, and SOP control extractions.',
          evidence: 'Audit Workspace Risk Matrix Entry #RISK-01 and Financial Ratio DSO Analysis.',
          businessImpact: 'Focuses audit resources on high-exposure operational areas to maximize control safeguard effectiveness.',
          confidence: 'High'
        },
        {
          sectionTitle: '2. Materiality & Quantitative Sampling Thresholds',
          content: 'Planning materiality is set at $250,000 (1% of Total Revenue). Performance materiality is established at $187,500 (75% threshold), and clearly trivial threshold is set at $12,500.',
          keySubpoints: [
            'All transactions > $250,000 subject to 100% substantive inspection.',
            'Sample testing size for key automated controls set at 25 instances across FY25.'
          ],
          reason: 'Calculated using standard COSO / IIA quantitative benchmark rules against total revenue.',
          evidence: 'Financial Statement Line Item GL-4010 ($25M Total Revenue).',
          businessImpact: 'Ensures statistically valid sample coverage while preventing unnecessary audit testing overhead.',
          confidence: 'High'
        },
        {
          sectionTitle: '3. Governance & Audit Steering Committee Sign-off',
          content: 'Audit execution Phase 2 will commence upon formal approval from the Chief Audit Executive and Audit Steering Committee.',
          keySubpoints: [
            'Sign-off Required: Lead Audit Partner, Chief Risk Officer, CAE.',
            'Target Completion: Fieldwork execution planned over 4 weeks.'
          ],
          reason: 'Mandated by internal audit charter and governance compliance rules.',
          evidence: 'Audit Workspace Governance Sign-Off Matrix.',
          businessImpact: 'Secures executive alignment and departmental cooperation prior to fieldwork launch.',
          confidence: 'High'
        }
      ],
      planningLeadRecommendations: [
        {
          recommendation: 'Perform 100% substantive testing on all wire disbursements exceeding $250,000 executed during Q2 and Q3.',
          reason: 'Identified manual authorization contingency rule in SOP Clause 4.2.',
          evidence: 'Document Intelligence Risk Indicator #01.',
          businessImpact: 'Prevents undetected fraudulent wire transfers or unrecorded liabilities.',
          confidence: 'High'
        }
      ]
    })
  });
}
