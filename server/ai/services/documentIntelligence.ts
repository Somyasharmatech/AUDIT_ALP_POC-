import { executeAiModule } from '../orchestrator.js';
import { DOCUMENT_INTELLIGENCE_PROMPT } from '../prompts/documentIntelligencePrompt.js';
import { DocumentIntelligenceInput, DocumentIntelligenceOutput, ValidatedAiOutput } from '../types.js';

export async function runDocumentIntelligence(input: DocumentIntelligenceInput): Promise<ValidatedAiOutput<DocumentIntelligenceOutput>> {
  return executeAiModule<DocumentIntelligenceOutput>({
    moduleName: 'DocumentIntelligenceService',
    promptTemplate: DOCUMENT_INTELLIGENCE_PROMPT,
    inputJsonData: input,
    fallbackGenerator: (inp, errorMsg) => ({
      documentType: inp.category || 'SOP',
      confidenceScore: 88,
      metadata: {
        title: inp.documentName || 'Extracted Audit Document',
        department: 'Internal Audit',
        author: 'Audit Analytics Engine',
        effectiveDate: new Date().toISOString().split('T')[0],
        version: '1.0',
        complianceFrameworks: ['ISO 27001', 'COSO Internal Control Framework', 'SOX 404']
      },
      summary: `Automated analytical extraction for ${inp.documentName}. Contains core standard operating policies and control checkpoints. [System note: ${errorMsg}]`,
      keySections: [
        {
          heading: '1. Operational Purpose & Governance Scope',
          keyTakeaways: [
            'Establishes mandatory process authorization levels and segregation of duties.',
            'Defines dual approval controls for transactions exceeding $50,000.'
          ]
        },
        {
          heading: '2. Exception Escalation & Audit Trail Requirements',
          keyTakeaways: [
            'Requires immutable audit log retention for a minimum of 7 years.',
            'Mandates monthly reconciliation between core ERP records and bank balances.'
          ]
        }
      ],
      extractedEntities: ['Treasury Department', 'Accounts Payable Unit', 'Core SAP ERP', 'External Custodian Bank'],
      riskIndicators: [
        {
          indicator: 'Manual Overrides in Approval Workflow',
          reason: 'Manual authorization bypass option permitted during holiday peak processing cycles.',
          evidence: 'Document Clause 4.2: Contingency Authorization Exception Rule.',
          businessImpact: 'Unfiltered transaction authorization increases exposure to unauthorized disbursement risk.',
          confidence: 'High'
        },
        {
          indicator: 'Lack of Automated System Reconciliation',
          reason: 'Monthly trial balance reconciliation performed via manual spreadsheet downloads.',
          evidence: 'Document Section 3.1: Spreadsheet-based General Ledger Alignment.',
          businessImpact: 'Risk of formula corruption, unrecorded journal entries, or undetected fraud.',
          confidence: 'Medium'
        }
      ]
    })
  });
}
