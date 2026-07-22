import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

export function FinancialAnalysis() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#212529] border-b border-[#DEE2E6] pb-3">Financial Analysis & Materiality</h2>
      
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
