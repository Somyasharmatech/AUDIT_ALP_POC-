import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { ListChecks, Download, Search, CheckCircle2, AlertCircle, FileText, Filter } from 'lucide-react';
import { AIReasoningSection } from './AIReasoningSection';

interface AuditProcedure {

  id: string;
  category: 'Planning' | 'Vendor Onboarding' | 'PO Approval' | 'Invoice Matching' | 'Tax Compliance';
  objective: string;
  procedure: string;
  evidence: string;
  sampleSize: string;
  expectedResult: string;
  riskCovered: string;
  status: 'Complete' | 'In Progress' | 'Not Started';
}

const PROGRAM_PROCEDURES: AuditProcedure[] = [
  {
    id: 'AP-01',
    category: 'Vendor Onboarding',
    objective: 'Verify Vendor Master segregation of duties and automated KYC controls.',
    procedure: 'Obtain system user access listing for Vendor Master creation. Test whether users with creation rights also have PO approval or payment release authorization.',
    evidence: 'ERP User Permissions Matrix, Vendor Master Audit Logs',
    sampleSize: '100% System Users (Population)',
    expectedResult: 'Zero users hold dual creation and payment rights.',
    riskCovered: 'Fictitious Vendor Fraud',
    status: 'In Progress'
  },
  {
    id: 'AP-02',
    category: 'Vendor Onboarding',
    objective: 'Audit manual override logs during vendor KYC onboarding.',
    procedure: 'Extract all vendor creation records where the automated KYC validation step was bypassed or manually overridden.',
    evidence: 'Vendor Onboarding Log, Approval Emails',
    sampleSize: '25 Override Samples',
    expectedResult: 'All overrides have written VP approval and valid tax documentation.',
    riskCovered: 'Unverified Vendor Creation',
    status: 'In Progress'
  },
  {
    id: 'AP-03',
    category: 'PO Approval',
    objective: 'Test compliance with Delegation of Authority limits for Purchase Orders.',
    procedure: 'Re-perform automated approval limit rules in ERP for POs exceeding $50,000. Verify digital signatures against authorization matrix.',
    evidence: 'PO Approval Logs, DOA Policy Document',
    sampleSize: '40 POs > $50,000',
    expectedResult: '100% compliance with DOA matrix limits.',
    riskCovered: 'Unauthorized Procurement',
    status: 'Not Started'
  },
  {
    id: 'AP-04',
    category: 'Invoice Matching',
    objective: 'Validate automated 3-Way Match logic (PO vs GRN vs Invoice).',
    procedure: 'Run AI duplicate payment detection algorithm across 100% of AP invoice records for the financial year.',
    evidence: 'Accounts Payable Ledger, Invoice Master Data',
    sampleSize: '100% AP Population ($120M)',
    expectedResult: 'No duplicate invoices processed or paid.',
    riskCovered: 'Duplicate Invoice Payment',
    status: 'In Progress'
  },
  {
    id: 'AP-05',
    category: 'Tax Compliance',
    objective: 'Assess compliance with statutory tax filings under Section 44AB.',
    procedure: 'Inspect quarterly tax filing submission dates against statutory deadlines. Review penalty notices received from Tax Authority.',
    evidence: 'Govt Notifications, Tax Acknowledgement Filings',
    sampleSize: '4 Quarterly Filings',
    expectedResult: 'Filings submitted within deadline; zero penalty notices.',
    riskCovered: 'Regulatory Penalties & Fines',
    status: 'Complete'
  },
];

