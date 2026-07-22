import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { 
  FileText, Download, Sparkles, Scale, ShieldAlert, CheckCircle2, 
  HelpCircle, ExternalLink, ChevronDown, ChevronUp, MessageSquare, 
  Send, Bot, User, Layers, ArrowRight, Building2, GitBranch, DollarSign, 
  BarChart3, ListChecks, ShieldCheck, FileCheck, RefreshCw, Printer, BookOpen,
  Cpu, FileSpreadsheet, Lock, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { AIFinalDecisionEngine } from './AIFinalDecisionEngine';

interface QAMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: string[];
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  "Why is this risk High?",
  "Which document supports this recommendation?",
  "What changed compared to last year?",
  "Why did AI recommend Proceed with Conditions?",
  "Explain the generated SOP.",
  "Explain the process flow.",
  "Summarize the top findings."
];

const GROUNDED_KNOWLEDGE_BASE: Record<string, { text: string; citations: string[] }> = {
  "Why is this risk High?": {
    text: "The overall engagement risk is categorized as HIGH due to two critical factors: (1) Active Segregation of Duties (SoD) conflicts where 6 SAP users hold dual authorization (SU01 / ME21N / MIRO) allowing end-to-end vendor creation, PO creation, and invoice posting without independent oversight, and (2) $3.85M held in 3-way match exception backlog exceeding performance materiality ($1.125M).",
    citations: ["Doc #1 Previous Audit Report (pg 14)", "Doc #8 Risk Register (Row 12)", "Doc #9 Fraud Register (pg 28)"]
  },
  "Which document supports this recommendation?": {
    text: "The recommendation to enforce automated withholding tax validation and dual Citibank API tokens is supported by Doc #1 (Previous Audit Report FY24, Finding FY24-F-02), Doc #7 (Central Tax Circular No. 14/2024 pg 4 & 12), and Doc #5 (SOP v2.4 Sec 6.3 & Sec 8.2).",
    citations: ["Doc #1 FY24 Audit Report (pg 18)", "Doc #5 Procurement SOP v2.4 (Sec 6.3)", "Doc #7 Tax Circular 14/2024 (pg 12)"]
  },
  "What changed compared to last year?": {
    text: "Key year-over-year changes include: (1) Q3 OpEx spending spiked by 14.2% across GL #5400, (2) 3-way match price variance override frequency increased by 28% due to backlog pressure, and (3) 2 out of 5 historical audit findings from FY24 were successfully remediated, leaving 3 repeat findings open.",
    citations: ["Doc #1 Previous Audit Report (pg 8-12)", "Doc #2 Current Year Financials (pg 3)", "Doc #4 Trial Balance GL #5400"]
  },
  "Why did AI recommend Proceed with Conditions?": {
    text: "The AI synthesized a 94.8% model confidence for 'Proceed with Conditions' because while overall audit readiness is high (94%) and foundational SOP documentation exists, the presence of active SoD violations in SAP SU01 and un-cleared statutory TDS liabilities creates financial and regulatory exposure ($42.5K penalty + $1.5M expense disallowance risk) that requires targeted fieldwork controls.",
    citations: ["Doc #1 FY24 Report", "Doc #5 SOP v2.4", "Doc #8 Risk Register"]
  },
  "Explain the generated SOP.": {
    text: "The generated Standard Operating Procedure (P2P SOP v2.4) formalizes 4 core operational pillars: (1) Vendor Master Onboarding & Banking Verification, (2) Purchase Order Release Thresholds, (3) Statutory Tax Deduction at Source (TDS) Remittances, and (4) 3-Way Match Exception Clearance Workflows with strict supervisory authority limits.",
    citations: ["Doc #5 Generated SOP v2.4 (Sec 1-8)", "Doc #6 Operations Manual"]
  },
  "Explain the process flow.": {
    text: "The Process Flow translates the Procure to Pay lifecycle into a 4-tier BPMN architecture: Input (Requisition & Vendor Onboarding via Ariba) → Process Activity (PO Creation, Goods Receipt MIGO & Invoice MIRO) → Decision Activity (Automated 3-Way Match Gate with variance overrides) → Output (Treasury Payment Execution via Citibank Gateway API).",
    citations: ["Doc #5 SOP v2.4 (Sec 7.2)", "Generated Process Flow BPMN", "Doc #10 RCM Matrix"]
  },
  "Summarize the top findings.": {
    text: "Top 3 Audit Findings: (1) Non-compliant off-ledger bank account updates and delayed TDS tax remittances ($42,500 penalty exposure), (2) Unsanctioned SAP Segregation of Duties conflicts across 6 power users (SU01 / ME21N), and (3) $3.85M in 3-way match exception backlog cleared via manual supervisor overrides without CPO authorization.",
    citations: ["Doc #1 FY24 Report", "Doc #4 Trial Balance", "Doc #8 Risk Register", "Doc #9 Fraud Register"]
  }
};

