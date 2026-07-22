import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { AlertCircle, ShieldAlert, Target } from 'lucide-react';

export function ExecutiveSummary() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#212529] border-b border-[#DEE2E6] pb-3">Executive Summary</h2>
      
      <div className="grid grid-cols-3 gap-6">
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[#A80000]" /> Penalty / Regulatory Fine
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[#A80000] text-[#A80000] bg-[#FDF2F2]">YES</Badge>
              <span className="text-xs text-[#6C757D]">Confidence: 94%</span>
            </div>
            <div className="text-sm text-[#495057]">
              <span className="font-semibold text-[#212529]">Reason:</span> Delayed filing of statutory returns under Section 44AB.
            </div>
            <div className="text-sm text-[#495057]">
              <span className="font-semibold text-[#212529]">Evidence:</span> Notice dated 15-May from Tax Authority (Page 4, Govt Notifications).
            </div>
            <div className="text-sm text-[#495057]">
              <span className="font-semibold text-[#212529]">Business Impact:</span> Financial liability of $45,000 and reputational risk.
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#198754]" /> Fraud Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[#198754] text-[#198754] bg-[#F0FDF4]">NO</Badge>
              <span className="text-xs text-[#6C757D]">Confidence: 98%</span>
            </div>
            <div className="text-sm text-[#495057]">
              <span className="font-semibold text-[#212529]">Reason:</span> No whistleblower reports or discrepancies identified.
            </div>
            <div className="text-sm text-[#495057]">
              <span className="font-semibold text-[#212529]">Evidence:</span> Clean Fraud Register and matched Trial Balance.
            </div>
            <div className="text-sm text-[#495057]">
              <span className="font-semibold text-[#212529]">Business Impact:</span> Safe operational environment.
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-[#A80000]" /> High Risk Observation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[#A80000] text-[#A80000] bg-[#FDF2F2]">YES</Badge>
              <span className="text-xs text-[#6C757D]">Confidence: 89%</span>
            </div>
            <div className="text-sm text-[#495057]">
              <span className="font-semibold text-[#212529]">Reason:</span> Lack of segregation of duties in Vendor Master creation.
            </div>
            <div className="text-sm text-[#495057]">
              <span className="font-semibold text-[#212529]">Evidence:</span> Previous Audit Report (Observation #4).
            </div>
            <div className="text-sm text-[#495057]">
              <span className="font-semibold text-[#212529]">Business Impact:</span> High risk of unauthorized vendor payments.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold">Business Context & Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-sm text-[#495057] space-y-4">
            <p><strong>Engagement Information:</strong> Procure to Pay Automation Audit for FY 2025-26.</p>
            <p><strong>Why AI selected this audit:</strong> The P2P cycle has been historically prone to manual intervention errors, and recent system upgrades require validation of automated controls.</p>
            <p><strong>Planning Readiness:</strong> 92% Ready. All core documents are available and successfully parsed.</p>
            <p className="text-[#A80000]"><strong>Missing Documents:</strong> Current Year IT General Controls Report.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold">Key Findings & Focus Areas</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-sm text-[#495057] space-y-4">
            <p><strong>Management Attention Required:</strong> Vendor onboarding process shows a 15% override rate of the automated KYC check.</p>
            <p><strong>Historical Summary:</strong> 2 repeat findings related to manual journal entries.</p>
            <p><strong>Financial Summary:</strong> Total P2P throughput is $120M, with a planning materiality set at $1.5M.</p>
            <p><strong>Next Steps:</strong> Conduct process walkthroughs, validate vendor master controls, and test 3-way match exceptions.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