export function AuditProgram() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProcedures = PROGRAM_PROCEDURES.filter(proc => {
    const matchesCategory = selectedCategory === 'All' || proc.category === selectedCategory;
    const matchesSearch = proc.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proc.procedure.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proc.riskCovered.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-4">
        <div>
          <span className="text-xs font-bold text-[#005A9E] uppercase tracking-wider">Fieldwork & Substantive Testing Plan</span>
          <h2 className="text-2xl font-bold text-[#212529] mt-1">AI Audit Program</h2>
          <p className="text-xs text-[#6C757D] mt-0.5">Procure to Pay (P2P) Audit Program • {PROGRAM_PROCEDURES.length} Generated Procedures</p>
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

      {/* AI REASONING FOR AUDIT PROGRAM */}
      <AIReasoningSection 
        title="AI Audit Program Substantive Testing Reasoning"
        whyConclusion="Generated 5 targeted audit procedures mapped directly to identified high-risk nodes in the RCM and historical repeat findings."
        preferredConclusionReason="Specified 100% full population testing for Invoice Matching using automated scripts because digital AP ledger files ($120M) enable complete data coverage."
        conflictingEvidence="Internal Control Self-Assessment claimed 3-way match exceptions are resolved within 48 hours, but sample testing indicates 18% of variances linger unresolved for >30 days."
        overallConfidence={97}
        influencingDocs={[
          { docName: "Enterprise Risk Control Matrix (RCM)", percentage: 45 },
          { docName: "General Ledger AP Sub-Ledger Data", percentage: 35 },
          { docName: "Delegation of Authority Policy", percentage: 20 }
        ]}
        assumptions={[
          {
            assumption: "Assumed ERP transaction log tables contain full audit trail for PO approval overrides.",
            reason: "SAP change log parameters (T-code CDHDR/CDPOS) are active.",
            impactIfIncorrect: "Fieldwork sampling must be expanded to manual physical approval documents.",
            confidence: 96
          }
        ]}
        whatIfAnalysis={{
          thirtyDays: "Identification of unrecorded liabilities if 3-way match exception testing reveals held invoices.",
          ninetyDays: "Management correction of ERP user permissions matrix to eliminate SOD violations.",
          oneEightyDays: "Substantial reduction in annual audit fee due to reliance on automated continuous testing."
        }}
        limitations={{
          undetermined: "Access to encrypted vendor bank modification transmission logs.",
          additionalDocsNeeded: "Bank Gateway Encryption Keys & Direct API Log Access.",
          confidenceGain: "3%"
        }}
      />

      {/* Filter and Search Bar */}

      <Card className="shadow-sm border-[#DEE2E6]">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#6C757D] uppercase">Category:</span>
            {['All', 'Vendor Onboarding', 'PO Approval', 'Invoice Matching', 'Tax Compliance'].map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs ${selectedCategory === cat ? 'bg-[#005A9E]' : 'border-[#DEE2E6] text-[#495057]'}`}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#6C757D]" />
            <input
              type="text"
              placeholder="Search procedures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#DEE2E6] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#005A9E]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Audit Program Table */}
      <Card className="shadow-sm border-[#DEE2E6]">
        <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <span>Detailed Audit Test Procedures</span>
            <Badge variant="outline" className="border-[#005A9E] text-[#005A9E]">AI Generated Strategy</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#F8F9FA] text-[#6C757D] text-[11px] uppercase tracking-wider border-b border-[#DEE2E6]">
              <tr>
                <th className="px-4 py-3 font-semibold w-16">ID</th>
                <th className="px-4 py-3 font-semibold w-1/4">Objective & Procedure</th>
                <th className="px-4 py-3 font-semibold">Required Evidence</th>
                <th className="px-4 py-3 font-semibold">Sample & Method</th>
                <th className="px-4 py-3 font-semibold">Risk Covered</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DEE2E6]">
              {filteredProcedures.map((proc) => (
                <tr key={proc.id} className="hover:bg-[#F8F9FA] transition-colors">
                  <td className="px-4 py-4 font-mono font-bold text-[#005A9E] align-top">{proc.id}</td>
                  <td className="px-4 py-4 space-y-1 align-top">
                    <div className="font-bold text-[#212529]">{proc.objective}</div>
                    <p className="text-xs text-[#495057] leading-relaxed">{proc.procedure}</p>
                    <div className="pt-1">
                      <Badge variant="outline" className="text-[10px] border-[#DEE2E6] text-[#6C757D] bg-white">
                        {proc.category}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-[#495057] align-top font-medium">{proc.evidence}</td>
                  <td className="px-4 py-4 text-xs text-[#495057] align-top font-mono">{proc.sampleSize}</td>
                  <td className="px-4 py-4 align-top">
                    <Badge variant="outline" className="border-[#A80000] text-[#A80000] bg-[#FDF2F2] text-[10px]">
                      {proc.riskCovered}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 align-top">
                    {proc.status === 'Complete' && (
                      <Badge className="bg-[#198754]">Complete</Badge>
                    )}
                    {proc.status === 'In Progress' && (
                      <Badge className="bg-[#005A9E]">In Progress</Badge>
                    )}
                    {proc.status === 'Not Started' && (
                      <Badge variant="outline" className="border-[#6C757D] text-[#6C757D]">Not Started</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
