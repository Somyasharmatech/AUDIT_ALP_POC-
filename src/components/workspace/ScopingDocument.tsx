import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Target, CheckCircle2, XCircle, Building2, Laptop, MapPin, Download, Filter } from 'lucide-react';
import { AIReasoningSection } from './AIReasoningSection';

export function ScopingDocument() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-4">
        <div>
          <span className="text-xs font-bold text-[#005A9E] uppercase tracking-wider">Audit Scope Definition</span>
          <h2 className="text-2xl font-bold text-[#212529] mt-1">Audit Scoping Document</h2>
          <p className="text-xs text-[#6C757D] mt-0.5">Procure to Pay (P2P) Process • FY 2025-26 Scope Boundaries</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#005A9E] text-[#005A9E] hover:bg-[#E5F0FA]">
            <Download className="h-4 w-4 mr-2" /> Export Word
          </Button>
          <Button className="bg-[#005A9E] hover:bg-[#004578]">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* AI REASONING FOR SCOPING */}
      <AIReasoningSection 
        title="AI Scoping Optimization & Boundary Reasoning"
        whyConclusion="Defined in-scope entities by filtering transactional accounts exceeding performance materiality ($1.125M) and high inherent risk indicators."
        preferredConclusionReason="Excluded payroll procurement from P2P scope because payroll disbursements follow dedicated HR audit procedures and separate bank clearing accounts."
        conflictingEvidence="Plant managers requested inclusion of spare parts inventory management, but inventory counts are already scheduled under the FY26 Manufacturing Audit."
        overallConfidence={95}
        influencingDocs={[
          { docName: "Trial Balance Q4 FY25", percentage: 50 },
          { docName: "Annual Audit Plan FY26", percentage: 30 },
          { docName: "Enterprise Risk Register", percentage: 20 }
        ]}
        assumptions={[
          {
            assumption: "Assumed banking gateway HSBC/Citi APIs are standardized across all regional operating hubs.",
            reason: "Central treasury policy mandates unified payment gateway integration.",
            impactIfIncorrect: "Regional payment testing scripts would require customized procedures.",
            confidence: 92
          }
        ]}
        whatIfAnalysis={{
          thirtyDays: "Scope creep from departmental ad-hoc requests will inflate audit fieldwork hours by 15%.",
          ninetyDays: "Focusing solely on SAP S/4HANA will miss legacy interface vulnerabilities if Ariba logs are excluded.",
          oneEightyDays: "Clear scope boundaries ensure completion within planned 4-week execution window."
        }}
        limitations={{
          undetermined: "Scope applicability to newly acquired overseas subsidiary in Q2 FY25.",
          additionalDocsNeeded: "Subsidiary Integration Roadmap & Local ERP Configuration Specs.",
          confidenceGain: "5%"
        }}
      />

      {/* Scope Matrix In vs Out */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-[#198754]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F0FDF4]">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#198754]">
              <CheckCircle2 className="h-4 w-4" /> In Scope (Included Activities)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-sm text-[#495057]">
            <div className="p-2.5 bg-white border border-[#DEE2E6] rounded-sm">
              <strong className="text-[#212529]">1. Vendor Master Data Management:</strong> Onboarding, KYC approval workflow, and bank account modification logs.
            </div>
            <div className="p-2.5 bg-white border border-[#DEE2E6] rounded-sm">
              <strong className="text-[#212529]">2. Purchase Requisition & PO Approval:</strong> Verification of delegation of authority matrix and automated approval limits above $50k.
            </div>
            <div className="p-2.5 bg-white border border-[#DEE2E6] rounded-sm">
              <strong className="text-[#212529]">3. Goods Receipt & Invoice Matching:</strong> 3-way matching logic (PO vs GRN vs Invoice) and exception processing.
            </div>
            <div className="p-2.5 bg-white border border-[#DEE2E6] rounded-sm">
              <strong className="text-[#212529]">4. Tax Compliance (Section 44AB):</strong> Statutory return filing routines and compliance with government tax notifications.
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#6C757D]">
              <XCircle className="h-4 w-4" /> Out of Scope (Excluded Activities)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-sm text-[#495057]">
            <div className="p-2.5 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm">
              <strong className="text-[#212529]">1. Payroll Procurement:</strong> Employee expense reimbursements and payroll disbursements are audited under HR Audit.
            </div>
            <div className="p-2.5 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm">
              <strong className="text-[#212529]">2. Strategic Sourcing Negotiation:</strong> Vendor contract pricing negotiations evaluated under Commercial Audit.
            </div>
            <div className="p-2.5 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm">
              <strong className="text-[#212529]">3. Fixed Asset Physical Inventory:</strong> Physical verification of heavy machinery conducted in Year-End Inventory Audit.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications, Departments & Locations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Laptop className="h-4 w-4 text-[#005A9E]" /> IT Systems & Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-sm text-[#495057]">
            <div className="flex items-center justify-between">
              <span>SAP S/4HANA ERP</span>
              <Badge variant="outline" className="text-[#005A9E] border-[#005A9E]">Primary</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Vendor Portal (Ariba)</span>
              <Badge variant="outline" className="text-[#005A9E] border-[#005A9E]">Secondary</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Banking Gateway (HSBC/Citi)</span>
              <Badge variant="outline" className="text-[#005A9E] border-[#005A9E]">Payment</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#005A9E]" /> Departments Covered
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-sm text-[#495057]">
            <div className="flex justify-between items-center">
              <span>Procurement & Sourcing</span>
              <Badge className="bg-[#198754]">In Scope</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Accounts Payable & Treasury</span>
              <Badge className="bg-[#198754]">In Scope</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Warehouse & Receiving</span>
              <Badge className="bg-[#198754]">In Scope</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#005A9E]" /> Operating Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-sm text-[#495057]">
            <div className="flex justify-between items-center">
              <span>Corporate HQ (Chicago, IL)</span>
              <Badge variant="outline">Primary Audit</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Shared Services Center (Tampa, FL)</span>
              <Badge variant="outline">Remote Testing</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Distribution Hub (Dallas, TX)</span>
              <Badge variant="outline">Sample Walkthrough</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testing Strategy */}
      <Card className="shadow-sm border-[#DEE2E6]">
        <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#005A9E]" /> Testing Strategy & Sampling Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-sm text-[#495057] space-y-3">
          <p>• <strong>100% Data Analytics Testing:</strong> AI engine will execute full population scripts on 100% of POs ($120M total) to detect duplicate payments, split POs, and non-PO invoices.</p>
          <p>• <strong>Substantive Sample (25 Vendors):</strong> Targeted sampling of newly added vendors in Q1-Q2 with manual override flags for KYC checks.</p>
          <p>• <strong>Walkthrough Testing:</strong> 5 end-to-end process walkthroughs tracing a PO from initiation to payment release and GL posting.</p>
        </CardContent>
      </Card>
    </div>
  );
}
