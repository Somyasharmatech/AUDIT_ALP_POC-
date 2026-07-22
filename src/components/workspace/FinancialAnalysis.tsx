import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { AIReasoningSection } from './AIReasoningSection';

export function FinancialAnalysis() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-3">
        <div>
          <span className="text-xs font-bold text-[#005A9E] uppercase tracking-wider">Financial Audit Analytics</span>
          <h2 className="text-2xl font-bold text-[#212529] mt-1">Financial Analysis & Materiality Benchmarking</h2>
        </div>
        <Badge className="bg-[#005A9E]">ISA 320 Materiality Standard</Badge>
      </div>

      {/* AI REASONING FOR FINANCIAL ANALYSIS */}
      <AIReasoningSection 
        title="AI Financial Materiality & Anomaly Extraction Reasoning"
        whyConclusion="Established Overall Materiality at $1.5M (5% of PBTA) by parsing Trial Balance lines and correlating with prior year audited financial statements."
        preferredConclusionReason="Used Profit Before Tax Benchmark rather than Revenue because net margin volatility in FY25 represents the primary audit concern for stakeholders."
        conflictingEvidence="Trial Balance shows $3.85M in IT Expenses, but capital expenditure logs classify $1.2M of this amount as capitalized cloud migration assets."
        overallConfidence={97}
        influencingDocs={[
          { docName: "Trial Balance Q4 FY25", percentage: 58 },
          { docName: "Audited Financial Statements FY24", percentage: 28 },
          { docName: "General Ledger Transaction Journal", percentage: 14 }
        ]}
        assumptions={[
          {
            assumption: "Assumed non-recurring legacy system maintenance expenses ($450K) will not recur in FY26.",
            reason: "Legacy server retirement confirmed in IT infrastructure status update.",
            impactIfIncorrect: "Overstatement of baseline recurring operating expenditure.",
            confidence: 94
          }
        ]}
        whatIfAnalysis={{
          thirtyDays: "IT software expense misclassifications will distort Q1 departmental budget variances.",
          ninetyDays: "Uncorrected AP aging past 90 days will trigger vendor credit hold warnings.",
          oneEightyDays: "Potential material misstatement audit adjustment during year-end financial closing."
        }}
        limitations={{
          undetermined: "Complete breakdown of unbilled goods received not invoiced (GRNI) accrual sub-ledger.",
          additionalDocsNeeded: "GRNI Aging Schedule and Unbilled Vendor Accruals Log.",
          confidenceGain: "3%"
        }}
      />

      <div className="grid grid-cols-3 gap-6">

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold text-[#005A9E]">Overall Materiality</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
             <div className="text-3xl font-bold text-[#212529] mb-2">$1,500,000</div>
             <p className="text-sm text-[#6C757D]">Calculated as 5% of Net Profit Before Tax ($30M). Base parameter determined from Trial Balance analysis.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold text-[#005A9E]">Performance Materiality</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
             <div className="text-3xl font-bold text-[#212529] mb-2">$1,125,000</div>
             <p className="text-sm text-[#6C757D]">Set at 75% of Overall Materiality based on high inherent risk and historical repeat findings.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold text-[#005A9E]">Summary of Uncorrected</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
             <div className="text-3xl font-bold text-[#212529] mb-2">$75,000</div>
             <p className="text-sm text-[#6C757D]">Threshold for recording uncorrected misstatements (5% of Overall Materiality).</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold">Material Accounts (P2P Scope)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F8F9FA] text-[#6C757D] text-xs uppercase border-b border-[#DEE2E6]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Account Code & Name</th>
                  <th className="px-4 py-3 font-semibold text-right">CY Balance</th>
                  <th className="px-4 py-3 font-semibold text-right">Variance YoY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE2E6]">
                <tr>
                  <td className="px-4 py-3 font-medium text-[#212529]">2100 - Accounts Payable</td>
                  <td className="px-4 py-3 text-right font-mono">$18,450,000</td>
                  <td className="px-4 py-3 text-right text-[#A80000]">+12.4%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-[#212529]">5000 - Cost of Goods Sold</td>
                  <td className="px-4 py-3 text-right font-mono">$45,200,000</td>
                  <td className="px-4 py-3 text-right text-[#198754]">-2.1%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-[#212529]">6120 - IT Software Expenses</td>
                  <td className="px-4 py-3 text-right font-mono">$3,850,000</td>
                  <td className="px-4 py-3 text-right text-[#A80000] font-bold">+45.2%</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold">AI Commentary & Abnormal Variances</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-sm text-[#495057] space-y-4">
            <p>
              AI analysis of the Trial Balance indicates a <strong>45.2% abnormal spike in IT Software Expenses</strong>. This warrants substantive testing of Q3/Q4 software vendor invoices to verify capitalization vs. expense policies.
            </p>
            <p>
              Accounts Payable aging shows $2.1M past due over 90 days, which contradicts the standard Net 30 terms in the Vendor Master.
            </p>
            <p>
              <strong>Ratio Analysis:</strong> Days Payable Outstanding (DPO) has increased from 34 days to 42 days, suggesting potential cash flow optimization or delayed invoice processing bottlenecks in the AP department.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
