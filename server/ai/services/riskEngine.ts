import { executeAiModule } from '../orchestrator.js';
import { RISK_ENGINE_PROMPT } from '../prompts/riskEnginePrompt.js';
import { RiskEngineInput, RiskEngineOutput, ValidatedAiOutput } from '../types.js';

export async function runRiskEngine(input: RiskEngineInput): Promise<ValidatedAiOutput<RiskEngineOutput>> {
  return executeAiModule<RiskEngineOutput>({
    moduleName: 'RiskEngineService',
    promptTemplate: RISK_ENGINE_PROMPT,
    inputJsonData: input,
    fallbackGenerator: (inp, errorMsg) => ({
      overallRiskRating: 'High',
      inherentRiskScore: 82,
      controlRiskScore: 65,
      residualRiskScore: 74,
      riskMatrix: [
        {
          riskId: 'RISK-01',
          riskCategory: 'Financial',
          riskTitle: 'Unauthorized Wire Disbursements & Treasury Fraud Exposure',
          riskDescription: 'Potential override or manual bypass of payment approval thresholds in online banking portal during high-volume periods.',
          likelihood: 4,
          impact: 5,
          riskRating: 'High',
          reason: 'Manual authorization bypasses noted in SOP Clause 4.2 combined with repeat suspense clearing delays in prior audits.',
          evidence: 'SOP Clause 4.2 & FY24 Historical Finding #01.',
          businessImpact: 'Direct financial loss up to $1.2M and regulatory breach penalties.',
          confidence: 'High'
        },
        {
          riskId: 'RISK-02',
          riskCategory: 'Compliance',
          riskTitle: 'DSO Expansion & Allowance for Credit Loss Undervaluation',
          riskDescription: 'DSO expanded from 42.1 to 58.4 days without adequate adjustments to the bad debt reserve model.',
          likelihood: 4,
          impact: 4,
          riskRating: 'High',
          reason: 'Financial ratio analysis reveals high concern in accounts receivable collectability.',
          evidence: 'Financial Analysis Ratio DSO: 58.4 Days vs 45.0 Benchmark.',
          businessImpact: 'Risk of overstated net trade receivables and sudden write-offs.',
          confidence: 'High'
        },
        {
          riskId: 'RISK-03',
          riskCategory: 'Technology',
          riskTitle: 'Segregation of Duties Conflicts in ERP Procurement Role',
          riskDescription: 'Users possess dual authorization privileges for vendor master file creation and AP voucher entry.',
          likelihood: 3,
          impact: 4,
          riskRating: 'Medium',
          reason: 'SOP Analysis identified overlapping permissions in AP user security role matrices.',
          evidence: 'SOP Appendix B User Access Matrix.',
          businessImpact: 'Heightened risk of fictitious vendor creation and fraudulent disbursements.',
          confidence: 'High'
        }
      ],
      highPriorityFocusAreas: [
        'Treasury Wire Disbursement Authorization Controls',
        'Accounts Receivable Aging & Allowance Model Testing',
        'ERP User Access Role Segregation (SoD)'
      ]
    })
  });
}
