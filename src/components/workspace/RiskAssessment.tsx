import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { AIReasoningSection } from './AIReasoningSection';

export function RiskAssessment() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-3">
        <div>
          <span className="text-xs font-bold text-[#005A9E] uppercase tracking-wider">Quantified Risk Architecture</span>
          <h2 className="text-2xl font-bold text-[#212529] mt-1">Enterprise Risk Assessment & Risk Control Matrix (RCM)</h2>
        </div>
        <Badge className="bg-[#A80000]">Inherent Risk Rating: HIGH</Badge>
      </div>

      {/* AI REASONING FOR RISK ASSESSMENT */}
      <AIReasoningSection 
        title="AI Risk Assessment & RCM Prioritization Reasoning"
        whyConclusion="Calculated Inherent Risk Rating as HIGH by combining likelihood scores from SAP change logs with monetary impact estimates ($1.5M materiality threshold)."
        preferredConclusionReason="Selected Fictitious Vendor Creation as Priority 1 risk over Duplicate Payments because duplicate checks are partially automated in SAP S/4HANA."
        conflictingEvidence="Management rated vendor onboarding as 'Low Risk' due to two-signature policy, but ERP access control matrices reveal 6 employees possess dual create-and-approve permissions."
        overallConfidence={98}
        influencingDocs={[
          { docName: "SAP User Role Permissions Matrix", percentage: 50 },
          { docName: "Previous Audit Report", percentage: 30 },
          { docName: "Internal Control Self-Assessment (RCSA)", percentage: 20 }
        ]}
        assumptions={[
          {
            assumption: "Assumed all manual payment overrides in SAP bypass automated SOD controls.",
            reason: "Audit log parameters show manual payment authorization flag was set to 'Bypass Verification' in test scripts.",
            impactIfIncorrect: "Over-scoping of manual payment testing procedures.",
            confidence: 93
          }
        ]}
        whatIfAnalysis={{
          thirtyDays: "Ongoing dual-access permissions will allow unauthorized vendor creation without detection.",
          ninetyDays: "Potential fraudulent disbursements during annual supplier bonus payout cycle.",
          oneEightyDays: "External audit qualification of internal controls over financial reporting (ICFR)."
        }}
        limitations={{
          undetermined: "Extent of third-party vendor background check verification performed by Human Resources.",
          additionalDocsNeeded: "HR Third-Party Vetting SLA & Background Verification Register.",
          confidenceGain: "4%"
        }}
      />

      <Card className="shadow-sm border-[#DEE2E6]">
        <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
          <CardTitle className="text-sm font-semibold">Risk Control Matrix (RCM) Generation</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-[#F8F9FA] text-[#6C757D] text-xs uppercase border-b border-[#DEE2E6]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Risk Description</th>
                  <th className="px-4 py-3 font-semibold">Inherent Likelihood</th>
                  <th className="px-4 py-3 font-semibold">Inherent Impact</th>
                  <th className="px-4 py-3 font-semibold">Control Effectiveness</th>
                  <th className="px-4 py-3 font-semibold">Residual Risk</th>
                  <th className="px-4 py-3 font-semibold">AI Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE2E6]">
                <tr>
                  <td className="px-4 py-4 min-w-[300px]">
                    <div className="font-semibold text-[#212529]">Fictitious Vendor Creation</div>
                    <div className="text-xs text-[#6C757D] mt-1 whitespace-normal">Unauthorized individuals creating vendors to process fraudulent payments.</div>
                    <div className="text-xs text-[#005A9E] mt-1">Evidence: Previous Audit Finding #4</div>
                  </td>
                  <td className="px-4 py-4"><Badge variant="outline" className="border-[#A80000] text-[#A80000]">High</Badge></td>
                  <td className="px-4 py-4"><Badge variant="outline" className="border-[#A80000] text-[#A80000]">High</Badge></td>
                  <td className="px-4 py-4"><Badge variant="outline" className="border-[#FFC107] text-[#856404]">Needs Improvement</Badge></td>
                  <td className="px-4 py-4"><Badge className="bg-[#A80000]">High</Badge></td>
                  <td className="px-4 py-4 min-w-[250px] whitespace-normal text-xs text-[#495057]">
                    Implement system-enforced segregation of duties between Vendor Master creation and Invoice Approval.
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-4 min-w-[300px]">
                    <div className="font-semibold text-[#212529]">Duplicate Invoice Processing</div>
                    <div className="text-xs text-[#6C757D] mt-1 whitespace-normal">Processing the same invoice twice resulting in double payment.</div>
                    <div className="text-xs text-[#005A9E] mt-1">Evidence: SOP review indicates manual entry.</div>
                  </td>
                  <td className="px-4 py-4"><Badge variant="outline" className="border-[#FFC107] text-[#856404]">Medium</Badge></td>
                  <td className="px-4 py-4"><Badge variant="outline" className="border-[#FFC107] text-[#856404]">Medium</Badge></td>
                  <td className="px-4 py-4"><Badge variant="outline" className="border-[#198754] text-[#198754]">Effective</Badge></td>
                  <td className="px-4 py-4"><Badge className="bg-[#198754]">Low</Badge></td>
                  <td className="px-4 py-4 min-w-[250px] whitespace-normal text-xs text-[#495057]">
                    Test ERP built-in duplicate check feature. Verify parameters (Invoice #, Date, Amount).
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-4 min-w-[300px]">
                    <div className="font-semibold text-[#212529]">Delayed Regulatory Filings</div>
                    <div className="text-xs text-[#6C757D] mt-1 whitespace-normal">Failure to file statutory vendor withholding tax returns on time.</div>
                    <div className="text-xs text-[#005A9E] mt-1">Evidence: Tax Authority Notice (May 15)</div>
                  </td>
                  <td className="px-4 py-4"><Badge variant="outline" className="border-[#A80000] text-[#A80000]">High</Badge></td>
                  <td className="px-4 py-4"><Badge variant="outline" className="border-[#FFC107] text-[#856404]">Medium</Badge></td>
                  <td className="px-4 py-4"><Badge variant="outline" className="border-[#A80000] text-[#A80000]">Ineffective</Badge></td>
                  <td className="px-4 py-4"><Badge className="bg-[#A80000]">High</Badge></td>
                  <td className="px-4 py-4 min-w-[250px] whitespace-normal text-xs text-[#495057]">
                    Perform 100% substantive testing on Q1/Q2 tax filings. Establish automated calendar alerts.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

