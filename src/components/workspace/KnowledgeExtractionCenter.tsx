import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { 
  FileText, CheckCircle2, Building2, GitBranch, DollarSign, ShieldAlert, Scale, 
  History, Network, Award, Sparkles, ArrowRight, Database, Layers, Download, 
  Zap, Cpu, ListChecks, FileCheck2, BadgeCheck, AlertTriangle, ChevronRight, 
  Search, Eye, ExternalLink, HelpCircle, ArrowDownRight, RefreshCw, Check
} from 'lucide-react';
import { toast } from 'sonner';

interface KnowledgeExtractionCenterProps {
  onSelectTab?: (tabId: string) => void;
}

export function KnowledgeExtractionCenter({ onSelectTab }: KnowledgeExtractionCenterProps) {
  const [selectedDoc, setSelectedDoc] = useState<string>('doc-1');

  const handleProceed = () => {
    if (onSelectTab) {
      onSelectTab('audit-intelligence-center');
    } else {
      toast.success("Proceeding to Audit Intelligence Center...");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-[#002B49] via-[#004B87] to-[#0078D4] text-white p-6 rounded-sm shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-[#00A4EF]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#00A4EF] text-white font-bold text-xs uppercase px-2.5 py-0.5">
              Enterprise Knowledge Base Engine
            </Badge>
            <span className="text-xs text-blue-100 font-mono">Status: 100% Extracted & Index Synthesized</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Knowledge Extraction Center</h1>
          <p className="text-sm text-blue-100 max-w-3xl leading-relaxed">
            Transparent view of how multi-source enterprise documents were ingested, structured, and cross-referenced by AI into a unified Audit Knowledge Graph prior to report generation.
          </p>
        </div>
        <div className="shrink-0 flex flex-col gap-2">
          <Button 
            onClick={handleProceed} 
            className="bg-[#198754] hover:bg-[#146c43] text-white font-bold shadow-md text-xs h-10 px-5"
          >
            Proceed to Audit Intelligence Center <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* SECTION 10: KNOWLEDGE READY (HERO COMPLETION CARD AT TOP) */}
      <Card className="shadow-md border-[#198754] bg-gradient-to-br from-[#F0FDF4] via-white to-[#F8F9FA]">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DEE2E6] pb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-[#198754] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <BadgeCheck className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#198754] uppercase tracking-wider block">Enterprise Knowledge Base Ready</span>
                <h2 className="text-xl font-black text-[#212529]">P2P Enterprise Audit Knowledge Base Synthesized</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <Badge className="bg-[#005A9E] text-white font-bold px-3 py-1 text-xs">Knowledge Score: 96.8%</Badge>
              <Badge variant="outline" className="border-[#198754] text-[#198754] font-bold text-xs">11/11 Sources Grounded</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3 bg-white border border-[#DEE2E6] rounded-sm shadow-2xs">
              <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Business Processes</span>
              <span className="text-xl font-extrabold text-[#005A9E]">14</span>
              <span className="text-[10px] text-[#198754] block font-medium">Mapped & Modeled</span>
            </div>
            <div className="p-3 bg-white border border-[#DEE2E6] rounded-sm shadow-2xs">
              <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Internal Controls</span>
              <span className="text-xl font-extrabold text-[#005A9E]">46</span>
              <span className="text-[10px] text-[#005A9E] block font-medium">32 Auto / 14 Manual</span>
            </div>
            <div className="p-3 bg-white border border-[#DEE2E6] rounded-sm shadow-2xs">
              <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Identified Risks</span>
              <span className="text-xl font-extrabold text-[#A80000]">23</span>
              <span className="text-[10px] text-[#A80000] block font-medium">5 High Exposure</span>
            </div>
            <div className="p-3 bg-white border border-[#DEE2E6] rounded-sm shadow-2xs">
              <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Historical Findings</span>
              <span className="text-xl font-extrabold text-[#856404]">18</span>
              <span className="text-[10px] text-[#856404] block font-medium">3 Repeat Observations</span>
            </div>
            <div className="p-3 bg-white border border-[#DEE2E6] rounded-sm shadow-2xs">
              <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Financial Accounts</span>
              <span className="text-xl font-extrabold text-[#005A9E]">72</span>
              <span className="text-[10px] text-[#198754] block font-medium">$120M Reconciled</span>
            </div>
            <div className="p-3 bg-white border border-[#DEE2E6] rounded-sm shadow-2xs">
              <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Policies & Circulars</span>
              <span className="text-xl font-extrabold text-[#005A9E]">12</span>
              <span className="text-[10px] text-[#198754] block font-medium">Cross-Referenced</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 1: DOCUMENT INGESTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <Database className="h-4 w-4 text-[#005A9E]" /> Section 1 — Document Ingestion & Optical Parsing Matrix
          </h2>
          <span className="text-[11px] text-[#198754] font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> 11 / 11 Enterprise Sources Fully Ingested
          </span>
        </div>

        <Card className="shadow-sm border-[#DEE2E6] bg-white">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8F9FA] text-[#6C757D] uppercase border-b border-[#DEE2E6] font-semibold">
                <tr>
                  <th className="px-4 py-3">Document Name</th>
                  <th className="px-4 py-3">Document Type</th>
                  <th className="px-4 py-3">Ingestion Status</th>
                  <th className="px-4 py-3">OCR & Parsing</th>
                  <th className="px-4 py-3">Knowledge Generated</th>
                  <th className="px-4 py-3 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE2E6]">
                {[
                  { name: "Previous Audit Report (FY24)", type: "Historical Report", pages: "48 pages", status: "Uploaded", parse: "Parsed", knowledge: "18 Historical Findings, 3 Repeat Risks, Root Cause Metrics", conf: "98%" },
                  { name: "Balance Sheet & Notes FY25", type: "Financial Statement", pages: "32 pages", status: "Uploaded", parse: "Parsed", knowledge: "Liabilities, Capital Work-in-Progress, Accrual Notes", conf: "99%" },
                  { name: "Trial Balance & GL Sub-Ledger", type: "ERP Ledger Data", pages: "1,240 rows", status: "Uploaded", parse: "Parsed", knowledge: "72 Material Accounts, $120M Spend Population, Variances", conf: "100%" },
                  { name: "Current Year Procurement SOP v2.4", type: "Standard Operating Policy", pages: "64 pages", status: "Uploaded", parse: "Parsed", knowledge: "Approval Gate Thresholds, 3-Way Match Rules, DoA Matrix", conf: "96%" },
                  { name: "Operations & Procurement Manual", type: "Process Guideline", pages: "112 pages", status: "Uploaded", parse: "Parsed", knowledge: "Vendor Onboarding Workflow, Receiving Inspection Rules", conf: "95%" },
                  { name: "Central Tax Circular No. 14/2024", type: "Government Regulation", pages: "12 pages", status: "Uploaded", parse: "Parsed", knowledge: "Withholding Tax Rates (Sec 194C), Statutory Filing Schedule", conf: "99%" },
                  { name: "Enterprise Risk Register FY25", type: "Risk Taxonomy", pages: "28 pages", status: "Uploaded", parse: "Parsed", knowledge: "23 Operational & Compliance Risks, Inherited Risk Scores", conf: "97%" },
                  { name: "Corporate Fraud Register", type: "Loss Event DB", pages: "15 pages", status: "Uploaded", parse: "Parsed", knowledge: "Vendor Fraud Attack Vectors, Whistleblower Log History", conf: "94%" },
                  { name: "Risk Control Matrix (RCM)", type: "Control Governance", pages: "84 controls", status: "Uploaded", parse: "Parsed", knowledge: "46 Control Objectives, SoD Role Conflict Parameters", conf: "98%" },
                  { name: "Citibank Gateway API Integration Spec", type: "Technical Spec", pages: "36 pages", status: "Uploaded", parse: "Parsed", knowledge: "Automated Disbursement API Encryption, Dual Signoff Rules", conf: "96%" },
                  { name: "SAP Security Role Matrix (T-Code SU01)", type: "System Log", pages: "850 users", status: "Uploaded", parse: "Parsed", knowledge: "6 Conflicted SoD Users, Dual Privilege Assignments", conf: "99%" },
                ].map((doc, idx) => (
                  <tr key={idx} className="hover:bg-[#F8F9FA]/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#212529] flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-[#005A9E]" /> {doc.name}
                      </div>
                      <div className="text-[10px] text-[#6C757D]">{doc.pages}</div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{doc.type}</Badge></td>
                    <td className="px-4 py-3"><Badge className="bg-[#198754] text-[10px]"><Check className="h-3 w-3 mr-1" /> {doc.status}</Badge></td>
                    <td className="px-4 py-3"><Badge className="bg-[#005A9E] text-[10px]">{doc.parse}</Badge></td>
                    <td className="px-4 py-3 text-[#495057] font-medium">{doc.knowledge}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#198754]">{doc.conf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 2 & 3: BUSINESS & PROCESS KNOWLEDGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 2: BUSINESS KNOWLEDGE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
            <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#005A9E]" /> Section 2 — Extracted Business Architecture
            </h2>
          </div>

          <Card className="shadow-sm border-[#DEE2E6] bg-white h-full">
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#DEE2E6]">
                <div>
                  <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Enterprise Entity</span>
                  <p className="font-bold text-[#212529]">Apex Global Logistics & Industrial Corp</p>
                </div>
                <div>
                  <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Primary Process Scope</span>
                  <p className="font-bold text-[#005A9E]">Procure-to-Pay (P2P) & Treasury</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#212529] uppercase text-[11px] block">In-Scope Departments</span>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="bg-[#F8F9FA] border text-[#212529]">Procurement & Sourcing</Badge>
                  <Badge variant="secondary" className="bg-[#F8F9FA] border text-[#212529]">Accounts Payable (AP)</Badge>
                  <Badge variant="secondary" className="bg-[#F8F9FA] border text-[#212529]">Warehouse & Materials Logistics</Badge>
                  <Badge variant="secondary" className="bg-[#F8F9FA] border text-[#212529]">Corporate Treasury</Badge>
                  <Badge variant="secondary" className="bg-[#F8F9FA] border text-[#212529]">IT Governance & Security</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#212529] uppercase text-[11px] block">Critical Core Systems & Applications</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-[#E5F0FA] border border-blue-200 rounded-sm">
                    <span className="font-bold text-[#005A9E] block">SAP S/4HANA</span>
                    <span className="text-[10px] text-[#6C757D]">Core ERP Ledger</span>
                  </div>
                  <div className="p-2 bg-[#E5F0FA] border border-blue-200 rounded-sm">
                    <span className="font-bold text-[#005A9E] block">SAP Ariba</span>
                    <span className="text-[10px] text-[#6C757D]">Vendor Portal</span>
                  </div>
                  <div className="p-2 bg-[#E5F0FA] border border-blue-200 rounded-sm">
                    <span className="font-bold text-[#005A9E] block">Citibank API</span>
                    <span className="text-[10px] text-[#6C757D]">Host-to-Host Gateway</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#DEE2E6]">
                <div>
                  <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Key Stakeholders</span>
                  <p className="text-[#495057]">Chief Procurement Officer, VP Accounts Payable, Treasury Director, Corporate Controller.</p>
                </div>
                <div>
                  <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Operating Locations</span>
                  <p className="text-[#495057]">North America HQ, EMEA Regional Hub, APAC Logistics Facility.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 3: PROCESS KNOWLEDGE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
            <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-[#005A9E]" /> Section 3 — Process & Control Dynamics
            </h2>
          </div>

          <Card className="shadow-sm border-[#DEE2E6] bg-white h-full">
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-[#212529] uppercase text-[11px] block">Core Process Activities</span>
                <p className="text-[#495057] leading-relaxed">
                  Vendor Onboarding → Purchase Requisitioning → Multi-Tier PO Approval → Goods Receipt Logging → 3-Way Match Verification → Treasury Disbursement Batch Execution.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#DEE2E6]">
                <div className="space-y-1">
                  <span className="font-bold text-[#198754] uppercase text-[10px] block">Automated Controls (32)</span>
                  <ul className="space-y-1 text-[#495057]">
                    <li>• SAP ME21N PO Threshold Blocking</li>
                    <li>• MIRO Automated 3-Way Matching Engine</li>
                    <li>• Citibank API Dual-Token Authorization</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-[#A80000] uppercase text-[10px] block">Manual Controls (14)</span>
                  <ul className="space-y-1 text-[#495057]">
                    <li>• Offline Vendor Bank Change Verification</li>
                    <li>• Executive Discretionary PO Override Signoff</li>
                    <li>• Physical Warehouse Goods Inspection</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DEE2E6]">
                <span className="font-bold text-[#212529] uppercase text-[11px] block mb-1">Critical Decision Gates</span>
                <div className="p-2.5 bg-[#FFFDF5] border border-[#FFC107] rounded-sm text-[#856404]">
                  <strong>Match Variance Tolerance:</strong> Hard cap at 2% price/quantity variance. Any higher variance automatically triggers AP Supervisor Review Hold.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* SECTION 4 & 5: FINANCIAL & RISK KNOWLEDGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 4: FINANCIAL KNOWLEDGE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
            <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#005A9E]" /> Section 4 — Extracted Financial Intelligence
            </h2>
          </div>

          <Card className="shadow-sm border-[#DEE2E6] bg-white h-full">
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8F9FA] rounded-sm border border-[#DEE2E6]">
                <div>
                  <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Planning Materiality</span>
                  <span className="text-lg font-extrabold text-[#005A9E]">$1,500,000</span>
                  <span className="text-[10px] text-[#6C757D] block">5% Profit Before Tax ($30M)</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Performance Materiality</span>
                  <span className="text-lg font-extrabold text-[#005A9E]">$1,125,000</span>
                  <span className="text-[10px] text-[#6C757D] block">75% Planning Materiality</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#212529] uppercase text-[11px] block">Material Accounts In Scope</span>
                <div className="space-y-1">
                  <div className="flex justify-between p-2 bg-white border rounded">
                    <span>GL #2100 - Accounts Payable Sub-Ledger</span>
                    <strong className="text-[#005A9E]">$42.5M</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-white border rounded">
                    <span>GL #1300 - Raw Materials & Spares Inventory</span>
                    <strong className="text-[#005A9E]">$85.4M</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-white border rounded">
                    <span>GL #5400 - Operating Expenses & IT Subscriptions</span>
                    <strong className="text-[#005A9E]">$18.2M</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DEE2E6]">
                <div>
                  <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Large Transactions</span>
                  <p className="font-bold text-[#198754]">14 Txns &gt; $500,000 Threshold</p>
                </div>
                <div>
                  <span className="font-bold text-[#6C757D] uppercase text-[10px] block">Unusual Variance</span>
                  <p className="font-bold text-[#A80000]">+14.2% Q3 OpEx Spike</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 5: RISK KNOWLEDGE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
            <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#005A9E]" /> Section 5 — Extracted Risk Taxonomy
            </h2>
          </div>

          <Card className="shadow-sm border-[#DEE2E6] bg-white h-full">
            <CardContent className="p-5 space-y-3 text-xs">
              <div className="p-2.5 bg-[#FDF2F2] border border-[#DEE2E6] rounded-sm space-y-1">
                <span className="font-bold text-[#A80000] uppercase text-[11px] block flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" /> High Exposure Fraud Risk
                </span>
                <p className="text-[#212529]">
                  Fictitious vendor creation via Segregation of Duties (SoD) bypass in SAP role management (T-Code SU01).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-[#F8F9FA] border rounded">
                  <span className="font-bold text-[#6C757D] text-[10px] uppercase block">Financial Risk</span>
                  <p className="font-semibold text-[#212529]">$3.85M held in 3-way match exception backlog.</p>
                </div>
                <div className="p-2 bg-[#F8F9FA] border rounded">
                  <span className="font-bold text-[#6C757D] text-[10px] uppercase block">Compliance Risk</span>
                  <p className="font-semibold text-[#212529]">Delayed vendor withholding tax filings ($42.5K penalty).</p>
                </div>
                <div className="p-2 bg-[#F8F9FA] border rounded">
                  <span className="font-bold text-[#6C757D] text-[10px] uppercase block">Technology Risk</span>
                  <p className="font-semibold text-[#212529]">Unencrypted banking API payload transmission.</p>
                </div>
                <div className="p-2 bg-[#F8F9FA] border rounded">
                  <span className="font-bold text-[#6C757D] text-[10px] uppercase block">Operational Risk</span>
                  <p className="font-semibold text-[#212529]">Manual offline bank modification letter bypass.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* SECTION 6 & 7: REGULATORY & HISTORICAL KNOWLEDGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 6: REGULATORY KNOWLEDGE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
            <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#005A9E]" /> Section 6 — Regulatory & Policy Knowledge
            </h2>
          </div>

          <Card className="shadow-sm border-[#DEE2E6] bg-white h-full">
            <CardContent className="p-5 space-y-3 text-xs">
              <div>
                <span className="font-bold text-[#212529] uppercase text-[11px] block mb-1">Applicable Statutory Acts</span>
                <ul className="space-y-1 text-[#495057]">
                  <li>• <strong>Sarbanes-Oxley Act Sec 404:</strong> Internal Control over Financial Reporting (ICFR)</li>
                  <li>• <strong>Income Tax Act Sec 194C:</strong> Mandatory Vendor Tax Deduction at Source</li>
                  <li>• <strong>Central Bank AML Directive:</strong> Host-to-Host Wire Transfer Encryption</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-[#DEE2E6]">
                <span className="font-bold text-[#212529] uppercase text-[11px] block mb-1">Internal Policy Mandates</span>
                <p className="text-[#495057] leading-relaxed">
                  Enterprise Procurement SOP v2.4 dictates mandatory dual independent callbacks for all vendor bank account updates exceeding $10,000.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 7: HISTORICAL KNOWLEDGE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
            <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
              <History className="h-4 w-4 text-[#005A9E]" /> Section 7 — Multi-Year Historical Audit Knowledge
            </h2>
          </div>

          <Card className="shadow-sm border-[#DEE2E6] bg-white h-full">
            <CardContent className="p-5 space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-[#FFFDF5] border border-[#FFC107] rounded-sm">
                <div>
                  <span className="font-bold text-[#856404] uppercase text-[10px] block">Previous Audit Rating (FY24)</span>
                  <span className="font-bold text-[#212529] text-sm">"Needs Improvement"</span>
                </div>
                <Badge className="bg-[#FFC107] text-[#212529] font-bold">3 Repeat Findings</Badge>
              </div>

              <div className="space-y-1 text-[#495057]">
                <span className="font-bold text-[#212529] uppercase text-[11px] block">Repeat Findings Breakdown</span>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Vendor Master SoD Role Conflicts (3rd consecutive audit finding)</li>
                  <li>Manual Vendor Bank Modifications Without Dual Signoff</li>
                  <li>Delayed Quarterly Withholding Tax Remittances</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* SECTION 8: DOCUMENT RELATIONSHIP MAP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <Network className="h-4 w-4 text-[#005A9E]" /> Section 8 — Visual Document Knowledge Relationship Map
          </h2>
          <span className="text-[11px] text-[#6C757D]">Interactive Document Traceability Network</span>
        </div>

        <Card className="shadow-sm border-[#DEE2E6] bg-[#F8F9FA]">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center items-center">
              
              <div className="p-3.5 bg-white border border-[#DEE2E6] rounded-sm shadow-2xs space-y-1">
                <Badge variant="outline" className="text-[9px] border-[#005A9E] text-[#005A9E]">1. Source Documents</Badge>
                <div className="font-bold text-xs text-[#212529]">Uploaded Ingestion Package</div>
                <p className="text-[10px] text-[#6C757D]">11 Enterprise Docs (SOP, Trial Balance, RCM)</p>
              </div>

              <div className="flex flex-col items-center">
                <ArrowRight className="h-5 w-5 text-[#005A9E] hidden md:block" />
                <span className="text-[9px] font-bold text-[#005A9E] uppercase">OCR Extraction</span>
              </div>

              <div className="p-3.5 bg-white border border-[#005A9E] rounded-sm shadow-2xs space-y-1 bg-[#E5F0FA]/40">
                <Badge className="text-[9px] bg-[#005A9E]">2. Knowledge Graph</Badge>
                <div className="font-bold text-xs text-[#005A9E]">Enterprise Audit Vector Base</div>
                <p className="text-[10px] text-[#495057]">Entities, Controls, Risks, Materiality, Rules</p>
              </div>

              <div className="flex flex-col items-center">
                <ArrowRight className="h-5 w-5 text-[#005A9E] hidden md:block" />
                <span className="text-[9px] font-bold text-[#198754] uppercase">RAG Synthesis</span>
              </div>

              <div className="p-3.5 bg-white border border-[#198754] rounded-sm shadow-2xs space-y-1 bg-[#F0FDF4]">
                <Badge className="text-[9px] bg-[#198754]">3. Output Modules</Badge>
                <div className="font-bold text-xs text-[#198754]">Audit Intelligence Center</div>
                <p className="text-[10px] text-[#495057]">Planning Memo, Scoping, Program, RCM</p>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 9: KNOWLEDGE CONFIDENCE SCORECARD */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <Award className="h-4 w-4 text-[#005A9E]" /> Section 9 — Knowledge Confidence & Completeness Index
          </h2>
          <span className="text-[11px] text-[#198754] font-bold">Overall Knowledge Score: 96.8%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Knowledge Completeness', score: 98, desc: 'Zero data gaps across 11 documents' },
            { label: 'Business Understanding', score: 96, desc: 'End-to-end P2P process mapped' },
            { label: 'Financial Understanding', score: 99, desc: '100% General Ledger reconciliation' },
            { label: 'Risk Taxonomy Fit', score: 95, desc: '23 risks linked to controls' },
            { label: 'Regulatory Alignment', score: 97, desc: 'SOX 404 & Tax circulars verified' },
          ].map((item, idx) => (
            <Card key={idx} className="shadow-2xs border-[#DEE2E6] bg-white">
              <CardContent className="p-3.5 space-y-1.5">
                <span className="text-[10px] text-[#6C757D] font-bold uppercase block">{item.label}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-[#005A9E]">{item.score}%</span>
                  <Badge variant="outline" className="text-[9px] border-[#198754] text-[#198754]">High</Badge>
                </div>
                <Progress value={item.score} className="h-1.5 bg-[#E9ECEF] [&>div]:bg-[#005A9E]" />
                <p className="text-[10px] text-[#6C757D] pt-0.5">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* BOTTOM ACTION BUTTON */}
      <div className="pt-4 flex justify-end">
        <Button 
          onClick={handleProceed} 
          className="bg-[#198754] hover:bg-[#146c43] text-white font-bold shadow-md text-sm h-11 px-8"
        >
          Proceed to Audit Intelligence Center <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

    </div>
  );
}
