import { executeAiModule } from '../orchestrator.js';
import { SCOPING_GENERATOR_PROMPT } from '../prompts/scopingGeneratorPrompt.js';
import { ScopingGeneratorInput, ScopingGeneratorOutput, ValidatedAiOutput } from '../types.js';

export async function runScopingGenerator(input: ScopingGeneratorInput): Promise<ValidatedAiOutput<ScopingGeneratorOutput>> {
  return executeAiModule<ScopingGeneratorOutput>({
    moduleName: 'ScopingGeneratorService',
    promptTemplate: SCOPING_GENERATOR_PROMPT,
    inputJsonData: input,
    fallbackGenerator: (inp, errorMsg) => ({
      engagementName: inp.engagementName || 'Enterprise Financial Audit',
      inScopeProcesses: [
        {
          processName: 'Accounts Payable & Wire Disbursement Processing',
          rationale: 'High materiality throughput ($18M annual disbursements) and critical risk score.',
          reason: 'Material accounts payable line item GL-2010 ($3.2M) and risk rating High.',
          evidence: 'Financial Analysis GL-2010 & Risk Matrix #RISK-01.',
          businessImpact: 'High risk of cash leakage, unrecorded liabilities, or payment fraud.',
          confidence: 'High'
        },
        {
          processName: 'Accounts Receivable Collection & Credit Loss Provisioning',
          rationale: 'DSO expanded to 58.4 days; material variance in reserve calculations.',
          reason: 'Quantitative financial ratio anomaly detected during analytical procedures.',
          evidence: 'Financial Ratio DSO: 58.4 Days.',
          businessImpact: 'Risk of misstated asset balances and delayed write-off recognition.',
          confidence: 'High'
        }
      ],
      outOfScope: [
        {
          item: 'Fixed Assets Depreciation & Capitalized Asset Disposal',
          exclusionReason: 'Low transactional volume and negligible audit findings in past 3 consecutive years.',
          reason: 'Assessed as low inherent risk during preliminary risk scoring.',
          evidence: 'Historical Audit Report FY24 WP-301.',
          businessImpact: 'Optimizes audit budget by excluding low-exposure operational areas.',
          confidence: 'High'
        },
        {
          item: 'Payroll & Employee Equity Plan Administration',
          exclusionReason: 'Subject to separate independent external SOC 1 Type II audit coverage.',
          reason: 'Controls independently tested and verified by external auditor report.',
          evidence: 'SOC 1 Type II Report dated Nov 2024.',
          businessImpact: 'Eliminates redundant testing and reduces audit fatigue on HR operations.',
          confidence: 'High'
        }
      ],
      systemsAndApplications: [
        {
          systemName: 'SAP S/4HANA Finance Module',
          vendor: 'SAP SE',
          systemType: 'ERP',
          testingRequired: true,
          reason: 'Primary ledger hosting accounts payable, general ledger, and financial reporting.',
          evidence: 'SOP Process Flow Section 2.',
          businessImpact: 'Core financial system storing all material general ledger transactions.',
          confidence: 'High'
        },
        {
          systemName: 'CitiDirect Commercial Banking Portal',
          vendor: 'Citigroup',
          systemType: 'Payment Gateway',
          testingRequired: true,
          reason: 'Hosts online wire payment execution and dual signatory approval workflows.',
          evidence: 'Treasury SOP Clause 5.1.',
          businessImpact: 'Direct gateway for corporate cash disbursements.',
          confidence: 'High'
        }
      ],
      departmentsAndLocations: [
        {
          departmentOrEntity: 'Corporate Treasury & AP Unit',
          location: 'Headquarters (New York, NY)',
          inScope: true
        },
        {
          departmentOrEntity: 'Regional Shared Services Center',
          location: 'Dallas, TX',
          inScope: true
        }
      ]
    })
  });
}
