import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { 
  Sparkles, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, XCircle, 
  ArrowRight, FileText, Building2, GitBranch, History, DollarSign, BarChart3, 
  Target, ListChecks, Download, ExternalLink, Layers, Clock, Users, Cpu, 
  Scale, FileSpreadsheet, Zap, HelpCircle, ChevronRight, FileCheck, Check, 
  AlertCircle, Activity, Award, Calendar, ChevronDown, ChevronUp, Lock
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

interface AuditIntelligenceCenterProps {
  onSelectTab?: (tabId: string) => void;
}

export function AuditIntelligenceCenter({ onSelectTab }: AuditIntelligenceCenterProps) {
  const [expandedRisk, setExpandedRisk] = useState<string | null>('1');

  const handleTabClick = (tabId: string) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    } else {
      toast.info(`Navigating to ${tabId}`);
    }
  };

  const handleExport = (type: string) => {
    toast.success(`Exporting ${type} package...`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#003A6C] via-[#005A9E] to-[#0078D4] text-white p-6 rounded-sm shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-[#FFB900]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#FFB900] text-[#212529] font-bold text-xs uppercase px-2.5 py-0.5">
              Flagship Command Center
            </Badge>
            <span className="text-xs text-blue-100 font-mono">Engagement ID: AUD-2025-P2P-001</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Audit Intelligence Center</h1>
          <p className="text-sm text-blue-100 max-w-3xl leading-relaxed">
            Consolidated AI Executive Command Hub for the Head of Internal Audit. Comprehensive multi-document synthesis, risk exposure analysis, and automated decision engineering.
          </p>
        </div>
        <div className="flex flex-wrap md:flex-col gap-2 shrink-0 justify-end">
          <Button 
            onClick={() => handleExport('Complete Planning')} 
            className="bg-white text-[#005A9E] hover:bg-blue-50 font-bold shadow-sm border border-blue-200 text-xs"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export Planning Package
          </Button>
          <Button 
            onClick={() => toast.success("Planning Package Submitted for Audit Committee Approval!")} 
            className="bg-[#198754] hover:bg-[#146c43] text-white font-bold shadow-sm text-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Submit for Approval
          </Button>
        </div>
      </div>

      {/* SECTION 1: ENGAGEMENT SNAPSHOT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#005A9E]" /> Section 1 — Engagement Snapshot & Health Scorecard
          </h2>
          <span className="text-[11px] text-[#6C757D]">System Generated: July 22, 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardContent className="p-4 space-y-2">
              <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider block">Audit Metadata</span>
              <div className="text-sm font-bold text-[#212529] line-clamp-1">Procure to Pay Automation Audit</div>
              <div className="text-xs text-[#495057]">
                <span className="font-semibold text-[#6C757D]">Dept:</span> Procurement & Treasury
              </div>
              <div className="text-xs text-[#495057]">
                <span className="font-semibold text-[#6C757D]">Type:</span> Financial & Operational ICFR
              </div>
              <div className="text-xs text-[#005A9E] font-medium">Financial Year FY2025-2026</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-[#DEE2E6] bg-[#F8F9FA]/80">
            <CardContent className="p-4 space-y-2">
              <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider block">Planning Readiness</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#198754]">94%</span>
                <Badge className="bg-[#198754] text-[10px]">Fieldwork Ready</Badge>
              </div>
              <Progress value={94} className="h-1.5 bg-[#E9ECEF] [&>div]:bg-[#198754]" />
              <p className="text-[11px] text-[#6C757D]">13/13 required sources parsed with zero critical data gaps.</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-[#DEE2E6] bg-[#F8F9FA]/80">
            <CardContent className="p-4 space-y-2">
              <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider block">Overall AI Confidence</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#005A9E]">96%</span>
                <Badge variant="outline" className="border-[#005A9E] text-[#005A9E] bg-[#E5F0FA] text-[10px]">High Statistical Model Fit</Badge>
              </div>
              <Progress value={96} className="h-1.5 bg-[#E9ECEF] [&>div]:bg-[#005A9E]" />
              <p className="text-[11px] text-[#6C757D]">100% General Ledger & Trial Balance traceability verified.</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardContent className="p-4 space-y-2">
              <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider block">Health & Governance</span>
              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="p-2 bg-[#F8F9FA] border rounded-sm">
                  <span className="text-[10px] text-[#6C757D] uppercase block font-bold">Business Health</span>
                  <span className="text-base font-extrabold text-[#856404]">82/100</span>
                </div>
                <div className="p-2 bg-[#F8F9FA] border rounded-sm">
                  <span className="text-[10px] text-[#6C757D] uppercase block font-bold">Governance</span>
                  <span className="text-base font-extrabold text-[#005A9E]">88/100</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 2: AI EXECUTIVE DECISION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#005A9E]" /> Section 2 — AI Executive Decision Engine
          </h2>
          <Badge className="bg-[#856404] text-white">Action Required</Badge>
        </div>

        <Card className="shadow-md border-[#FFC107] bg-gradient-to-br from-[#FFFDF5] to-white">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DEE2E6] pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#6C757D] uppercase tracking-wider">Automated Audit Recommendation</span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[#856404]">PROCEED WITH CONDITIONS</span>
                  <Badge className="bg-[#FFC107] text-[#212529] font-bold px-3 py-1">Moderate-to-High Operational Risk</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Model Confidence</span>
                  <span className="text-lg font-black text-[#005A9E]">96.4%</span>
                </div>
                <div className="h-10 w-10 bg-[#E5F0FA] rounded-full flex items-center justify-center text-[#005A9E]">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#495057]">
              <div className="p-3.5 bg-white border border-[#DEE2E6] rounded-sm space-y-1.5 shadow-2xs">
                <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block text-[#005A9E]">Reason for Decision</span>
                <p className="leading-relaxed">
                  High planning readiness (94%) paired with 3 un-remediated repeat findings from FY24 and active Segregation of Duties (SoD) violations in SAP S/4HANA Vendor Master creation.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#DEE2E6] rounded-sm space-y-1.5 shadow-2xs">
                <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block text-[#A80000]">Business Exposure</span>
                <p className="leading-relaxed">
                  $120M annual cash flow exposure. Identified $1.5M planning materiality with $3.85M in held invoices due to 3-way match exception backlogs.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#DEE2E6] rounded-sm space-y-1.5 shadow-2xs">
                <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block text-[#198754]">Expected Audit Benefit</span>
                <p className="leading-relaxed">
                  Eliminates fictitious vendor risk, recovers estimated $85,000 in lost early payment discounts, and secures full ICFR regulatory compliance before fiscal year-end close.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: EXECUTIVE QUESTION PANEL */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[#005A9E]" /> Section 3 — Executive Question Panel (Auto-Synthesized Answers)
          </h2>
          <span className="text-[11px] text-[#6C757D]">3 Core Audit Questions Evaluated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Question 1 */}
          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardHeader className="p-4 pb-2 bg-[#F8F9FA]/60 border-b border-[#DEE2E6] flex flex-row items-center justify-between">
              <span className="text-xs font-bold text-[#212529]">Any Penalties or Fines?</span>
              <Badge className="bg-[#A80000] text-white font-bold px-2 py-0.5">YES</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div>
                <span className="font-semibold text-[#6C757D] block">Reason:</span>
                <p className="text-[#212529]">Tax authority notice issued May 15 regarding delayed vendor withholding tax filings.</p>
              </div>
              <div>
                <span className="font-semibold text-[#6C757D] block">Evidence:</span>
                <p className="text-[#005A9E]">Statutory Tax Notice & Penalty Ledger ($42,500 accrued).</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#DEE2E6] text-[11px]">
                <span>Confidence: <strong className="text-[#198754]">98%</strong></span>
                <Badge variant="outline" className="border-[#A80000] text-[#A80000]">HIGH Priority</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Question 2 */}
          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardHeader className="p-4 pb-2 bg-[#F8F9FA]/60 border-b border-[#DEE2E6] flex flex-row items-center justify-between">
              <span className="text-xs font-bold text-[#212529]">Any Fraud Indicators?</span>
              <Badge className="bg-[#A80000] text-white font-bold px-2 py-0.5">YES</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div>
                <span className="font-semibold text-[#6C757D] block">Reason:</span>
                <p className="text-[#212529]">Dual-role privileges in SAP (6 users hold both Vendor Master Create and Invoice Approval permissions).</p>
              </div>
              <div>
                <span className="font-semibold text-[#6C757D] block">Evidence:</span>
                <p className="text-[#005A9E]">SAP User Role Matrix (T-code SU01) & Finding #4 FY24.</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#DEE2E6] text-[11px]">
                <span>Confidence: <strong className="text-[#198754]">94%</strong></span>
                <Badge className="bg-[#A80000]">CRITICAL Priority</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Question 3 */}
          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardHeader className="p-4 pb-2 bg-[#F8F9FA]/60 border-b border-[#DEE2E6] flex flex-row items-center justify-between">
              <span className="text-xs font-bold text-[#212529]">Any High Risk Observations?</span>
              <Badge className="bg-[#A80000] text-white font-bold px-2 py-0.5">YES</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div>
                <span className="font-semibold text-[#6C757D] block">Reason:</span>
                <p className="text-[#212529]">Manual payment overrides in Citibank Gateway & $3.85M in 3-way match exceptions un-cleared &gt;30 days.</p>
              </div>
              <div>
                <span className="font-semibold text-[#6C757D] block">Evidence:</span>
                <p className="text-[#005A9E]">AP Sub-ledger Exception Log & Payment Gateway Logs.</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#DEE2E6] text-[11px]">
                <span>Confidence: <strong className="text-[#198754]">95%</strong></span>
                <Badge variant="outline" className="border-[#A80000] text-[#A80000]">HIGH Priority</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 4: BUSINESS UNDERSTANDING SUMMARY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#005A9E]" /> Section 4 — Business Understanding Architecture
          </h2>
          <Button variant="ghost" size="sm" onClick={() => handleTabClick('business-understanding')} className="text-xs text-[#005A9E] h-7">
            Open Business View <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        <Card className="shadow-sm border-[#DEE2E6] bg-white">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-3 md:border-r border-[#DEE2E6] md:pr-6">
              <div>
                <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block mb-1">Strategic Objective</span>
                <p className="text-[#495057] leading-relaxed">
                  Ensure efficient, compliant procurement supporting $120M annual cash flow while mitigating third-party risks and optimizing working capital.
                </p>
              </div>
              <div>
                <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block mb-1">End-to-End Process</span>
                <p className="text-[#495057] leading-relaxed">
                  Procure to Pay (P2P) spanning requisitioning, vendor selection, PO approval, goods receipt, 3-way matching, and treasury disbursement.
                </p>
              </div>
            </div>

            <div className="space-y-3 md:border-r border-[#DEE2E6] md:pr-6">
              <div>
                <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block mb-1">Critical Core Systems</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge variant="secondary" className="bg-[#F8F9FA] border border-[#DEE2E6] text-[#212529]">SAP S/4HANA ERP</Badge>
                  <Badge variant="secondary" className="bg-[#F8F9FA] border border-[#DEE2E6] text-[#212529]">SAP Ariba Portal</Badge>
                  <Badge variant="secondary" className="bg-[#F8F9FA] border border-[#DEE2E6] text-[#212529]">Citibank Direct API</Badge>
                </div>
              </div>
              <div>
                <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block mb-1">Key Departments</span>
                <p className="text-[#495057]">Procurement, Accounts Payable, Warehouse Logistics, Corporate Treasury, IT Security.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block mb-1">Key Control Owners</span>
                <p className="text-[#495057]">Chief Procurement Officer, VP of Accounts Payable, Corporate Controller, Treasury Director.</p>
              </div>
              <div>
                <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block mb-1">Process Maturity Stage</span>
                <div className="flex items-center justify-between p-2 bg-[#F8F9FA] border rounded-sm mt-1">
                  <span className="font-bold text-[#005A9E]">Level 3 (Defined)</span>
                  <span className="text-[10px] text-[#6C757D]">66% Automated / 34% Manual</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 5: AI GENERATED PROCESS FLOW MINIATURE PREVIEW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-[#005A9E]" /> Section 5 — BPMN Process Architecture Preview
          </h2>
          <Button variant="outline" size="sm" onClick={() => handleTabClick('process-flow')} className="text-xs border-[#005A9E] text-[#005A9E] h-7">
            Open Full Process Flow
          </Button>
        </div>

        <Card className="shadow-sm border-[#DEE2E6] bg-[#F8F9FA]">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              
              <div className="flex-1 p-3 bg-white border border-[#DEE2E6] rounded-sm shadow-2xs w-full">
                <span className="text-[10px] font-bold text-[#6C757D] uppercase block">Input Node</span>
                <div className="font-bold text-xs text-[#212529] mt-0.5">Requisition & Vendor Onboarding</div>
                <div className="text-[10px] text-[#005A9E] mt-1">Ariba Procurement Portal</div>
              </div>

              <ArrowRight className="h-5 w-5 text-[#005A9E] shrink-0 rotate-90 md:rotate-0" />

              <div className="flex-1 p-3 bg-white border border-[#DEE2E6] rounded-sm shadow-2xs w-full">
                <span className="text-[10px] font-bold text-[#6C757D] uppercase block">Process Step</span>
                <div className="font-bold text-xs text-[#212529] mt-0.5">PO Creation & Release Strategy</div>
                <div className="text-[10px] text-[#005A9E] mt-1">SAP T-Code ME21N</div>
              </div>

              <ArrowRight className="h-5 w-5 text-[#005A9E] shrink-0 rotate-90 md:rotate-0" />

              <div className="flex-1 p-3 bg-white border border-[#A80000] rounded-sm shadow-2xs bg-[#FDF2F2] w-full">
                <span className="text-[10px] font-bold text-[#A80000] uppercase block">Decision Gate (High Risk)</span>
                <div className="font-bold text-xs text-[#212529] mt-0.5">3-Way Match Validation</div>
                <div className="text-[10px] text-[#A80000] mt-1">PO vs GRN vs Invoice (MIRO)</div>
              </div>

              <ArrowRight className="h-5 w-5 text-[#005A9E] shrink-0 rotate-90 md:rotate-0" />

              <div className="flex-1 p-3 bg-white border border-[#DEE2E6] rounded-sm shadow-2xs w-full">
                <span className="text-[10px] font-bold text-[#6C757D] uppercase block">Output Node</span>
                <div className="font-bold text-xs text-[#212529] mt-0.5">Treasury Payment Execution</div>
                <div className="text-[10px] text-[#005A9E] mt-1">Citibank Gateway API</div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 6: ENTERPRISE ANALYTICS DASHBOARD */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#005A9E]" /> Section 6 — Enterprise Analytics & Risk Matrix Integration
          </h2>
          <Button variant="ghost" size="sm" onClick={() => handleTabClick('analytics')} className="text-xs text-[#005A9E] h-7">
            Open Full Analytics <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart 1: Historical Findings Trend */}
          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
              <CardTitle className="text-xs font-semibold text-[#212529]">Historical Audit Findings Trend (5 Years)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { year: '2021', total: 18, open: 2 },
                  { year: '2022', total: 12, open: 1 },
                  { year: '2023', total: 15, open: 3 },
                  { year: '2024', total: 9, open: 2 },
                  { year: '2025', total: 14, open: 8 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" name="Total Findings" stroke="#005A9E" strokeWidth={2} />
                  <Line type="monotone" dataKey="open" name="Unremediated" stroke="#A80000" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Chart 2: Material Accounts Breakdown */}
          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
              <CardTitle className="text-xs font-semibold text-[#212529]">Material P2P Spend Allocation ($M)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { category: 'Raw Mat.', amount: 85.4 },
                  { category: 'Services', amount: 18.2 },
                  { category: 'CapEx Assets', amount: 12.5 },
                  { category: 'IT Subscriptions', amount: 3.85 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#005A9E" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Metrics Scorecard */}
          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
              <CardTitle className="text-xs font-semibold text-[#212529]">Enterprise Governance Analytics</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2 bg-[#F8F9FA] rounded border">
                <span className="text-[#6C757D]">Risk Control Matrix Coverage:</span>
                <span className="font-bold text-[#198754]">100% (12 Controls)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#F8F9FA] rounded border">
                <span className="text-[#6C757D]">SoD Conflicted SAP Users:</span>
                <span className="font-bold text-[#A80000]">6 Conflicted Roles</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#F8F9FA] rounded border">
                <span className="text-[#6C757D]">Regulatory Non-Compliance:</span>
                <span className="font-bold text-[#A80000]">$42,500 Tax Penalty</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#F8F9FA] rounded border">
                <span className="text-[#6C757D]">Document Quality Index:</span>
                <span className="font-bold text-[#005A9E]">98% Parsed Accuracy</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 7: TOP BUSINESS RISKS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#005A9E]" /> Section 7 — Top Business Risks & Control Dependencies
          </h2>
          <Button variant="ghost" size="sm" onClick={() => handleTabClick('risk-assessment')} className="text-xs text-[#005A9E] h-7">
            View Risk Register <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        <Card className="shadow-sm border-[#DEE2E6] bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8F9FA] text-[#6C757D] uppercase border-b border-[#DEE2E6] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Risk Title & Description</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Audit Evidence Link</th>
                    <th className="px-4 py-3">Business Impact</th>
                    <th className="px-4 py-3">Linked Control</th>
                    <th className="px-4 py-3">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEE2E6]">
                  <tr>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#212529]">1. Fictitious Vendor Creation via SoD Bypass</div>
                      <div className="text-[11px] text-[#6C757D]">Dual-privilege access in SAP allows creation and approval of fraudulent vendors.</div>
                    </td>
                    <td className="px-4 py-3.5"><Badge className="bg-[#A80000]">CRITICAL</Badge></td>
                    <td className="px-4 py-3.5 text-[#005A9E] font-mono">SAP SU01 & FY24 Finding #4</td>
                    <td className="px-4 py-3.5 text-[#A80000] font-semibold">Unmitigated Disbursement Loss</td>
                    <td className="px-4 py-3.5 text-[#495057]">C-01 (Vendor Creation SoD)</td>
                    <td className="px-4 py-3.5 font-bold text-[#198754]">98%</td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#212529]">2. Duplicate Invoice Submissions during Manual AP</div>
                      <div className="text-[11px] text-[#6C757D]">Inconsistent invoice formatting allows bypassing of SAP duplicate check rules.</div>
                    </td>
                    <td className="px-4 py-3.5"><Badge variant="outline" className="border-[#A80000] text-[#A80000]">HIGH</Badge></td>
                    <td className="px-4 py-3.5 text-[#005A9E] font-mono">SOP Manual AP Guidelines</td>
                    <td className="px-4 py-3.5 text-[#856404] font-semibold">Duplicate Outflow Risk</td>
                    <td className="px-4 py-3.5 text-[#495057]">C-04 (Automated 3-Way Match)</td>
                    <td className="px-4 py-3.5 font-bold text-[#198754]">95%</td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#212529]">3. Unverified Vendor Bank Account Modifications</div>
                      <div className="text-[11px] text-[#6C757D]">Manual offline banking letters processed without secondary call-back confirmation.</div>
                    </td>
                    <td className="px-4 py-3.5"><Badge variant="outline" className="border-[#A80000] text-[#A80000]">HIGH</Badge></td>
                    <td className="px-4 py-3.5 text-[#005A9E] font-mono">Operations Manual pg 47</td>
                    <td className="px-4 py-3.5 text-[#A80000] font-semibold">Payment Redirection Fraud</td>
                    <td className="px-4 py-3.5 text-[#495057]">C-02 (Bank Verification Dual Control)</td>
                    <td className="px-4 py-3.5 font-bold text-[#198754]">96%</td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#212529]">4. Delayed Statutory Withholding Tax Filings</div>
                      <div className="text-[11px] text-[#6C757D]">Non-filing of Q1/Q2 vendor withholding tax led to statutory interest penalties.</div>
                    </td>
                    <td className="px-4 py-3.5"><Badge variant="outline" className="border-[#A80000] text-[#A80000]">HIGH</Badge></td>
                    <td className="px-4 py-3.5 text-[#005A9E] font-mono">Tax Authority Notice May 15</td>
                    <td className="px-4 py-3.5 text-[#A80000] font-semibold">$42,500 Fine + Audit Penalty</td>
                    <td className="px-4 py-3.5 text-[#495057]">C-09 (Tax Compliance Verification)</td>
                    <td className="px-4 py-3.5 font-bold text-[#198754]">98%</td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#212529]">5. 3-Way Match Exceptions Un-cleared &gt;30 Days</div>
                      <div className="text-[11px] text-[#6C757D]">$3.85M in held vendor invoices due to quantity and price variance disputes.</div>
                    </td>
                    <td className="px-4 py-3.5"><Badge variant="outline" className="border-[#FFC107] text-[#856404]">MEDIUM</Badge></td>
                    <td className="px-4 py-3.5 text-[#005A9E] font-mono">AP Sub-Ledger GRNI Log</td>
                    <td className="px-4 py-3.5 text-[#856404] font-semibold">$85,000 Lost Discounts</td>
                    <td className="px-4 py-3.5 text-[#495057]">C-05 (GRNI Reconciliation)</td>
                    <td className="px-4 py-3.5 font-bold text-[#198754]">92%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 8: FINANCIAL SUMMARY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[#005A9E]" /> Section 8 — Financial Analysis & Materiality Benchmarking
          </h2>
          <Button variant="ghost" size="sm" onClick={() => handleTabClick('financial')} className="text-xs text-[#005A9E] h-7">
            Open Financial Analysis <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-bold text-[#6C757D] uppercase block">Overall Materiality</span>
              <div className="text-xl font-extrabold text-[#005A9E]">$1,500,000</div>
              <p className="text-[11px] text-[#6C757D]">5% of Profit Before Tax ($30M)</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-bold text-[#6C757D] uppercase block">Performance Materiality</span>
              <div className="text-xl font-extrabold text-[#005A9E]">$1,125,000</div>
              <p className="text-[11px] text-[#6C757D]">75% of Overall Materiality (ISA 320)</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-bold text-[#6C757D] uppercase block">Large Transactions Scope</span>
              <div className="text-xl font-extrabold text-[#198754]">14 Txns &gt; $500K</div>
              <p className="text-[11px] text-[#6C757D]">100% Substantive Testing Population</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-bold text-[#6C757D] uppercase block">Abnormal Variance</span>
              <div className="text-xl font-extrabold text-[#A80000]">+14.2% Q3 AP OpEx</div>
              <p className="text-[11px] text-[#6C757D]">Exceeds 5% Budget Variance Threshold</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 9: HISTORICAL AUDIT SUMMARY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <History className="h-4 w-4 text-[#005A9E]" /> Section 9 — Multi-Year Historical Audit Intelligence
          </h2>
          <Button variant="ghost" size="sm" onClick={() => handleTabClick('historical')} className="text-xs text-[#005A9E] h-7">
            Open Historical Analysis <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        <Card className="shadow-sm border-[#DEE2E6] bg-white">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block">Repeat Findings Summary</span>
              <div className="p-3 bg-[#FDF2F2] border border-[#DEE2E6] rounded-sm text-[#A80000] font-bold">
                3 Repeat Findings Identified
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[#495057]">
                <li>Vendor Master SoD Violations (3rd consecutive audit)</li>
                <li>Manual Vendor Banking Modifications (2nd consecutive audit)</li>
                <li>Withholding Tax Reporting Timeliness (2nd consecutive audit)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block">Root Cause Pattern</span>
              <p className="text-[#495057] leading-relaxed">
                Primary failure stems from system role permissions migration during SAP S/4HANA go-live. Post-implementation security reviews were deferred, leading to inherited legacy bypass roles.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#212529] uppercase tracking-wider text-[11px] block">Management Commitment</span>
              <div className="p-3 bg-[#F8F9FA] border rounded-sm">
                <span className="font-semibold text-[#212529]">Status: In Progress</span>
                <p className="text-[#6C757D] text-[11px] mt-1">
                  Management agreed to complete SAP user role cleanup by Q3 FY26 and automate Citibank API dual-signature.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 10: DOCUMENT INTELLIGENCE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-[#005A9E]" /> Section 10 — Document Intelligence & Knowledge Coverage
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center text-xs">
          <div className="p-3 bg-white border rounded-sm shadow-2xs">
            <span className="text-[10px] text-[#6C757D] uppercase font-bold block">Uploaded</span>
            <span className="text-lg font-extrabold text-[#005A9E]">13 / 13</span>
          </div>
          <div className="p-3 bg-white border rounded-sm shadow-2xs">
            <span className="text-[10px] text-[#6C757D] uppercase font-bold block">Parsed</span>
            <span className="text-lg font-extrabold text-[#198754]">100%</span>
          </div>
          <div className="p-3 bg-white border rounded-sm shadow-2xs">
            <span className="text-[10px] text-[#6C757D] uppercase font-bold block">Missing</span>
            <span className="text-lg font-extrabold text-[#198754]">0 Docs</span>
          </div>
          <div className="p-3 bg-white border rounded-sm shadow-2xs">
            <span className="text-[10px] text-[#6C757D] uppercase font-bold block">Quality</span>
            <span className="text-lg font-extrabold text-[#005A9E]">High OCR</span>
          </div>
          <div className="p-3 bg-white border rounded-sm shadow-2xs">
            <span className="text-[10px] text-[#6C757D] uppercase font-bold block">Freshness</span>
            <span className="text-lg font-extrabold text-[#005A9E]">Q4 FY25</span>
          </div>
          <div className="p-3 bg-white border rounded-sm shadow-2xs">
            <span className="text-[10px] text-[#6C757D] uppercase font-bold block">Coverage</span>
            <span className="text-lg font-extrabold text-[#198754]">100% P2P</span>
          </div>
        </div>
      </div>

      {/* SECTION 11: GENERATED DELIVERABLES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#005A9E]" /> Section 11 — Generated Audit Deliverables Pipeline
          </h2>
          <span className="text-[11px] text-[#198754] font-bold">12 / 12 Modules Completed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { id: 'executive-summary', title: 'Executive Summary', confidence: '96%', icon: Sparkles },
            { id: 'business-understanding', title: 'Business Understanding', confidence: '95%', icon: Building2 },
            { id: 'sop-review', title: 'Generated SOP Review', confidence: '91%', icon: FileCheck },
            { id: 'process-flow', title: 'BPMN Process Flow', confidence: '96%', icon: GitBranch },
            { id: 'historical', title: 'Historical Analysis', confidence: '94%', icon: History },
            { id: 'financial', title: 'Financial Analysis', confidence: '97%', icon: DollarSign },
            { id: 'risk-assessment', title: 'Risk Register (RCM)', confidence: '98%', icon: ShieldAlert },
            { id: 'analytics', title: 'Enterprise Analytics', confidence: '99%', icon: BarChart3 },
            { id: 'planning-memo', title: 'Planning Memorandum', confidence: '96%', icon: FileText },
            { id: 'scoping-document', title: 'Scoping Document', confidence: '95%', icon: Target },
            { id: 'audit-program', title: 'Audit Program', confidence: '97%', icon: ListChecks },
            { id: 'final-review', title: 'Final Review Package', confidence: '98%', icon: CheckCircle2 },
          ].map((item) => (
            <Card key={item.id} className="shadow-2xs border-[#DEE2E6] hover:border-[#005A9E] transition-colors bg-white">
              <CardContent className="p-3.5 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#212529] flex items-center gap-1.5">
                    <item.icon className="h-3.5 w-3.5 text-[#005A9E]" /> {item.title}
                  </div>
                  <div className="text-[10px] text-[#198754] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Completed ({item.confidence})
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleTabClick(item.id)}
                  className="h-7 text-[10px] border-[#005A9E] text-[#005A9E] hover:bg-[#E5F0FA] shrink-0"
                >
                  Open
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 12: AI TRACEABILITY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <Target className="h-4 w-4 text-[#005A9E]" /> Section 12 — AI Evidence Traceability Matrix
          </h2>
          <span className="text-[11px] text-[#6C757D]">100% Deterministic Evidence Lineage</span>
        </div>

        <Card className="shadow-sm border-[#DEE2E6] bg-white">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="font-bold text-[#6C757D] uppercase tracking-wider text-[10px] block mb-1">Source Documents Used</span>
              <ul className="space-y-1 text-[#212529]">
                <li>• Operations Manual v2.4</li>
                <li>• Trial Balance Q4 FY25</li>
                <li>• SAP User Role Matrix</li>
                <li>• FY24 Audit Report</li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-[#6C757D] uppercase tracking-wider text-[10px] block mb-1">Pages & Circulars</span>
              <ul className="space-y-1 text-[#212529]">
                <li>• Operations Manual (Pg 45-48)</li>
                <li>• Trial Balance (Pg 112)</li>
                <li>• Statutory Notice No. 42/2024</li>
                <li>• Tax Deduction Rules Sec. 194C</li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-[#6C757D] uppercase tracking-wider text-[10px] block mb-1">GL Accounts & Notes</span>
              <ul className="space-y-1 text-[#212529]">
                <li>• GL #2100 (Accounts Payable)</li>
                <li>• GL #5400 (IT Subscriptions)</li>
                <li>• Balance Sheet Note 14</li>
                <li>• Accrued GRNI Sub-Ledger</li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-[#6C757D] uppercase tracking-wider text-[10px] block mb-1">Policy & Governance</span>
              <ul className="space-y-1 text-[#212529]">
                <li>• Procurement Policy Sec 4.2</li>
                <li>• Dual Control Rule Sec 8.1</li>
                <li>• Internal Audit Charter v3</li>
                <li>• ISA 320 Materiality Standard</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 13: MANAGEMENT ACTION PLAN */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#005A9E]" /> Section 13 — Management Corrective Action Roadmap
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardHeader className="p-3 bg-[#FDF2F2] border-b border-[#DEE2E6]">
              <CardTitle className="text-xs font-bold text-[#A80000] uppercase">Immediate (0-30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <p className="font-semibold text-[#212529]">1. Revoke Dual SAP Privileges</p>
              <p className="text-[#6C757D]">Remove duplicate Vendor Create & Invoice Approve privileges for 6 users.</p>
              <div className="pt-2 border-t border-[#DEE2E6] flex justify-between text-[11px]">
                <span>Owner: IT Security</span>
                <Badge className="bg-[#A80000]">CRITICAL</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardHeader className="p-3 bg-[#FFFDF5] border-b border-[#DEE2E6]">
              <CardTitle className="text-xs font-bold text-[#856404] uppercase">Short Term (30-90 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <p className="font-semibold text-[#212529]">2. Automate 3-Way Match Tolerances</p>
              <p className="text-[#6C757D]">Configure automated SAP price/quantity variance tolerance gates.</p>
              <div className="pt-2 border-t border-[#DEE2E6] flex justify-between text-[11px]">
                <span>Owner: VP AP</span>
                <Badge variant="outline" className="border-[#A80000] text-[#A80000]">HIGH</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-[#DEE2E6] bg-white">
            <CardHeader className="p-3 bg-[#F8F9FA] border-b border-[#DEE2E6]">
              <CardTitle className="text-xs font-bold text-[#005A9E] uppercase">Long Term (90-180 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <p className="font-semibold text-[#212529]">3. Full Ariba Vendor Portal Onboarding</p>
              <p className="text-[#6C757D]">Eliminate manual bank modification letters by forcing digital portal verification.</p>
              <div className="pt-2 border-t border-[#DEE2E6] flex justify-between text-[11px]">
                <span>Owner: CPO</span>
                <Badge variant="outline" className="border-[#005A9E] text-[#005A9E]">MEDIUM</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 14: BOARD SUMMARY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <Award className="h-4 w-4 text-[#005A9E]" /> Section 14 — Audit Committee & Board Summary
          </h2>
        </div>

        <Card className="shadow-sm border-[#005A9E] bg-[#E5F0FA]/30">
          <CardContent className="p-6">
            <p className="text-sm text-[#212529] font-medium leading-relaxed">
              &quot;Based on all uploaded knowledge sources and enterprise analysis, the engagement demonstrates High Planning Readiness (94%) with Moderate-to-High operational risk. AI recommends proceeding with the audit under monitored conditions, prioritizing Treasury Operations, Vendor Management, and Regulatory Compliance due to 3 recurring historical findings and $120M in annual cash flow exposure. Corrective focus should center on SAP Segregation of Duties remediation and automated 3-way match exception clearing.&quot;
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 15: QUICK ACTIONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-2">
          <h2 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#005A9E]" /> Section 15 — Quick Execution Actions & Export Controls
          </h2>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <Button size="sm" onClick={() => handleTabClick('executive-summary')} className="bg-[#005A9E] text-white hover:bg-[#004578] text-xs">
            Review Executive Summary
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleTabClick('sop-review')} className="text-xs border-[#DEE2E6]">
            Review SOP
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleTabClick('process-flow')} className="text-xs border-[#DEE2E6]">
            Review Process Flow
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleTabClick('risk-assessment')} className="text-xs border-[#DEE2E6]">
            Review Risk Register
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleTabClick('planning-memo')} className="text-xs border-[#DEE2E6]">
            Review Planning Memo
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleTabClick('scoping-document')} className="text-xs border-[#DEE2E6]">
            Review Scoping Doc
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleTabClick('audit-program')} className="text-xs border-[#DEE2E6]">
            Review Audit Program
          </Button>
          <Button size="sm" onClick={() => handleExport('PDF')} className="bg-[#A80000] text-white hover:bg-[#850000] text-xs">
            <Download className="h-3.5 w-3.5 mr-1" /> Export PDF
          </Button>
          <Button size="sm" onClick={() => handleExport('Word')} className="bg-[#005A9E] text-white hover:bg-[#004578] text-xs">
            <Download className="h-3.5 w-3.5 mr-1" /> Export Word
          </Button>
        </div>
      </div>

    </div>
  );
}
