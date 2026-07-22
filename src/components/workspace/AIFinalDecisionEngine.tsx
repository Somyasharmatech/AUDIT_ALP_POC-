import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Sparkles, Scale, FileText, 
  Building2, GitBranch, History, DollarSign, Target, ListChecks, ArrowRight, 
  Layers, ChevronDown, ChevronUp, FileSpreadsheet, Lock, BadgeCheck, ShieldCheck, 
  FileCheck, BookOpen, ExternalLink, Cpu
} from 'lucide-react';
import { toast } from 'sonner';

export function AIFinalDecisionEngine() {
  const [expandedQ1, setExpandedQ1] = useState(true);
  const [expandedQ2, setExpandedQ2] = useState(true);
  const [expandedQ3, setExpandedQ3] = useState(true);

  return (
    <Card className="shadow-lg border-2 border-[#005A9E] bg-gradient-to-br from-[#F0F7FF] via-white to-[#F8F9FA] overflow-hidden">
      
      {/* HEADER BANNER */}
      <CardHeader className="bg-gradient-to-r from-[#002B49] via-[#004B87] to-[#005A9E] text-white p-6 border-b border-[#003A6C]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#FFB900] text-[#212529] font-black text-[10px] uppercase px-2.5 py-0.5">
                AI Final Decision Engine
              </Badge>
              <span className="text-xs text-blue-100 font-mono flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-[#00A4EF]" /> Synthesized 14 Deliverables & Knowledge Base
              </span>
            </div>
            <CardTitle className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-[#FFB900]" /> AI Final Audit Opinion & Decision Synthesis
            </CardTitle>
            <CardDescription className="text-xs text-blue-100 max-w-3xl leading-relaxed">
              Comprehensive AI audit evaluation conducted after analyzing Uploaded Documents, Knowledge Extraction, Business Architecture, Generated SOP, Process Flow, Risk Register, Financial Analysis, Historical Findings, Planning Memorandum, Scoping Document, Audit Program, Analytics, and Executive Summary.
            </CardDescription>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded border border-white/20 text-center">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">Final Executive Opinion</span>
              <Badge className="bg-[#FFB900] text-[#212529] font-extrabold text-xs px-3 py-1 mt-1 shadow-sm">
                PROCEED WITH CONDITIONS
              </Badge>
            </div>
            <span className="text-[10px] text-blue-200">Overall Opinion Confidence: <strong className="text-white font-mono">94.8%</strong></span>
          </div>
        </div>

        {/* ASSESSED DELIVERABLES CHIPS */}
        <div className="pt-4 mt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className="text-blue-200 font-bold uppercase mr-1">Evaluated Sources:</span>
          {[
            'Uploaded Documents', 'Knowledge Extraction', 'Business Architecture', 'Generated SOP', 
            'Generated Process Flow', 'Risk Register', 'Financial Analysis', 'Historical Findings', 
            'Planning Memorandum', 'Scoping Document', 'Audit Program', 'Enterprise Analytics', 'Executive Summary'
          ].map((item, idx) => (
            <Badge key={idx} variant="outline" className="border-white/20 text-white bg-white/5 font-medium px-2 py-0.5">
              <CheckCircle2 className="h-2.5 w-2.5 text-[#00A4EF] mr-1" /> {item}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">

        {/* THREE CORE AUDIT QUESTIONS */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
            <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#005A9E]" /> Mandatory AI Audit Planning Inquiries & Findings Matrix
            </h3>
            <span className="text-[11px] text-[#198754] font-bold flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5" /> 3 / 3 Core Evaluations Completed
            </span>
          </div>

          {/* QUESTION 1: REGULATORY PENALTIES / COMPLIANCE */}
          <div className="border border-[#DEE2E6] rounded-sm bg-white shadow-2xs overflow-hidden">
            <div 
              onClick={() => setExpandedQ1(!expandedQ1)}
              className="p-4 bg-[#F8F9FA] hover:bg-[#F1F3F5] cursor-pointer flex items-center justify-between transition-colors border-b border-[#DEE2E6]"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-[#FDF2F2] border border-[#DEE2E6] rounded flex items-center justify-center text-[#A80000]">
                  <Scale className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#A80000] uppercase tracking-wider">Question 1</span>
                    <Badge className="bg-[#A80000] text-white font-black text-[10px] px-2 py-0.5">YES — HIGH EXPOSURE</Badge>
                  </div>
                  <h4 className="text-sm font-black text-[#212529]">Are there any Regulatory Penalties or Compliance Issues?</h4>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-[#A80000] text-[#A80000] font-bold text-[10px]">Confidence: 98%</Badge>
                {expandedQ1 ? <ChevronUp className="h-4 w-4 text-[#6C757D]" /> : <ChevronDown className="h-4 w-4 text-[#6C757D]" />}
              </div>
            </div>

            {expandedQ1 && (
              <div className="p-5 space-y-4 text-xs bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-[#FDF2F2]/60 border border-red-200 rounded-sm">
                  <div>
                    <span className="font-bold text-[#A80000] uppercase text-[10px] block">Finding</span>
                    <p className="font-bold text-[#212529]">Delayed Vendor Withholding Tax Remittances & Non-Compliant Off-Ledger Bank Updates</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#A80000] uppercase text-[10px] block">Reason</span>
                    <p className="text-[#495057]">Failure to execute statutory Tax Deduction at Source (TDS) under Income Tax Act Sec 194C within statutory timelines and missing dual signoff logs required by SOX 404 ICFR framework.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#F8F9FA] border rounded-sm">
                    <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Business Impact</span>
                    <p className="font-medium text-[#212529]">Exposure to statutory audit qualification, regulatory fines, and reputational friction with tax authorities.</p>
                  </div>
                  <div className="p-3 bg-[#F8F9FA] border rounded-sm">
                    <span className="font-bold text-[#A80000] uppercase text-[10px] block">Financial Impact</span>
                    <p className="font-bold text-[#A80000]">$42,500 Direct Tax Penalty + $1,500,000 Potential Expense Disallowance</p>
                  </div>
                  <div className="p-3 bg-[#F8F9FA] border rounded-sm">
                    <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Regulatory Impact</span>
                    <p className="font-medium text-[#212529]">Non-compliance with SOX Sec 404 ICFR control mandates and Central Tax Circular No. 14/2024.</p>
                  </div>
                </div>

                <div className="p-3 bg-[#E5F0FA] border border-blue-200 rounded-sm space-y-1">
                  <span className="font-bold text-[#005A9E] uppercase text-[10px] block flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Root Cause & AI Recommendation
                  </span>
                  <p className="text-[#212529]"><strong>Root Cause:</strong> Absence of automated tax validation gating in SAP MIRO payment release workflow.</p>
                  <p className="text-[#005A9E] font-medium"><strong>AI Recommendation:</strong> Implement mandatory automated withholding tax validation check in SAP MIRO prior to payment batch dispatch.</p>
                </div>

                {/* TRACEABILITY LINKS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-[#DEE2E6] text-[11px]">
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Linked Controls:</span>
                    <span className="font-bold text-[#005A9E]">AC-PO-04, AC-AP-09</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Linked SOP:</span>
                    <span className="font-bold text-[#005A9E]">Procurement SOP v2.4 (Sec 6.3)</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Linked Previous Finding:</span>
                    <span className="font-bold text-[#856404]">FY24-F-02 (Tax Remittances)</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Source Docs & Pages:</span>
                    <span className="font-bold text-[#212529]">Tax Circular 14/2024 (pg 4, 12)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* QUESTION 2: FRAUD INDICATORS */}
          <div className="border border-[#DEE2E6] rounded-sm bg-white shadow-2xs overflow-hidden">
            <div 
              onClick={() => setExpandedQ2(!expandedQ2)}
              className="p-4 bg-[#F8F9FA] hover:bg-[#F1F3F5] cursor-pointer flex items-center justify-between transition-colors border-b border-[#DEE2E6]"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-[#FFF3CD] border border-[#DEE2E6] rounded flex items-center justify-center text-[#856404]">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#856404] uppercase tracking-wider">Question 2</span>
                    <Badge className="bg-[#FFC107] text-[#212529] font-black text-[10px] px-2 py-0.5">YES — CRITICAL ATTENTION</Badge>
                  </div>
                  <h4 className="text-sm font-black text-[#212529]">Are there any Fraud Indicators?</h4>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-[#856404] text-[#856404] font-bold text-[10px]">Confidence: 96%</Badge>
                {expandedQ2 ? <ChevronUp className="h-4 w-4 text-[#6C757D]" /> : <ChevronDown className="h-4 w-4 text-[#6C757D]" />}
              </div>
            </div>

            {expandedQ2 && (
              <div className="p-5 space-y-4 text-xs bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-[#FFF3CD]/50 border border-[#FFC107] rounded-sm">
                  <div>
                    <span className="font-bold text-[#856404] uppercase text-[10px] block">Finding</span>
                    <p className="font-bold text-[#212529]">Unsanctioned Segregation of Duties (SoD) Conflicts in SAP T-Code SU01 & Manual Bank Updates</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#856404] uppercase text-[10px] block">Reason</span>
                    <p className="text-[#495057]">6 SAP users hold dual authorization (SU01/ME21N/MIRO) enabling end-to-end vendor creation, PO creation, and invoice posting without independent verification.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#F8F9FA] border rounded-sm">
                    <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Business Impact</span>
                    <p className="font-medium text-[#212529]">Severe risk of fictitious vendor creation, unauthorized invoice disbursements, and internal asset diversion.</p>
                  </div>
                  <div className="p-3 bg-[#F8F9FA] border rounded-sm">
                    <span className="font-bold text-[#856404] uppercase text-[10px] block">Financial Impact</span>
                    <p className="font-bold text-[#856404]">$3,850,000 Total Exposure across 14 High-Value Manual Payment Batches</p>
                  </div>
                  <div className="p-3 bg-[#F8F9FA] border rounded-sm">
                    <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Regulatory Impact</span>
                    <p className="font-medium text-[#212529]">SOX 404 Material Weakness indicator in Segregation of Duties governance.</p>
                  </div>
                </div>

                <div className="p-3 bg-[#E5F0FA] border border-blue-200 rounded-sm space-y-1">
                  <span className="font-bold text-[#005A9E] uppercase text-[10px] block flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Root Cause & AI Recommendation
                  </span>
                  <p className="text-[#212529]"><strong>Root Cause:</strong> Legacy emergency role allocation in SAP S/4HANA that was never revoked post-ERP migration.</p>
                  <p className="text-[#005A9E] font-medium"><strong>AI Recommendation:</strong> Immediately revoke dual SU01/ME21N permissions for the 6 identified users and enforce Citibank API host-to-host dual sign-off tokens.</p>
                </div>

                {/* TRACEABILITY LINKS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-[#DEE2E6] text-[11px]">
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Linked Controls:</span>
                    <span className="font-bold text-[#005A9E]">AC-SU-01, AC-AP-02</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Linked SOP:</span>
                    <span className="font-bold text-[#005A9E]">Operations Manual (Sec 4.1 & 8.2)</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Linked Previous Finding:</span>
                    <span className="font-bold text-[#856404]">FY24-F-01 (SoD Role Conflicts)</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Source Docs & Pages:</span>
                    <span className="font-bold text-[#212529]">SAP SU01 Log, Fraud Register (pg 15, 28)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* QUESTION 3: HIGH RISK OBSERVATIONS */}
          <div className="border border-[#DEE2E6] rounded-sm bg-white shadow-2xs overflow-hidden">
            <div 
              onClick={() => setExpandedQ3(!expandedQ3)}
              className="p-4 bg-[#F8F9FA] hover:bg-[#F1F3F5] cursor-pointer flex items-center justify-between transition-colors border-b border-[#DEE2E6]"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-[#E5F0FA] border border-[#DEE2E6] rounded flex items-center justify-center text-[#005A9E]">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#005A9E] uppercase tracking-wider">Question 3</span>
                    <Badge className="bg-[#005A9E] text-white font-black text-[10px] px-2 py-0.5">YES — FIELDWORK FOCUS REQUIRED</Badge>
                  </div>
                  <h4 className="text-sm font-black text-[#212529]">Are there any High Risk Observations requiring immediate audit attention?</h4>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-[#005A9E] text-[#005A9E] font-bold text-[10px]">Confidence: 99%</Badge>
                {expandedQ3 ? <ChevronUp className="h-4 w-4 text-[#6C757D]" /> : <ChevronDown className="h-4 w-4 text-[#6C757D]" />}
              </div>
            </div>

            {expandedQ3 && (
              <div className="p-5 space-y-4 text-xs bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-[#E5F0FA]/60 border border-blue-200 rounded-sm">
                  <div>
                    <span className="font-bold text-[#005A9E] uppercase text-[10px] block">Finding</span>
                    <p className="font-bold text-[#212529]">14.2% Q3 OpEx Spending Spike & 3-Way Match Variance Tolerance Bypass</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#005A9E] uppercase text-[10px] block">Reason</span>
                    <p className="text-[#495057]">Trial Balance GL #5400 & GL #2100 sub-ledger reconciliation reveals $3.85M held in 3-way match exception backlog with supervisory override signatures.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#F8F9FA] border rounded-sm">
                    <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Business Impact</span>
                    <p className="font-medium text-[#212529]">Margin erosion, unverified inventory valuations, and potential overpayments to third-party suppliers.</p>
                  </div>
                  <div className="p-3 bg-[#F8F9FA] border rounded-sm">
                    <span className="font-bold text-[#005A9E] uppercase text-[10px] block">Financial Impact</span>
                    <p className="font-bold text-[#005A9E]">$3,850,000 Direct Financial Review Scope (342% of Performance Materiality)</p>
                  </div>
                  <div className="p-3 bg-[#F8F9FA] border rounded-sm">
                    <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Recommended Audit Focus</span>
                    <p className="font-medium text-[#212529]">Substantive sampling of all 14 transactions &gt; $500K and 100% testing of manual AP supervisor override batches.</p>
                  </div>
                </div>

                <div className="p-3 bg-[#E5F0FA] border border-blue-200 rounded-sm space-y-1">
                  <span className="font-bold text-[#005A9E] uppercase text-[10px] block flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Root Cause & AI Recommendation
                  </span>
                  <p className="text-[#212529]"><strong>Root Cause:</strong> High volume price variances exceeding 2% tolerance manually cleared by AP supervisors due to backlog pressure.</p>
                  <p className="text-[#005A9E] font-medium"><strong>AI Recommendation:</strong> Mandate hard SAP system blocks on 3-way match variances exceeding $25,000, requiring CPO re-approval.</p>
                </div>

                {/* TRACEABILITY LINKS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-[#DEE2E6] text-[11px]">
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Linked Controls:</span>
                    <span className="font-bold text-[#005A9E]">AC-MIRO-01, AC-AP-05</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Linked SOP:</span>
                    <span className="font-bold text-[#005A9E]">Procurement SOP v2.4 (Sec 7.2)</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Linked Previous Finding:</span>
                    <span className="font-bold text-[#856404]">FY24-F-03 (Override Backlog)</span>
                  </div>
                  <div>
                    <span className="text-[#6C757D] font-semibold block">Source Docs & Pages:</span>
                    <span className="font-bold text-[#212529]">Trial Balance GL, SOP v2.4 (Rows 1-1240, pg 48)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </CardContent>
    </Card>
  );
}
