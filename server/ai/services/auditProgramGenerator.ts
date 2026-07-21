import { executeAiModule } from '../orchestrator.js';
import { AUDIT_PROGRAM_GENERATOR_PROMPT } from '../prompts/auditProgramGeneratorPrompt.js';
import { AuditProgramGeneratorInput, AuditProgramGeneratorOutput, ValidatedAiOutput } from '../types.js';

export async function runAuditProgramGenerator(input: AuditProgramGeneratorInput): Promise<ValidatedAiOutput<AuditProgramGeneratorOutput>> {
  return executeAiModule<AuditProgramGeneratorOutput>({
    moduleName: 'AuditProgramGeneratorService',
    promptTemplate: AUDIT_PROGRAM_GENERATOR_PROMPT,
    inputJsonData: input,
    fallbackGenerator: (inp, errorMsg) => ({
      auditProgramTitle: `Tailored Audit Test Program - ${inp.engagementName || 'Audit Engagement'}`,
      totalProcedures: 4,
      procedures: [
        {
          procedureId: 'PROC-AP-01',
          riskRef: 'RISK-01',
          controlObjective: 'Ensure all wire disbursements over $50,000 possess dual executive cryptographic approval.',
          procedureDescription: 'Obtain banking portal electronic audit logs for a sample of 25 wire disbursements exceeding $50,000. Inspect dual authorization timestamps and verify independent user IDs.',
          testingMethodology: 'Inspection',
          requiredEvidence: 'CitiDirect Portal Electronic Payment Audit Trail Export & SAP AP Voucher Detail.',
          sampleSize: '25 Items (Random Sample across FY25 Q1-Q3)',
          assignedRole: 'Senior Internal Auditor',
          reason: 'Mitigates Risk #RISK-01 (Unauthorized Wire Disbursements).',
          evidence: 'Risk Matrix Entry RISK-01 & SOP Clause 5.4.',
          businessImpact: 'Prevents single-user authorization bypass and wire fraud.',
          confidence: 'High'
        },
        {
          procedureId: 'PROC-AP-02',
          riskRef: 'RISK-01',
          controlObjective: 'Verify that manual authorization contingency overrides were appropriately logged and approved by the CAE.',
          procedureDescription: 'Inquire with Treasury Manager regarding instances where contingency manual overrides were utilized. Inspect Exception Authorization Log and cross-reference with CAE sign-off records.',
          testingMethodology: 'Inquiry',
          requiredEvidence: 'Manual Override Logbook & Email Approval Retainers.',
          sampleSize: '100% Population of Override Logs in FY25',
          assignedRole: 'Audit Manager',
          reason: 'Directly addresses SOP Clause 4.2 contingency override clause.',
          evidence: 'Document Intelligence Risk Indicator #01.',
          businessImpact: 'Detects unauthorized override usage or internal control circumvention.',
          confidence: 'High'
        },
        {
          procedureId: 'PROC-AR-01',
          riskRef: 'RISK-02',
          controlObjective: 'Ensure allowance for doubtful accounts adequately reflects expanded DSO and aging risk buckets.',
          procedureDescription: 'Re-perform the bad debt reserve calculation using the aged trial balance report as of Q3 end. Recalculate reserve percentages applied to accounts >90 days overdue.',
          testingMethodology: 'Reperformance',
          requiredEvidence: 'Aged Accounts Receivable Sub-ledger & Credit Committee Minutes.',
          sampleSize: 'Full Sub-ledger Analysis & Top 10 Overdue Accounts',
          assignedRole: 'Lead Financial Auditor',
          reason: 'Responds to Financial Ratio Anomaly DSO expansion from 42 to 58 days.',
          evidence: 'Financial Analysis Ratio Section.',
          businessImpact: 'Ensures net realizable value of receivables is accurately reflected on balance sheet.',
          confidence: 'High'
        },
        {
          procedureId: 'PROC-IT-01',
          riskRef: 'RISK-03',
          controlObjective: 'Ensure segregation of duties between vendor master creation and payment voucher approval.',
          procedureDescription: 'Extract SAP S/4HANA user authorization matrix for AP roles. Run automated conflict analysis query to identify active users possessing both Role_AP_Master_Admin and Role_AP_Pay_Release.',
          testingMethodology: 'Analytical Procedure',
          requiredEvidence: 'SAP SU24/SU01 User Authorization Export.',
          sampleSize: '100% User Population in SAP AP Module',
          assignedRole: 'IT Audit Specialist',
          reason: 'Mitigates Segregation of Duties risk identified during SOP review.',
          evidence: 'SOP Appendix B User Access Matrix.',
          businessImpact: 'Prevents creation of fictitious vendors and self-approved fraudulent vouchers.',
          confidence: 'High'
        }
      ]
    })
  });
}
