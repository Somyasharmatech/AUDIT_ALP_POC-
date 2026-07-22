import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { ChevronDown, ChevronUp, FileText, CheckCircle2, ShieldCheck, AlertTriangle, Layers, BrainCircuit, Search } from 'lucide-react';

export interface TraceabilityItem {
  sourceDoc: string;
  reference: string;
  excerpt?: string;
  confidence: number;
}

export interface ExplainabilityData {
  title: string;
  finding: string;
  reason: string;
  evidence: string;
  traceability: TraceabilityItem[];
  businessImpact: string;
  riskRating: 'High' | 'Medium' | 'Low';
  overallConfidence: number;
  evidenceQuality: 'High' | 'Medium' | 'Low';
  recommendedAction: string;
  confidenceBreakdown?: {
    docCoverage: number;
    historicalCoverage: number;
    financialCoverage: number;
    evidenceQualityScore: number;
    understandingScore: number;
  };
}

interface ExplainabilityPanelProps {
  data?: Partial<ExplainabilityData>;
  defaultExpanded?: boolean;
}

const DEFAULT_DATA: ExplainabilityData = {
  title: "AI Decision & Traceability Log",
  finding: "Vendor KYC Automated Validation Bypass & Delayed Tax Filing",
  reason: "Audit logic detected 15% manual override frequency during Vendor Master creation along with a statutory notice from Tax Authority.",
  evidence: "Previous Audit Report (Observation #4), Tax Authority Notice (May 15), Trial Balance Account 6120.",
  traceability: [
    { sourceDoc: "Previous Audit Report (FY 2024)", reference: "Pages 12-18, Obs #4", excerpt: "Lack of segregation of duties between Vendor Master creation and AP approval.", confidence: 98 },
    { sourceDoc: "Government Circulars / Notifications", reference: "Clause 5, Notice dated 15-May", excerpt: "Penalties applicable under Section 44AB for late submission.", confidence: 95 },
    { sourceDoc: "Trial Balance (FY 2025)", reference: "Note 15, Account #6120", excerpt: "+45.2% YoY increase in IT software procurement expenses.", confidence: 99 },
    { sourceDoc: "Standard Operating Procedure (SOP)", reference: "Section 3.2, Activity 3", excerpt: "Manual approval allowed if secondary VP sign-off present.", confidence: 92 },
    { sourceDoc: "Risk Control Matrix (RCM)", reference: "Control ID: RC-08", excerpt: "Secondary control missing automated verification trigger.", confidence: 94 }
  ],
  businessImpact: "Risk of $45,000 regulatory fines and potential fictitious vendor creation leading to unauthorized cash outflows.",
  riskRating: "High",
  overallConfidence: 94,
  evidenceQuality: "High",
  recommendedAction: "Perform 100% population substantive testing on newly onboarded vendors and review tax filing acknowledgements.",
  confidenceBreakdown: {
    docCoverage: 96,
    historicalCoverage: 92,
    financialCoverage: 98,
    evidenceQualityScore: 95,
    understandingScore: 93
  }
};