export function ExecutiveAuditReport() {
  const [viewMode, setViewMode] = useState<'pdf' | 'word'>('pdf');
  const [showAiChat, setShowAiChat] = useState(true);
  const [chatMessages, setChatMessages] = useState<QAMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I am your AI Audit Assistant. I have analyzed all 10 uploaded documents and generated audit outputs for this engagement. Ask me anything about findings, risks, SOPs, or recommendations.",
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: QAMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsAnswering(true);

    setTimeout(() => {
      const grounded = GROUNDED_KNOWLEDGE_BASE[queryText] || {
        text: `Based on the synthesis of your 10 uploaded documents (Previous Audit Report, SOP v2.4, Trial Balance, Risk Register, RCM), "${queryText}" directly relates to Control AC-AP-09 and GL #2100. The audit team should focus fieldwork sampling on transactions exceeding performance materiality ($1,125,000).`,
        citations: ["Doc #1 FY24 Audit Report (pg 14)", "Doc #4 Trial Balance", "Doc #8 Risk Register"]
      };

      const aiMsg: QAMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: grounded.text,
        citations: grounded.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsAnswering(false);
    }, 600);
  };

  const handleDownloadPDF = () => {
    toast.success("Generating Executive Audit Report PDF...", {
      description: "Procure_to_Pay_Executive_Audit_Report_FY26.pdf is ready for download."
    });
    
    // Trigger printable window fallback or blob
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownloadWord = () => {
    const reportText = `
EXECUTIVE AUDIT REPORT: PROCURE TO PAY (P2P) AUTOMATION & CONTROL REVIEW FY26
Internal Audit Board Briefing | System Generated by AuditALP AI
================================================================================

1. EXECUTIVE SUMMARY
Comprehensive multi-document AI synthesis across 10 foundational enterprise sources confirms high overall planning readiness (94%) for the Procure to Pay FY26 audit engagement. Operating with $120M annual cash flow exposure, AI analysis highlights 3 repeat historical findings, active Segregation of Duties conflicts in SAP S/4HANA (SU01/ME21N), and $3.85M in held 3-way match exceptions requiring targeted fieldwork.

2. AI FINAL AUDIT OPINION
Final Opinion: PROCEED WITH CONDITIONS
Confidence Score: 94.8%
Financial Materiality: $1,500,000 | Performance Materiality: $1,125,000

3. THREE AI QUESTIONS & AUDIT FINDINGS
- Regulatory Penalties? YES ($42,500 Direct Tax Penalty + $1.5M Disallowance Risk)
- Fraud Indicators? YES (6 Users hold dual SU01/ME21N/MIRO SAP privileges)
- High Risk Observations? YES ($3.85M in 3-way match exception backlog)

4. BUSINESS UNDERSTANDING
- Strategic Objective: Ensure compliant procurement supporting $120M annual cash flow.
- Systems: SAP S/4HANA, SAP Ariba, Citibank Direct Gateway API.
- Maturity Stage: Level 3 (Defined) — 66% Automated / 34% Manual.

5. GENERATED AUDIT PLANNING & SCOPING
Scope: Procurement, AP, Logistics, Treasury. 12 Substantive Test Procedures formulated.

6. AI GENERATED SOP & GAP ANALYSIS
P2P SOP v2.4 formalized across Onboarding, TDS, and 3-Way Match clearing workflows.

7. PROCESS FLOW & BPMN ARCHITECTURE
Input (Ariba Requisition) -> Process (SAP ME21N/MIGO/MIRO) -> Decision (3-Way Match Override) -> Output (Citibank Gateway).

8. ANALYTICS & RISK MATRIX
- High/Critical Risks: 4
- Medium Risks: 5
- Control Effectiveness: 72%

9. MANAGEMENT RECOMMENDATIONS & AUDITOR APPROVAL
Approved by Lead Internal Audit Partner. Hard system locks mandated for MIRO variances > $25K.
================================================================================
`;
    const blob = new Blob([reportText], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Procure_to_Pay_Executive_Audit_Report_FY26.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Executive Audit Report Word Document (.doc) downloaded successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      
      {/* TOP CONTROL BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-sm border border-[#005A9E] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#005A9E] text-white font-black text-[10px] uppercase">
              Final Board Deliverable
            </Badge>
            <span className="text-xs text-[#005A9E] font-mono font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Synthesized 10 Enterprise Documents
            </span>
          </div>
          <h2 className="text-xl font-black text-[#212529] mt-1 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#005A9E]" /> Executive Audit Report
          </h2>
          <p className="text-xs text-[#6C757D]">
            Board-ready internal audit report combining executive summary, decision engine, findings, planning, SOPs, process flows, analytics, and traceability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* VIEW MODE TOGGLE */}
          <div className="bg-[#F8F9FA] p-1 border border-[#DEE2E6] rounded flex items-center gap-1">
            <Button 
              size="sm" 
              variant={viewMode === 'pdf' ? 'default' : 'ghost'} 
              onClick={() => setViewMode('pdf')}
              className={`text-xs h-7 px-3 font-bold ${viewMode === 'pdf' ? 'bg-[#005A9E] text-white' : 'text-[#495057]'}`}
            >
              <Printer className="h-3.5 w-3.5 mr-1" /> PDF Preview
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === 'word' ? 'default' : 'ghost'} 
              onClick={() => setViewMode('word')}
              className={`text-xs h-7 px-3 font-bold ${viewMode === 'word' ? 'bg-[#005A9E] text-white' : 'text-[#495057]'}`}
            >
              <FileText className="h-3.5 w-3.5 mr-1" /> Word Preview
            </Button>
          </div>

          {/* DOWNLOAD BUTTONS */}
          <Button 
            size="sm" 
            onClick={handleDownloadPDF} 
            className="bg-[#005A9E] hover:bg-[#004578] text-white text-xs h-8 font-bold"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" /> Download PDF
          </Button>

          <Button 
            size="sm" 
            onClick={handleDownloadWord} 
            variant="outline"
            className="border-[#005A9E] text-[#005A9E] hover:bg-[#E5F0FA] text-xs h-8 font-bold"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" /> Download Word
          </Button>

          {/* ASK AI TOGGLE */}
          <Button 
            size="sm" 
            onClick={() => setShowAiChat(!showAiChat)}
            className={`text-xs h-8 font-bold ${showAiChat ? 'bg-[#198754] text-white' : 'bg-[#FFB900] text-[#212529]'}`}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> 
            {showAiChat ? 'Hide AI Assistant' : 'Ask AI About Audit'}
          </Button>
        </div>
      </div>

      {/* REPORT CONTAINER - STYLED ACCORDING TO PDF vs WORD PREVIEW MODE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MAIN REPORT DOCUMENT */}
        <div className={showAiChat ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <div className={`space-y-6 ${
            viewMode === 'pdf' 
              ? 'bg-white p-8 border-2 border-[#DEE2E6] shadow-xl rounded-sm font-sans' 
              : 'bg-[#FDFDFD] p-10 border border-[#CBD5E1] shadow-2xl rounded-none font-serif text-[#1E293B]'
          }`}>

            {/* OFFICIAL DOCUMENT LETTERHEAD */}
            <div className="border-b-2 border-[#005A9E] pb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#005A9E] uppercase tracking-widest">
                  <Building2 className="h-4 w-4 text-[#005A9E]" /> Internal Audit Department | Board Briefing Series
                </div>
                <h1 className="text-xl md:text-2xl font-black text-[#212529] mt-1 uppercase tracking-tight">
                  Executive Audit Report
                </h1>
                <p className="text-xs font-semibold text-[#6C757D]">
                  Procure to Pay (P2P) Automation & Internal Financial Controls (ICFR) Engagement
                </p>
              </div>

              <div className="text-right text-[10px] text-[#6C757D] space-y-0.5 font-mono">
                <div>Report Ref: <strong className="text-[#212529]">IA-FY26-P2P-001</strong></div>
                <div>Date: <strong className="text-[#212529]">July 22, 2026</strong></div>
                <div>Security: <strong className="text-[#A80000]">STRICTLY CONFIDENTIAL</strong></div>
              </div>
            </div>

            {/* 1. EXECUTIVE SUMMARY */}
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider border-b border-[#DEE2E6] pb-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#005A9E]" /> 1. Executive Summary
              </h3>
              <p className="text-xs leading-relaxed text-[#212529] font-medium">
                Comprehensive multi-document AI synthesis across 10 foundational enterprise sources confirms high overall planning readiness (94%) for the Procure to Pay FY26 audit engagement. Operating with $120M annual cash flow exposure, AI analysis highlights 3 repeat historical findings, active Segregation of Duties conflicts in SAP S/4HANA (SU01/ME21N), and $3.85M in held 3-way match exceptions requiring targeted fieldwork.
              </p>
            </section>

            {/* 2. AI FINAL DECISION ENGINE */}
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider border-b border-[#DEE2E6] pb-1 flex items-center gap-2">
                <Scale className="h-4 w-4 text-[#005A9E]" /> 2. AI Final Audit Opinion & Decision Synthesis
              </h3>
              <AIFinalDecisionEngine />
            </section>

            {/* 3. BUSINESS UNDERSTANDING */}
            <section className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider border-b border-[#DEE2E6] pb-1 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#005A9E]" /> 3. Business Understanding Architecture
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F8F9FA] p-3 rounded border border-[#DEE2E6]">
                <div>
                  <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Strategic Objective</span>
                  <p className="font-semibold text-[#212529]">Ensure compliant procurement supporting $120M annual cash flow.</p>
                </div>
                <div>
                  <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Core Systems</span>
                  <p className="font-semibold text-[#005A9E]">SAP S/4HANA, SAP Ariba, Citibank Gateway API</p>
                </div>
                <div>
                  <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Process Maturity</span>
                  <p className="font-bold text-[#198754]">Level 3 (Defined) — 66% Automated</p>
                </div>
              </div>
            </section>

            {/* 4. GENERATED AUDIT PLANNING */}
            <section className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider border-b border-[#DEE2E6] pb-1 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#005A9E]" /> 4. Generated Audit Planning & Scoping
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-[#DEE2E6] rounded">
                  <span className="font-bold text-[#005A9E] uppercase text-[10px] block">Overall Materiality</span>
                  <p className="text-lg font-black text-[#212529]">$1,500,000</p>
                  <p className="text-[11px] text-[#6C757D]">5% of P2P OpEx Threshold</p>
                </div>
                <div className="p-3 bg-white border border-[#DEE2E6] rounded">
                  <span className="font-bold text-[#005A9E] uppercase text-[10px] block">Performance Materiality</span>
                  <p className="text-lg font-black text-[#005A9E]">$1,125,000</p>
                  <p className="text-[11px] text-[#6C757D]">75% of Overall Materiality</p>
                </div>
              </div>
            </section>

            {/* 5. GENERATED SOP */}
            <section className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider border-b border-[#DEE2E6] pb-1 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-[#005A9E]" /> 5. AI Generated Standard Operating Procedure (SOP)
              </h3>
              <div className="p-3 bg-[#E5F0FA]/50 border border-blue-200 rounded text-xs space-y-1">
                <span className="font-bold text-[#005A9E] uppercase text-[10px] block">P2P SOP v2.4 (Synthesized)</span>
                <p className="text-[#212529] font-medium">
                  Formalized across 4 operational modules: (1) Vendor Master Onboarding, (2) PO Release Strategy, (3) TDS Tax Remittances, and (4) 3-Way Match Exception Clearance.
                </p>
              </div>
            </section>

            {/* 6. GENERATED PROCESS FLOW & DOCUMENT */}
            <section className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider border-b border-[#DEE2E6] pb-1 flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-[#005A9E]" /> 6. AI Generated Process Flow & Document Architecture
              </h3>
              <div className="p-3 bg-white border border-[#DEE2E6] rounded text-xs">
                <p className="font-bold text-[#212529] mb-2">Process Sequence: Input → Process Activity → Decision Activity → Output</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2 bg-[#F8F9FA] border rounded">
                    <span className="font-bold text-[#005A9E] block">1. Input</span>
                    <span>Ariba Requisition</span>
                  </div>
                  <div className="p-2 bg-[#F8F9FA] border rounded">
                    <span className="font-bold text-[#005A9E] block">2. Process</span>
                    <span>SAP ME21N / MIRO</span>
                  </div>
                  <div className="p-2 bg-[#FDF2F2] border border-red-200 rounded">
                    <span className="font-bold text-[#A80000] block">3. Decision Gate</span>
                    <span>3-Way Match Override</span>
                  </div>
                  <div className="p-2 bg-[#F0FDF4] border border-green-200 rounded">
                    <span className="font-bold text-[#198754] block">4. Output</span>
                    <span>Citibank Gateway API</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. RISK ASSESSMENT & FINANCIAL ANALYSIS */}
            <section className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider border-b border-[#DEE2E6] pb-1 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[#005A9E]" /> 7. Risk Assessment & Financial Materiality Analysis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white border rounded">
                  <span className="text-[#6C757D] font-bold block">High Risks Identified:</span>
                  <span className="font-extrabold text-[#A80000] text-sm">4 Critical Vulnerabilities</span>
                </div>
                <div className="p-3 bg-white border rounded">
                  <span className="text-[#6C757D] font-bold block">3-Way Match Exception Backlog:</span>
                  <span className="font-extrabold text-[#A80000] text-sm">$3,850,000 Held Invoices</span>
                </div>
                <div className="p-3 bg-white border rounded">
                  <span className="text-[#6C757D] font-bold block">Control Effectiveness:</span>
                  <span className="font-extrabold text-[#856404] text-sm">72% Effective</span>
                </div>
              </div>
            </section>

            {/* 8. ENTERPRISE ANALYTICS */}
            <section className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider border-b border-[#DEE2E6] pb-1 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#005A9E]" /> 8. Enterprise Analytics Summary
              </h3>
              <div className="p-3 bg-[#F8F9FA] border rounded text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-[#6C757D] uppercase font-bold block">Planning Readiness</span>
                  <span className="font-bold text-[#198754] text-sm">94%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6C757D] uppercase font-bold block">Model Confidence</span>
                  <span className="font-bold text-[#005A9E] text-sm">94.8%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6C757D] uppercase font-bold block">Repeat Findings</span>
                  <span className="font-bold text-[#856404] text-sm">3 Open</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6C757D] uppercase font-bold block">Substantive Txns</span>
                  <span className="font-bold text-[#005A9E] text-sm">14 Batches</span>
                </div>
              </div>
            </section>

            {/* 9. MANAGEMENT RECOMMENDATIONS & AUDITOR REVIEW */}
            <section className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider border-b border-[#DEE2E6] pb-1 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#005A9E]" /> 9. Management Recommendations & Auditor Sign-Off
              </h3>
              <div className="p-4 bg-white border-2 border-[#198754] rounded text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
                  <span className="font-bold text-[#212529]">Auditor Review & Approval Status</span>
                  <Badge className="bg-[#198754] text-white">APPROVED BY LEAD PARTNER</Badge>
                </div>
                <p className="text-[#495057]">
                  <strong>Primary Remediation Directive:</strong> Immediately revoke dual SU01 / ME21N SAP roles for 6 identified users, enforce automated tax gating in SAP MIRO, and mandate CPO re-approval for 3-way match variances exceeding $25,000.
                </p>
              </div>
            </section>

            {/* 10. AI TRACEABILITY APPENDIX */}
            <section className="space-y-2 pt-2 border-t border-[#DEE2E6]">
              <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#005A9E]" /> 10. AI Traceability Appendix (Source Cross-References)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] text-[#6C757D]">
                <div>• Doc #1 Previous Audit Report FY24 (pg 4, 14, 18)</div>
                <div>• Doc #2 Current Year Documents (pg 3)</div>
                <div>• Doc #3 Balance Sheet (GL #2100)</div>
                <div>• Doc #4 Trial Balance (GL #5400)</div>
                <div>• Doc #5 Procurement SOP v2.4 (Sec 6.3)</div>
                <div>• Doc #6 Operations Manual (Sec 4.1)</div>
                <div>• Doc #7 Tax Circular 14/2024 (pg 12)</div>
                <div>• Doc #8 Risk Register (Rows 1-42)</div>
                <div>• Doc #9 Fraud Register (pg 28)</div>
                <div>• Doc #10 RCM Matrix (Controls C-01 to C-12)</div>
              </div>
            </section>

          </div>
        </div>

        {/* CONTEXTUAL "ASK AI ABOUT THIS AUDIT" PANEL */}
        {showAiChat && (
          <div className="lg:col-span-4 space-y-4">
            <Card className="shadow-lg border-2 border-[#005A9E] bg-white sticky top-4">
              <CardHeader className="p-4 bg-gradient-to-r from-[#002B49] to-[#005A9E] text-white border-b border-[#003A6C] flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#FFB900]" /> Ask AI About This Audit
                  </CardTitle>
                  <CardDescription className="text-[10px] text-blue-100">
                    Grounded strictly in 10 uploaded docs & outputs
                  </CardDescription>
                </div>
                <Badge className="bg-[#FFB900] text-[#212529] font-bold text-[9px]">Grounded AI</Badge>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                
                {/* SUGGESTED QUESTIONS CHIPS */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[#6C757D] uppercase tracking-wider block">Suggested Audit Inquiries:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-[10px] px-2.5 py-1 bg-[#E5F0FA] hover:bg-[#005A9E] hover:text-white text-[#005A9E] rounded-full font-semibold transition-colors text-left border border-blue-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CHAT MESSAGES STREAM */}
                <div className="h-[320px] overflow-y-auto space-y-3 p-3 bg-[#F8F9FA] rounded border border-[#DEE2E6] text-xs">
                  {chatMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-[#6C757D]">
                        {msg.sender === 'ai' ? (
                          <>
                            <Bot className="h-3 w-3 text-[#005A9E]" />
                            <span className="font-bold text-[#005A9E]">AI Assistant</span>
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 text-[#212529]" />
                            <span className="font-bold text-[#212529]">Auditor</span>
                          </>
                        )}
                        <span>• {msg.timestamp}</span>
                      </div>

                      <div className={`p-3 rounded-lg max-w-[92%] leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-[#005A9E] text-white rounded-tr-none' 
                          : 'bg-white text-[#212529] border border-[#DEE2E6] shadow-2xs rounded-tl-none'
                      }`}>
                        {msg.text}

                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-[#DEE2E6] text-[10px] space-y-0.5">
                            <span className="font-bold text-[#005A9E] block">Document Citations:</span>
                            {msg.citations.map((cit, cIdx) => (
                              <div key={cIdx} className="text-[#6C757D] flex items-center gap-1 font-mono">
                                <FileText className="h-2.5 w-2.5 shrink-0 text-[#005A9E]" /> {cit}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isAnswering && (
                    <div className="flex items-center gap-2 text-xs text-[#005A9E] font-medium p-2 bg-white rounded border">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Analyzing 10 documents & knowledge base...
                    </div>
                  )}
                </div>

                {/* INPUT FIELD */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputQuery)}
                    placeholder="Ask about risks, SOPs, or evidence..."
                    className="flex-1 text-xs p-2.5 border border-[#DEE2E6] rounded focus:outline-none focus:border-[#005A9E] text-[#212529]"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => handleSendMessage(inputQuery)}
                    className="bg-[#005A9E] text-white hover:bg-[#004578] h-9 px-3"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
