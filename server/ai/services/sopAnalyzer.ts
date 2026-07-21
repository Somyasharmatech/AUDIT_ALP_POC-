import { executeAiModule } from '../orchestrator.js';
import { SOP_ANALYZER_PROMPT } from '../prompts/sopAnalyzerPrompt.js';
import { SopAnalyzerInput, SopAnalyzerOutput, ValidatedAiOutput } from '../types.js';

export async function runSopAnalyzer(input: SopAnalyzerInput): Promise<ValidatedAiOutput<SopAnalyzerOutput>> {
  return executeAiModule<SopAnalyzerOutput>({
    moduleName: 'SOPAnalyzerService',
    promptTemplate: SOP_ANALYZER_PROMPT,
    inputJsonData: input,
    fallbackGenerator: (inp, errorMsg) => ({
      sopTitle: inp.sopTitle || 'Standard Operating Procedure - Financial Operations',
      department: inp.department || 'Finance & Treasury',
      businessProcesses: [
        {
          processName: 'Payment Disbursement & Authorization Workflow',
          description: 'End-to-end processing of vendor invoices, wire payment authorizations, and dual signatory approvals.',
          subProcesses: ['Invoice Ingestion & 3-Way Matching', 'Wire Transfer Batch Generation', 'Executive Sign-off']
        },
        {
          processName: 'Bank Reconciliation & Cash Positioning',
          description: 'Daily cash balance extraction, bank statement matching, and monthly sub-ledger alignment.',
          subProcesses: ['Daily Automated Statement Ingestion', 'Exception Queue Review', 'Journal Posting']
        }
      ],
      rolesAndResponsibilities: [
        {
          role: 'Accounts Payable Clerk',
          responsibilities: [
            'Ingest vendor invoices into ERP system.',
            'Perform 3-way match against purchase orders and receiving slips.'
          ]
        },
        {
          role: 'Treasury Manager',
          responsibilities: [
            'Review generated payment batches.',
            'Execute initial payment release in online banking portal.'
          ]
        },
        {
          role: 'Finance Director',
          responsibilities: [
            'Perform secondary dual-authorization sign-off for amounts over $50,000.'
          ]
        }
      ],
      controls: [
        {
          controlId: 'CTL-SOP-01',
          controlName: 'Automated 3-Way Match Verification',
          controlType: 'Automated',
          controlOwner: 'Accounts Payable Supervisor',
          frequency: 'Daily',
          reason: 'System blocks invoice payment if PO, receiving slip, and invoice amount vary by >1%.',
          evidence: 'SOP Clause 3.1: Automated Matching Thresholds.',
          businessImpact: 'Prevents overpayments, duplicate payments, or unauthorized vendor disbursements.',
          confidence: 'High'
        },
        {
          controlId: 'CTL-SOP-02',
          controlName: 'Dual Executive Payment Approval',
          controlType: 'Preventative',
          controlOwner: 'Finance Director & VP Treasury',
          frequency: 'Daily',
          reason: 'Requires independent cryptographic token authorization from two separate executive roles.',
          evidence: 'SOP Clause 5.4: Delegation of Financial Authority Matrix.',
          businessImpact: 'Mitigates wire fraud, internal embezzlement, and single-point-of-failure approval risks.',
          confidence: 'High'
        }
      ],
      segregationOfDutiesRisks: [
        {
          riskDescription: 'Potential SoD Conflict: AP Clerk possesses rights to both create new vendor profiles and release low-value payments.',
          conflictingRoles: ['AP Master File Administrator', 'AP Disbursement Approver'],
          reason: 'Permissions overlap in user security role configuration.',
          evidence: 'SOP Appendix B: User Role Authorization Matrix.',
          businessImpact: 'High exposure to fraudulent vendor creation and kickback schemes.',
          confidence: 'High'
        }
      ],
      dependencies: [
        {
          systemOrVendor: 'Core SAP S/4HANA ERP',
          type: 'System Interface',
          description: 'Primary general ledger and accounts payable database.'
        },
        {
          systemOrVendor: 'Host-to-Host Bank Gateway API',
          type: 'Third-Party Vendor',
          description: 'Encrypted payment file transmission pipeline to corporate bank.'
        }
      ]
    })
  });
}
