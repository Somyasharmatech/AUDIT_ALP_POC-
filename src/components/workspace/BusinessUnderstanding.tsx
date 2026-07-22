import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Target, Layers, ShieldCheck, Activity } from 'lucide-react';
import { AIReasoningSection } from './AIReasoningSection';

export function BusinessUnderstanding() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-3">
        <div>
          <span className="text-xs font-bold text-[#005A9E] uppercase tracking-wider">Internal Audit Intelligence</span>
          <h2 className="text-2xl font-bold text-[#212529] mt-1">Business Understanding & Process Architecture</h2>
        </div>
        <Badge className="bg-[#005A9E]">Process Maturity: Level 3 (Defined)</Badge>
      </div>

      {/* EXPANDABLE AI REASONING LAYER */}
      <AIReasoningSection 
        title="AI Process Modeling & Reasoning Engine"
        whyConclusion="Synthesized business objectives and system dependencies by correlating the Operations Manual (pg 45-48) with SAP S/4HANA transactional flows."
        preferredConclusionReason="Selected P2P business baseline over departmental sub-processes because P2P spans across Procurement, AP, Warehouse, and Treasury, creating cross-functional control dependencies."
        conflictingEvidence="The Ariba portal specs mention automated vendor bank account verification, but current payment logs reveal manual offline banking confirmation letters are still utilized."
        overallConfidence={95}
        influencingDocs={[
          { docName: "Operations Manual v2.4", percentage: 42 },
          { docName: "SAP S/4HANA Architecture Guide", percentage: 28 },
          { docName: "Previous Audit Report", percentage: 18 },
          { docName: "Vendor Master Policy Manual", percentage: 12 }
        ]}
        assumptions={[
          {
            assumption: "Assumed Citrix gateway secures Citibank Direct API integration.",
            reason: "Network topology diagram was partially redacted for security compliance.",
            impactIfIncorrect: "Potential unmonitored external network exposure during payment transmission.",
            confidence: 88
          }
        ]}
        whatIfAnalysis={{
          thirtyDays: "Workflow confusion between legacy and new SAP approval levels will cause invoice processing bottlenecks.",
          ninetyDays: "Vendor payment terms defaults will lead to lost early payment discounts estimated at $85,000.",
          oneEightyDays: "Procurement operational lead times will degrade, impacting warehouse stock availability."
        }}
        limitations={{
          undetermined: "Exact API rate limits and automated retry logic between Ariba and SAP S/4HANA.",
          additionalDocsNeeded: "SAP Interface Architecture Document and API Gateway Logs.",
          confidenceGain: "5%"
        }}
      />

      <Card className="shadow-sm border-[#DEE2E6]">
        <CardContent className="p-6 space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-[#212529] mb-2 uppercase tracking-wider flex items-center gap-2">
              <Target className="h-4 w-4 text-[#005A9E]" /> Strategic Business Objective
            </h3>
            <p className="text-sm text-[#495057] leading-relaxed">
              Ensure efficient, cost-effective, and compliant procurement of goods and services necessary to support organizational operations, while mitigating third-party risks and optimizing working capital ($120M annual cash flow).
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-[#212529] mb-2 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#005A9E]" /> End-to-End Business Process Summary
            </h3>
            <p className="text-sm text-[#495057] leading-relaxed">
              The Procure to Pay (P2P) process encompasses all activities from the initial identification of a requirement for goods or services to the final payment to the vendor. It includes vendor selection, purchase requisition, purchase order creation, goods receipt, invoice processing, and payment execution.
            </p>
          </div>

          {/* PROCESS & CONTROL MATURITY SCORECARD */}
          <div className="p-4 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm space-y-3">
            <h3 className="text-xs font-bold text-[#212529] uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#005A9E]" /> Business Process Maturity Scorecard
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-xs">
              <div className="p-2.5 bg-white border rounded-sm">
                <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Maturity Stage</span>
                <span className="font-bold text-[#005A9E]">Level 3 (Defined)</span>
              </div>
              <div className="p-2.5 bg-white border rounded-sm">
                <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Control Design</span>
                <span className="font-bold text-[#198754]">85% (Adequate)</span>
              </div>
              <div className="p-2.5 bg-white border rounded-sm">
                <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Automation Level</span>
                <span className="font-bold text-[#005A9E]">66% Automated</span>
              </div>
              <div className="p-2.5 bg-white border rounded-sm">
                <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Manual Dependencies</span>
                <span className="font-bold text-[#FFC107]">34% Manual</span>
              </div>
              <div className="p-2.5 bg-white border rounded-sm">
                <span className="text-[10px] text-[#6C757D] font-bold uppercase block">SoD Score</span>
                <span className="font-bold text-[#A80000]">68% (At Risk)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wider">Key Stakeholders</h3>
              <ul className="list-disc pl-5 text-sm text-[#495057] space-y-1.5">
                <li>Chief Procurement Officer (CPO)</li>
                <li>Accounts Payable Manager</li>
                <li>Head of Vendor Management</li>
                <li>Treasury Director</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wider">Control Owners</h3>
              <ul className="list-disc pl-5 text-sm text-[#495057] space-y-1.5">
                <li>Purchasing Manager (PO Creation)</li>
                <li>Warehouse Supervisor (Goods Receipt)</li>
                <li>Finance Manager (Invoice Approval)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wider">Critical Applications</h3>
              <ul className="list-disc pl-5 text-sm text-[#495057] space-y-1.5">
                <li>SAP S/4HANA (Core ERP)</li>
                <li>Ariba (Vendor Portal)</li>
                <li>Citibank Direct (Payment Gateway)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wider">Key Dependencies</h3>
              <ul className="list-disc pl-5 text-sm text-[#495057] space-y-1.5">
                <li>Automated 3-Way Match System Uptime</li>
                <li>Vendor Master Data Integrity</li>
                <li>Active Directory Integration for Approvals</li>
              </ul>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wider">Inherent Business Risks & Root Cause Analysis</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#495057]">
                <div className="p-3 bg-[#FDF2F2] border border-[#DEE2E6] rounded-sm space-y-1">
                  <span className="font-bold text-[#A80000]">1. Fictitious Vendor Payments</span>
                  <p><strong>Root Cause:</strong> Lack of automated dual-control verification during vendor bank account edits.</p>
                </div>
                <div className="p-3 bg-[#FDF2F2] border border-[#DEE2E6] rounded-sm space-y-1">
                  <span className="font-bold text-[#A80000]">2. Duplicate Invoice Submissions</span>
                  <p><strong>Root Cause:</strong> Inconsistent invoice number formatting rules during manual AP entry.</p>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

