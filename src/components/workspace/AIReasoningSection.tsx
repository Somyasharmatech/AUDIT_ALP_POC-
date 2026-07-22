import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { ChevronDown, ChevronUp, BrainCircuit, FileText, AlertTriangle, HelpCircle, Layers, ShieldCheck, Clock, TrendingDown } from 'lucide-react';

export interface DocContribution {
  docName: string;
  percentage: number;
}

export interface AIReasoningProps {
  title?: string;
  whyConclusion: string;
  influencingDocs: DocContribution[];
  conflictingEvidence?: string;
  preferredConclusionReason: string;
  overallConfidence: number;
  assumptions?: {
    assumption: string;
    reason: string;
    impactIfIncorrect: string;
    confidence: number;
  }[];
  limitations?: {
    undetermined: string;
    additionalDocsNeeded: string;
    confidenceGain: string;
  };
  whatIfAnalysis?: {
    thirtyDays: string;
    ninetyDays: string;
    oneEightyDays: string;
  };
}

export function AIReasoningSection({
  title = "AI Reasoning & Document Intelligence",
  whyConclusion,
  influencingDocs,
  conflictingEvidence,
  preferredConclusionReason,
  overallConfidence,
  assumptions,
  limitations,
  whatIfAnalysis,
}: AIReasoningProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="shadow-sm border-[#DEE2E6] bg-[#F8F9FA] overflow-hidden">
      <CardHeader 
        className="p-3.5 bg-gradient-to-r from-[#F8F9FA] to-[#E5F0FA] border-b border-[#DEE2E6] cursor-pointer hover:bg-[#E5F0FA]/80 transition-colors flex flex-row items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-[#005A9E]" />
          <span>{title}</span>
          <Badge variant="outline" className="border-[#005A9E] text-[#005A9E] bg-white text-[10px]">
            Expandable Reasoning
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[#6C757D]">Confidence: <strong className="text-[#198754] font-bold">{overallConfidence}%</strong></span>
          {isOpen ? <ChevronUp className="h-4 w-4 text-[#6C757D]" /> : <ChevronDown className="h-4 w-4 text-[#6C757D]" />}
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-5 bg-white space-y-5 animate-in fade-in duration-300 text-xs">
          {/* Why Conclusion & Preferred Reason */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm space-y-1">
              <span className="font-bold text-[#212529] uppercase text-[10px] tracking-wider block">Why AI Reached This Conclusion</span>
              <p className="text-[#495057] leading-relaxed">{whyConclusion}</p>
            </div>
            <div className="p-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm space-y-1">
              <span className="font-bold text-[#212529] uppercase text-[10px] tracking-wider block">Why Selected Option Was Preferred</span>
              <p className="text-[#495057] leading-relaxed">{preferredConclusionReason}</p>
            </div>
          </div>

          {/* Conflicting Evidence if present */}
          {conflictingEvidence && (
            <div className="p-3 bg-[#FFF3CD] border border-[#FFC107] text-[#856404] rounded-sm flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[10px] uppercase font-bold tracking-wider block">Conflicting Evidence Analyzed</strong>
                <p className="mt-0.5">{conflictingEvidence}</p>
              </div>
            </div>
          )}

          {/* Document Contribution Visual Bars */}
          <div>
            <span className="font-bold text-[#212529] uppercase text-[10px] tracking-wider block mb-2">
              Document Contribution Breakdown
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {influencingDocs.map((doc, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#495057]">
                    <span className="font-medium truncate">{doc.docName}</span>
                    <span className="font-bold text-[#005A9E]">{doc.percentage}%</span>
                  </div>
                  <div className="w-full bg-[#E9ECEF] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#005A9E] h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${doc.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assumptions */}
          {assumptions && assumptions.length > 0 && (
            <div className="border border-[#DEE2E6] rounded-sm p-3 bg-[#F8F9FA] space-y-2">
              <span className="font-bold text-[#005A9E] uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-[#005A9E]" /> Key AI Assumptions (When Information Was Missing)
              </span>
              <div className="space-y-2">
                {assumptions.map((item, idx) => (
                  <div key={idx} className="bg-white p-2.5 border border-[#DEE2E6] rounded-sm space-y-1">
                    <div className="font-semibold text-[#212529]">{item.assumption}</div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-[#6C757D]">
                      <div><strong>Reason:</strong> {item.reason}</div>
                      <div><strong>Impact if Incorrect:</strong> <span className="text-[#A80000]">{item.impactIfIncorrect}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What-If Analysis */}
          {whatIfAnalysis && (
            <div className="border border-[#DEE2E6] rounded-sm p-3 bg-[#FDF2F2] border-l-4 border-l-[#A80000] space-y-2">
              <span className="font-bold text-[#A80000] uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#A80000]" /> What-If Analysis (Impact If Management Takes No Action)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-2.5 border border-[#DEE2E6] rounded-sm">
                  <span className="font-bold text-[#A80000] block">In 30 Days</span>
                  <p className="text-[11px] text-[#495057] mt-0.5">{whatIfAnalysis.thirtyDays}</p>
                </div>
                <div className="bg-white p-2.5 border border-[#DEE2E6] rounded-sm">
                  <span className="font-bold text-[#A80000] block">In 90 Days</span>
                  <p className="text-[11px] text-[#495057] mt-0.5">{whatIfAnalysis.ninetyDays}</p>
                </div>
                <div className="bg-white p-2.5 border border-[#DEE2E6] rounded-sm">
                  <span className="font-bold text-[#A80000] block">In 180 Days</span>
                  <p className="text-[11px] text-[#495057] mt-0.5">{whatIfAnalysis.oneEightyDays}</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Limitations */}
          {limitations && (
            <div className="p-3 border border-[#DEE2E6] rounded-sm bg-[#F8F9FA] text-[11px] space-y-1">
              <span className="font-bold text-[#6C757D] uppercase text-[10px] tracking-wider block">AI Model Limitations & Confidence Enhancement Path</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[#495057]">
                <div><strong>Could Not Determine:</strong> {limitations.undetermined}</div>
                <div><strong>Additional Docs Needed:</strong> {limitations.additionalDocsNeeded}</div>
                <div><strong>Expected Confidence Gain:</strong> <span className="text-[#198754] font-bold">+{limitations.confidenceGain}</span></div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
