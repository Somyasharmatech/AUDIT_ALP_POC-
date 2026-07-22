import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { FileText, Calendar, Users, Target, ShieldAlert, DollarSign, Download, CheckCircle2, Building2, Clock } from 'lucide-react';
import { AIReasoningSection } from './AIReasoningSection';

export function PlanningMemorandum() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-4">
        <div>
          <span className="text-xs font-bold text-[#005A9E] uppercase tracking-wider">Internal Audit Department • Board Briefing</span>
          <h2 className="text-2xl font-bold text-[#212529] mt-1">Audit Planning Memorandum</h2>
          <p className="text-xs text-[#6C757D] mt-0.5">Engagement ID: AUD-2025-P2P • Procure to Pay Automation Audit</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#005A9E] text-[#005A9E] hover:bg-[#E5F0FA]">
            <Download className="h-4 w-4 mr-2" /> Export Word (.docx)
          </Button>
          <Button className="bg-[#005A9E] hover:bg-[#004578]">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Memo Header Details */}
      <Card className="shadow-sm border-[#DEE2E6] bg-[#F8F9FA]/60">
        <CardContent className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#6C757D]">TO</span>
            <p className="font-semibold text-[#212529]">Audit Committee & Head of Internal Audit</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#6C757D]">FROM</span>
            <p className="font-semibold text-[#212529]">Internal Audit Lead Partner / AI Assistant</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#6C757D]">DATE</span>
            <p className="font-semibold text-[#212529]">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#6C757D]">STATUS</span>
            <div><Badge className="bg-[#198754]">Approved for Fieldwork</Badge></div>
          </div>
        </CardContent>
      </Card>

      {/* EXPANDABLE AI REASONING LAYER */}
      <AIReasoningSection 
        title="AI Planning Memorandum Reasoning & Document Evidence Map"
        whyConclusion="Synthesized the complete planning memo by combining historical audit weaknesses with real-time financial trial balance disclosures."
        preferredConclusionReason="Selected P2P workflow for board review because $120M annual transaction volume represents 68% of total operational cash disbursements."
        conflictingEvidence="Management budget plan anticipated a 10% reduction in AP processing costs, but actual Q3 expenses rose by 14.2% due to manual exception processing."
        overallConfidence={96}
        influencingDocs={[
          { docName: "Previous Audit Report (FY24)", percentage: 40 },
          { docName: "SAP Trial Balance & GL Ledger", percentage: 35 },
          { docName: "Procurement Policy & SOP v2.4", percentage: 25 }
        ]}
        assumptions={[
          {
            assumption: "Assumed audit testing scope can proceed without delaying fiscal year-end financial reporting.",
            reason: "Fieldwork schedule aligns with Q3 interim closing window.",
            impactIfIncorrect: "Resource contention during year-end financial statement audit.",
            confidence: 95
          }
        ]}
        whatIfAnalysis={{
          thirtyDays: "Fieldwork commencement without finalized SOP baseline will require additional walkthrough interviews.",
          ninetyDays: "Delayed audit committee approval will push final report delivery into Q4 financial closing.",
          oneEightyDays: "Higher vulnerability to undetected procurement fraud during year-end vendor settlement."
        }}
        limitations={{
          undetermined: "Exact allocation of external consultant hours for specialized SAP automated controls testing.",
          additionalDocsNeeded: "IT Staffing & External Audit Support Plan.",
          confidenceGain: "4%"
        }}
      />

      {/* Section 1: Audit Objectives & Reason for Selection */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-[#005A9E]" /> Audit Objectives
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-sm text-[#495057]">
            <p>1. <strong>Evaluate Design & Operating Effectiveness:</strong> Assess key automated controls within the ERP Procure-to-Pay workflow, including 3-way matching and tolerance limits.</p>
            <p>2. <strong>Vendor Onboarding Governance:</strong> Review the end-to-end Vendor Master creation process for proper segregation of duties and automated KYC verification.</p>
            <p>3. <strong>Regulatory Compliance:</strong> Verify compliance with updated statutory tax return filings (Section 44AB) and local procurement regulations.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#005A9E]" /> Reason for Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-sm text-[#495057]">
            <p>• <strong>Historical Risk & Repeat Findings:</strong> Identified unresolved vendor master segregation of duties findings in prior year audit report (Observation #4).</p>
            <p>• <strong>Financial Materiality:</strong> P2P throughput represents $120M in annual cash outflows, making it a key business process.</p>
            <p>• <strong>Regulatory Exposure:</strong> Regulatory notice received regarding delayed statutory filings requiring immediate audit verification.</p>
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Business Context & Risk Summary */}
      <Card className="shadow-sm border-[#DEE2E6]">
        <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#005A9E]" /> Key Risk Focus & Materiality Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#495057]">
          <div className="space-y-2 border-r border-[#DEE2E6] pr-4">
            <span className="text-[10px] uppercase font-bold text-[#6C757D] tracking-wider">Top Priority Risk</span>
            <div className="font-bold text-[#A80000]">Fictitious Vendor Fraud</div>
            <p className="text-xs">Manual overrides in automated KYC checks allow bypass of approval hierarchies during vendor creation.</p>
          </div>
          <div className="space-y-2 border-r border-[#DEE2E6] pr-4">
            <span className="text-[10px] uppercase font-bold text-[#6C757D] tracking-wider">Planning Materiality</span>
            <div className="text-xl font-bold text-[#212529]">$1,500,000</div>
            <p className="text-xs">Based on 1.25% of annual procurement expenditure. Performance Materiality set at $1,125,000 (75%).</p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#6C757D] tracking-wider">Testing Threshold</span>
            <div className="text-xl font-bold text-[#005A9E]">$50,000</div>
            <p className="text-xs">100% substantive sample testing for PO approvals and vendor additions above this threshold.</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Resource Plan & Milestones Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-[#005A9E]" /> Resources & Team Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-[#DEE2E6] pb-2">
              <div><strong className="text-[#212529]">Engagement Lead Partner:</strong> <span className="text-[#495057]">Sarah Jenkins, CIA</span></div>
              <Badge variant="outline" className="border-[#005A9E] text-[#005A9E]">15% Alloc.</Badge>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-[#DEE2E6] pb-2">
              <div><strong className="text-[#212529]">Audit Manager:</strong> <span className="text-[#495057]">David Chen, CISA</span></div>
              <Badge variant="outline" className="border-[#005A9E] text-[#005A9E]">50% Alloc.</Badge>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-[#DEE2E6] pb-2">
              <div><strong className="text-[#212529]">Senior Auditor (IT/P2P):</strong> <span className="text-[#495057]">Marcus Vance, CPA</span></div>
              <Badge variant="outline" className="border-[#005A9E] text-[#005A9E]">100% Alloc.</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div><strong className="text-[#212529]">AI Audit Specialist:</strong> <span className="text-[#495057]">AI Audit Planning Engine</span></div>
              <Badge className="bg-[#198754]">Automated</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#005A9E]" /> Execution Timeline & Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#212529]">1. Planning & AI Scoping Complete</span>
              <span className="font-mono text-[#198754] font-bold">Week 1 (Completed)</span>
            </div>
            <div className="w-full bg-[#E9ECEF] h-1.5 rounded-full"><div className="bg-[#198754] h-1.5 rounded-full w-full"></div></div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="font-semibold text-[#212529]">2. Walkthroughs & Control Testing</span>
              <span className="font-mono text-[#005A9E] font-bold">Weeks 2 - 3</span>
            </div>
            <div className="w-full bg-[#E9ECEF] h-1.5 rounded-full"><div className="bg-[#005A9E] h-1.5 rounded-full w-2/5"></div></div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="font-semibold text-[#212529]">3. Substantive Testing & Exception Review</span>
              <span className="font-mono text-[#6C757D]">Weeks 4 - 5</span>
            </div>
            <div className="w-full bg-[#E9ECEF] h-1.5 rounded-full"><div className="bg-[#DEE2E6] h-1.5 rounded-full w-0"></div></div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="font-semibold text-[#212529]">4. Draft Report & Audit Committee Briefing</span>
              <span className="font-mono text-[#6C757D]">Week 6</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
