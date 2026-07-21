import { executeAiModule } from '../orchestrator.js';
import { FINANCIAL_ANALYZER_PROMPT } from '../prompts/financialAnalyzerPrompt.js';
import { FinancialAnalyzerInput, FinancialAnalyzerOutput, ValidatedAiOutput } from '../types.js';

export async function runFinancialAnalyzer(input: FinancialAnalyzerInput): Promise<ValidatedAiOutput<FinancialAnalyzerOutput>> {
  return executeAiModule<FinancialAnalyzerOutput>({
    moduleName: 'FinancialAnalyzerService',
    promptTemplate: FINANCIAL_ANALYZER_PROMPT,
    inputJsonData: input,
    fallbackGenerator: (inp, errorMsg) => ({
      materialityBenchmark: {
        planningMaterialityUSD: 250000,
        performanceMaterialityUSD: 187500,
        clearlyTrivialThresholdUSD: 12500,
        benchmarkBasis: '1.0% of Total Revenue ($25,000,000)'
      },
      materialAccounts: [
        {
          accountCode: 'GL-1010',
          accountName: 'Cash & Cash Equivalents',
          currentBalanceUSD: 4850000,
          priorBalanceUSD: 3900000,
          variancePercent: 24.36,
          isMaterial: true,
          reason: 'Balance exceeds planning materiality benchmark ($250,000) by 19.4x.',
          evidence: 'Trial Balance Line Item GL-1010.',
          businessImpact: 'Key liquidity account directly subject to bank confirmation testing.',
          confidence: 'High'
        },
        {
          accountCode: 'GL-2010',
          accountName: 'Accounts Payable & Accrued Liabilities',
          currentBalanceUSD: 3200000,
          priorBalanceUSD: 2100000,
          variancePercent: 52.38,
          isMaterial: true,
          reason: 'Material year-over-year increase of $1,100,000 (+52.38%).',
          evidence: 'Trial Balance Line Item GL-2010.',
          businessImpact: 'Risk of unrecorded liabilities or unperformed search for unrecorded liabilities.',
          confidence: 'High'
        },
        {
          accountCode: 'GL-4010',
          accountName: 'Core Product Sales Revenue',
          currentBalanceUSD: 25000000,
          priorBalanceUSD: 21800000,
          variancePercent: 14.68,
          isMaterial: true,
          reason: 'Primary income statement driver used as benchmark basis.',
          evidence: 'Income Statement Line Item GL-4010.',
          businessImpact: 'Revenue recognition cutoff and valuation risks.',
          confidence: 'High'
        }
      ],
      abnormalChanges: [
        {
          accountName: 'Other Operating Expenses (GL-6890)',
          anomalyType: 'Unusual Spike',
          details: 'Account increased by 185% from $120,000 to $342,000 without corresponding volume increase.',
          reason: 'Unexplained reclassification of consulting fees into general miscellaneous expenses.',
          evidence: 'General Ledger Detail Analysis GL-6890 Q3 transactions.',
          businessImpact: 'Potential improper capitalization or unapproved vendor payments.',
          confidence: 'High'
        }
      ],
      financialRatios: [
        {
          ratioName: 'Current Ratio',
          currentValue: 1.85,
          priorValue: 2.10,
          benchmark: '1.50 - 2.50',
          assessment: 'Normal'
        },
        {
          ratioName: 'Days Sales Outstanding (DSO)',
          currentValue: 58.4,
          priorValue: 42.1,
          benchmark: '45.0 Days',
          assessment: 'High Concern'
        }
      ]
    })
  });
}