export function ExplainabilityPanel({ data, defaultExpanded = false }: ExplainabilityPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const merged = { ...DEFAULT_DATA, ...data };

  return (
    <Card className="shadow-sm border-[#DEE2E6] bg-[#F8F9FA]">
      <CardHeader 
        className="p-4 border-b border-[#DEE2E6] cursor-pointer hover:bg-[#E9ECEF] transition-colors flex flex-row items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#005A9E]">
          <BrainCircuit className="h-4 w-4 text-[#005A9E]" />
          <span>{merged.title}</span>
          <Badge variant="outline" className="border-[#005A9E] text-[#005A9E] bg-[#E5F0FA] text-[10px] ml-2">
            AI Traceability & Source Audit
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6C757D]">
            AI Confidence: <strong className="text-[#198754] font-bold">{merged.overallConfidence}%</strong>
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4 text-[#6C757D]" /> : <ChevronDown className="h-4 w-4 text-[#6C757D]" />}
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-5 bg-white space-y-6 animate-in fade-in duration-300">
          {/* Finding & Core Reasoning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm space-y-1">
              <span className="text-[10px] font-bold text-[#6C757D] uppercase tracking-wider">1. What Was Found? (Finding)</span>
              <p className="font-semibold text-[#212529]">{merged.finding}</p>
            </div>
            <div className="p-3.5 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm space-y-1">
              <span className="text-[10px] font-bold text-[#6C757D] uppercase tracking-wider">2. Why Was It Found? (Reasoning)</span>
              <p className="text-[#495057]">{merged.reason}</p>
            </div>
          </div>

          {/* Business Impact & Recommended Action */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3.5 border border-[#DEE2E6] rounded-sm bg-[#FDF2F2] border-l-4 border-l-[#A80000] space-y-1">
              <span className="text-[10px] font-bold text-[#A80000] uppercase tracking-wider">3. Business Impact</span>
              <p className="text-xs text-[#495057] font-medium">{merged.businessImpact}</p>
            </div>
            <div className="p-3.5 border border-[#DEE2E6] rounded-sm bg-[#E5F0FA] border-l-4 border-l-[#005A9E] space-y-1 col-span-2">
              <span className="text-[10px] font-bold text-[#005A9E] uppercase tracking-wider">4. Recommended Management Action</span>
              <p className="text-xs text-[#212529] font-medium">{merged.recommendedAction}</p>
            </div>
          </div>

          {/* Source Document Traceability Table */}
          <div>
            <h4 className="text-xs font-bold text-[#212529] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-[#005A9E]" /> Source Document Traceability
            </h4>
            <div className="border border-[#DEE2E6] rounded-sm overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8F9FA] text-[#6C757D] uppercase tracking-wider border-b border-[#DEE2E6]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Source Document</th>
                    <th className="px-3 py-2 font-semibold">Page / Note Ref</th>
                    <th className="px-3 py-2 font-semibold">Matched Text / Excerpt</th>
                    <th className="px-3 py-2 font-semibold text-right">Match Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEE2E6]">
                  {merged.traceability.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F8F9FA] transition-colors">
                      <td className="px-3 py-2.5 font-semibold text-[#212529] flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-[#005A9E] shrink-0" />
                        {item.sourceDoc}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[#005A9E]">{item.reference}</td>
                      <td className="px-3 py-2.5 text-[#495057] italic">{item.excerpt || "Direct data match"}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-[#198754]">{item.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Granular AI Confidence Breakdown */}
          {merged.confidenceBreakdown && (
            <div className="bg-[#F8F9FA] p-3 border border-[#DEE2E6] rounded-sm space-y-2">
              <span className="text-[10px] font-bold text-[#6C757D] uppercase tracking-wider block">AI Confidence Score Breakdown</span>
              <div className="grid grid-cols-5 gap-3 text-center">
                <div className="p-2 bg-white border border-[#DEE2E6] rounded-sm">
                  <span className="text-[10px] text-[#6C757D] block">Doc Coverage</span>
                  <strong className="text-sm text-[#005A9E]">{merged.confidenceBreakdown.docCoverage}%</strong>
                </div>
                <div className="p-2 bg-white border border-[#DEE2E6] rounded-sm">
                  <span className="text-[10px] text-[#6C757D] block">Historical Coverage</span>
                  <strong className="text-sm text-[#005A9E]">{merged.confidenceBreakdown.historicalCoverage}%</strong>
                </div>
                <div className="p-2 bg-white border border-[#DEE2E6] rounded-sm">
                  <span className="text-[10px] text-[#6C757D] block">Financial Coverage</span>
                  <strong className="text-sm text-[#005A9E]">{merged.confidenceBreakdown.financialCoverage}%</strong>
                </div>
                <div className="p-2 bg-white border border-[#DEE2E6] rounded-sm">
                  <span className="text-[10px] text-[#6C757D] block">Evidence Quality</span>
                  <strong className="text-sm text-[#198754]">{merged.confidenceBreakdown.evidenceQualityScore}%</strong>
                </div>
                <div className="p-2 bg-white border border-[#DEE2E6] rounded-sm">
                  <span className="text-[10px] text-[#6C757D] block">Understanding</span>
                  <strong className="text-sm text-[#005A9E]">{merged.confidenceBreakdown.understandingScore}%</strong>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
