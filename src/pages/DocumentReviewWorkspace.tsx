import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/src/components/ui/dialog';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Save, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  DollarSign, 
  History, 
  BookOpen, 
  Layers, 
  Building2, 
  Clock, 
  FolderOpen, 
  ChevronRight, 
  Info, 
  FileSpreadsheet, 
  ShieldAlert, 
  RotateCcw,
  Sparkles,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { ApiClient } from '@/src/lib/api';

// --- TYPES ---
type ReviewStatus = 'Pending' | 'Accepted' | 'Rejected';

interface ReviewSectionState {
  status: ReviewStatus;
  rejectionReason?: string;
  notes?: string;
  isEditing?: boolean;
}

interface ExtractedDataState {
  metadata: {
    fileName: string;
    sourceSystem: string;
    version: string;
    ingestionTimestamp: string;
    author: string;
    classification: string;
  };
  businessSummary: string;
  keyRisks: { id: string; risk: string; domain: string; severity: string }[];
  keyControls: { id: string; control: string; type: string; owner: string }[];
  financialInfo: { account: string; ledgerCode: string; balance: string; materialityFlag: string }[];
  historicalFindings: { year: string; title: string; rating: string; status: string }[];
  repeatObservations: { id: string; title: string; occurrences: string; rootCause: string }[];
  penalties: { notice: string; amount: string; authority: string; status: string }[];
  frauds: { incident: string; department: string; status: string; outcome: string }[];
  managementResponses: { findingId: string; response: string; targetDate: string; owner: string }[];
}

export default function DocumentReviewWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch Audit details
  const { data: audit, isLoading, error } = useQuery({
    queryKey: ['audit', id],
    queryFn: () => ApiClient.get(`/audits/${id}`),
    enabled: !!id,
  });

  // Extracted Data Content State (Editable by auditor)
  const [extractedData, setExtractedData] = useState<ExtractedDataState>({
    metadata: {
      fileName: 'Corporate_Treasury_Financial_Pack_FY26.pdf',
      sourceSystem: 'SAP S/4HANA & Enterprise Document Repository',
      version: 'v3.2 Final Verified',
      ingestionTimestamp: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) + ', 09:45 AM',
      author: 'Group Internal Audit & Risk Compliance',
      classification: 'Confidential - Internal Use Only'
    },
    businessSummary: `The Finance & Treasury division handles capital management, vendor payment authorizations, foreign exchange risk hedging, and cash flow forecasting across 12 operating subsidiaries. Total annual transaction volume exceeds $140M across 18,500 disbursement vouchers. Core operations rely on SAP S/4HANA Finance with Host-to-Host bank interfaces. Primary process owners include the Corporate Treasurer, Accounts Payable Manager, and Tax Compliance Officer.`,
    keyRisks: [
      { id: 'kr-1', risk: 'Dual-authorization bypass during manual vendor bank account modifications in ERP.', domain: 'Accounts Payable', severity: 'High' },
      { id: 'kr-2', risk: 'Delayed reconciliation of aged suspense ledger balances exceeding statutory 180-day threshold.', domain: 'Treasury Sub-ledger', severity: 'High' },
      { id: 'kr-3', risk: 'Inconsistent GST/Withholding tax calculations on cross-border IT software licensing fees.', domain: 'Tax Compliance', severity: 'Medium' }
    ],
    keyControls: [
      { id: 'kc-1', control: 'Automated 3-Way Matching in SAP for all Purchase Orders above $10,000.', type: 'Preventative', owner: 'AP Manager' },
      { id: 'kc-2', control: 'Dual-signoff requirement for all bank account master changes.', type: 'Preventative', owner: 'Corporate Treasurer' },
      { id: 'kc-3', control: 'Monthly Host-to-Host Automated Bank Statement Reconciliation.', type: 'Detective', owner: 'Senior Cashier' }
    ],
    financialInfo: [
      { account: 'Vendor Accounts Payable Sub-ledger', ledgerCode: '2100-AP-01', balance: '$24,850,000', materialityFlag: 'High Materiality' },
      { account: 'Cash & Bank Clearing Suspense Account', ledgerCode: '1010-CS-04', balance: '$1,420,000', materialityFlag: 'Exceeds Threshold ($250k)' },
      { account: 'Foreign Exchange Reserve Account', ledgerCode: '3200-FX-02', balance: '$8,900,000', materialityFlag: 'High Materiality' }
    ],
    historicalFindings: [
      { year: 'FY 2025-26', title: 'Segregation of duties deficiency in vendor creation vs payment signoff.', rating: 'Medium', status: 'Remediated' },
      { year: 'FY 2024-25', title: 'Uncleared suspense account balances pending >180 days.', rating: 'High', status: 'Closed' },
      { year: 'FY 2023-24', title: 'Statutory GST withholding filing delays resulting in late fee.', rating: 'Medium', status: 'Closed' }
    ],
    repeatObservations: [
      { id: 'ro-1', title: 'Lack of quarterly user access reviews for privileged treasury sub-system accounts.', occurrences: '2 Consecutive Years (FY24 & FY25)', rootCause: 'Access reviews owned informally without IAM automated workflow.' }
    ],
    penalties: [
      { notice: 'Statutory Tax Deduction Late Filing Notice', amount: '$12,500', authority: 'Regional Revenue Authority', status: 'Settled & Remediated' }
    ],
    frauds: [
      { incident: 'Whistleblower Hotline Check & Incident Register', department: 'Finance & Treasury', status: 'Zero Active Fraud Reported', outcome: 'Cleared by Ethics Committee' }
    ],
    managementResponses: [
      { findingId: 'FY 2025-26 AP Finding', response: 'Agreed. SAP GRC dual-authorization rule deployed in Q3 with mandatory CISO approval.', targetDate: 'Oct 31, 2025', owner: 'VP Finance' }
    ]
  });

  // Review Statuses for each of the 10 sections
  const [sectionStatuses, setSectionStatuses] = useState<Record<string, ReviewSectionState>>({
    metadata: { status: 'Accepted' },
    businessSummary: { status: 'Accepted' },
    keyRisks: { status: 'Accepted' },
    keyControls: { status: 'Accepted' },
    financialInfo: { status: 'Accepted' },
    historicalFindings: { status: 'Accepted' },
    repeatObservations: { status: 'Accepted' },
    penalties: { status: 'Accepted' },
    frauds: { status: 'Accepted' },
    managementResponses: { status: 'Accepted' }
  });

  // Modal State for Rejecting / Editing
  const [activeModal, setActiveModal] = useState<{ type: 'reject' | 'edit'; sectionKey: string } | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState<string>('');
  const [editDataInput, setEditDataInput] = useState<string>('');

  // Count approved sections
  const approvedCount = Object.values(sectionStatuses).filter((s: ReviewSectionState) => s.status === 'Accepted').length;
  const totalSections = 10;

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: (data: any) => ApiClient.put(`/audits/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit', id] });
      toast.success("Document review state saved successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save review state");
    }
  });

  const handleSetStatus = (sectionKey: string, status: ReviewStatus, reason?: string) => {
    setSectionStatuses(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        status,
        rejectionReason: reason || prev[sectionKey]?.rejectionReason
      }
    }));
    if (status === 'Accepted') {
      toast.success(`Section "${getSectionTitle(sectionKey)}" approved`);
    } else if (status === 'Rejected') {
      toast.error(`Section "${getSectionTitle(sectionKey)}" flagged/rejected`);
    }
  };

  const handleBulkAcceptAll = () => {
    const updated: Record<string, ReviewSectionState> = {};
    Object.keys(sectionStatuses).forEach(k => {
      updated[k] = { ...sectionStatuses[k], status: 'Accepted' };
    });
    setSectionStatuses(updated);
    toast.success("All 10 extracted document sections approved!");
  };

  const handleSaveAndProceed = () => {
    saveMutation.mutate({
      status: 'Document Review Completed',
      workspaceData: JSON.stringify({
        reviewCompletedAt: new Date().toISOString(),
        sectionStatuses,
        extractedData
      })
    });
    toast.success("Document verification approved! Launching AI Planning Orchestrator...");
    navigate(`/audit/${id}/processing`);
  };

  const handleOpenEdit = (sectionKey: string) => {
    if (sectionKey === 'businessSummary') {
      setEditDataInput(extractedData.businessSummary);
    } else if (sectionKey === 'metadata') {
      setEditDataInput(JSON.stringify(extractedData.metadata, null, 2));
    } else {
      setEditDataInput(JSON.stringify((extractedData as any)[sectionKey], null, 2));
    }
    setActiveModal({ type: 'edit', sectionKey });
  };

  const handleSaveEdit = () => {
    if (!activeModal) return;
    const { sectionKey } = activeModal;

    if (sectionKey === 'businessSummary') {
      setExtractedData(prev => ({ ...prev, businessSummary: editDataInput }));
    } else {
      try {
        const parsed = JSON.parse(editDataInput);
        setExtractedData(prev => ({ ...prev, [sectionKey]: parsed }));
      } catch (e) {
        toast.error("Invalid format. Please enter valid text or JSON.");
        return;
      }
    }
    toast.success(`Updated extracted data for ${getSectionTitle(sectionKey)}`);
    setActiveModal(null);
  };

  const getSectionTitle = (key: string) => {
    const titles: Record<string, string> = {
      metadata: '1. Metadata',
      businessSummary: '2. Business Summary',
      keyRisks: '3. Key Risks',
      keyControls: '4. Key Controls',
      financialInfo: '5. Material Financial Information',
      historicalFindings: '6. Historical Findings',
      repeatObservations: '7. Repeat Observations',
      penalties: '8. Penalties',
      frauds: '9. Frauds',
      managementResponses: '10. Management Responses'
    };
    return titles[key] || key;
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="p-12 min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] text-[#605E5C]">
          <Loader2 className="h-8 w-8 animate-spin text-[#0078D4] mb-3" />
          <p className="text-sm font-semibold text-[#201F1E]">Loading AI Document Review Workspace...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !audit) {
    return (
      <PageLayout>
        <div className="p-12 min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] text-[#323130]">
          <AlertTriangle className="h-10 w-10 text-[#A80000] mb-3" />
          <h2 className="text-lg font-bold text-[#201F1E]">Audit Record Not Found</h2>
          <Button onClick={() => navigate('/dashboard')} className="mt-4 bg-[#0078D4] text-white text-xs font-semibold px-4 h-9">
            Return to Dashboard
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F9FA] text-[#323130] flex flex-col justify-between">
        
        <div className="p-6 max-w-[1500px] mx-auto w-full space-y-6 pb-28">
          
          {/* HEADER BAR - Fluent Enterprise Style */}
          <div className="bg-white p-6 rounded-md border border-[#EDEBE9] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EDEBE9]">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => navigate('/audit/new')}
                  className="h-9 w-9 border-[#E1DFDD] hover:bg-[#F3F2F1] text-[#605E5C] rounded-sm shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight text-[#201F1E]">
                      AI Document Review Workspace
                    </h1>
                    <Badge className="bg-[#107C41] text-white px-2.5 py-0.5 text-[11px] font-semibold rounded-sm">
                      Pre-Planning Verification
                    </Badge>
                  </div>
                  <p className="text-xs text-[#605E5C] mt-1">
                    Review and validate extracted metadata, risks, controls, financial data, and historical findings before generating AI audit planning.
                  </p>
                </div>
              </div>

              {/* Extraction Score & Review Progress Bar */}
              <div className="flex items-center gap-4 bg-[#FAF9F8] p-3 rounded-md border border-[#EDEBE9] shrink-0">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-[#605E5C] tracking-wider">Extraction Score</p>
                  <p className="text-sm font-bold text-[#107C41]">96% Accuracy • 8/8 Files</p>
                  <p className="text-[11px] font-medium text-[#0078D4] mt-0.5">{approvedCount} of {totalSections} Sections Approved</p>
                </div>
                <Button
                  onClick={handleBulkAcceptAll}
                  size="sm"
                  className="bg-[#0078D4] hover:bg-[#005A9E] text-white text-xs font-semibold px-3 h-8 gap-1.5 rounded-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve All Sections
                </Button>
              </div>
            </div>

            {/* Audit Context Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#605E5C] block text-[11px] font-semibold">Department</span>
                <span className="font-bold text-[#201F1E]">{audit.department}</span>
              </div>
              <div>
                <span className="text-[#605E5C] block text-[11px] font-semibold">Audit Type</span>
                <span className="font-bold text-[#201F1E]">{audit.auditType || 'Operational Audit'}</span>
              </div>
              <div>
                <span className="text-[#605E5C] block text-[11px] font-semibold">Financial Year</span>
                <span className="font-bold text-[#201F1E]">{audit.financialYear}</span>
              </div>
              <div>
                <span className="text-[#605E5C] block text-[11px] font-semibold">Target Next Stage</span>
                <span className="font-bold text-[#0078D4]">Audit Planning Workspace</span>
              </div>
            </div>
          </div>

          {/* UPLOADED DOCUMENTS SUMMARY BANNER */}
          <Card className="border-[#EDEBE9] bg-white shadow-xs">
            <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-6">
              <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-[#0078D4]" /> Ingested Document Artifacts (8 Sources Extracted)
                </span>
                <Badge variant="outline" className="text-[10px] bg-[#DFF6DD] text-[#107C41] border-[#107C41]/30 font-semibold">
                  100% Parsed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { name: 'Previous Audit Report', file: 'Previous_Audit_Report_FY25.pdf', status: 'Extracted' },
                  { name: 'Current Year Docs', file: 'Annual_Operating_Plan_FY27.pdf', status: 'Extracted' },
                  { name: 'Balance Sheet', file: 'Trial_Balance_Q4_2026.xlsx', status: 'Extracted' },
                  { name: 'SOP Document', file: 'Treasury_SOP_v3.2.docx', status: 'Extracted' },
                  { name: 'Risk Register', file: 'Enterprise_Risk_Register.xlsx', status: 'Extracted' },
                  { name: 'Fraud Register', file: 'Fraud_Incident_Log.pdf', status: 'Extracted' },
                  { name: 'Regulatory Review', file: 'Regulatory_Inspection.pdf', status: 'Extracted' },
                  { name: 'Risk Control Matrix', file: 'RCM_Finance_FY26.xlsx', status: 'Extracted' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded-sm flex items-center justify-between">
                    <div className="truncate pr-2">
                      <p className="text-[11px] font-bold text-[#201F1E] truncate">{doc.name}</p>
                      <p className="text-[10px] text-[#605E5C] truncate">{doc.file}</p>
                    </div>
                    <span className="text-[10px] text-[#107C41] font-bold shrink-0">✓ {doc.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* MAIN REVIEW SECTIONS (ALL 10 MANDATORY SECTIONS) */}
          <div className="space-y-6">

            {/* SECTION 1: METADATA */}
            <SectionCard
              title="1. Document Metadata"
              icon={<Info className="h-4 w-4 text-[#0078D4]" />}
              statusState={sectionStatuses.metadata}
              onAccept={() => handleSetStatus('metadata', 'Accepted')}
              onReject={() => setActiveModal({ type: 'reject', sectionKey: 'metadata' })}
              onEdit={() => handleOpenEdit('metadata')}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#605E5C] font-semibold block">Primary Artifact</span>
                  <p className="font-bold text-[#201F1E]">{extractedData.metadata.fileName}</p>
                </div>
                <div>
                  <span className="text-[#605E5C] font-semibold block">Source System</span>
                  <p className="font-bold text-[#201F1E]">{extractedData.metadata.sourceSystem}</p>
                </div>
                <div>
                  <span className="text-[#605E5C] font-semibold block">Document Version</span>
                  <p className="font-bold text-[#201F1E]">{extractedData.metadata.version}</p>
                </div>
                <div>
                  <span className="text-[#605E5C] font-semibold block">Ingestion Timestamp</span>
                  <p className="text-[#323130]">{extractedData.metadata.ingestionTimestamp}</p>
                </div>
                <div>
                  <span className="text-[#605E5C] font-semibold block">Authoring Unit</span>
                  <p className="text-[#323130]">{extractedData.metadata.author}</p>
                </div>
                <div>
                  <span className="text-[#605E5C] font-semibold block">Security Level</span>
                  <p className="text-[#A80000] font-bold">{extractedData.metadata.classification}</p>
                </div>
              </div>
            </SectionCard>

            {/* SECTION 2: BUSINESS SUMMARY */}
            <SectionCard
              title="2. Business Summary"
              icon={<BookOpen className="h-4 w-4 text-[#0078D4]" />}
              statusState={sectionStatuses.businessSummary}
              onAccept={() => handleSetStatus('businessSummary', 'Accepted')}
              onReject={() => setActiveModal({ type: 'reject', sectionKey: 'businessSummary' })}
              onEdit={() => handleOpenEdit('businessSummary')}
            >
              <div className="p-4 bg-[#FAF9F8] rounded border border-[#EDEBE9] text-xs text-[#201F1E] leading-relaxed">
                {extractedData.businessSummary}
              </div>
            </SectionCard>

            {/* SECTION 3: KEY RISKS */}
            <SectionCard
              title="3. Key Risks Identified"
              icon={<AlertTriangle className="h-4 w-4 text-[#0078D4]" />}
              statusState={sectionStatuses.keyRisks}
              onAccept={() => handleSetStatus('keyRisks', 'Accepted')}
              onReject={() => setActiveModal({ type: 'reject', sectionKey: 'keyRisks' })}
              onEdit={() => handleOpenEdit('keyRisks')}
            >
              <div className="overflow-x-auto border border-[#EDEBE9] rounded">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] border-b border-[#EDEBE9]">
                    <tr>
                      <th className="p-2.5">Risk Description</th>
                      <th className="p-2.5">Domain / Sub-process</th>
                      <th className="p-2.5">Extracted Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEBE9]">
                    {extractedData.keyRisks.map(item => (
                      <tr key={item.id} className="hover:bg-[#FAF9F8]">
                        <td className="p-2.5 font-medium text-[#201F1E]">{item.risk}</td>
                        <td className="p-2.5 text-[#605E5C]">{item.domain}</td>
                        <td className="p-2.5">
                          <Badge className={`text-[10px] font-semibold ${
                            item.severity === 'High' ? 'bg-[#FDE7E9] text-[#A80000]' : 'bg-[#FFF4CE] text-[#797673]'
                          }`}>
                            {item.severity}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* SECTION 4: KEY CONTROLS */}
            <SectionCard
              title="4. Key Controls Mapped"
              icon={<ShieldCheck className="h-4 w-4 text-[#0078D4]" />}
              statusState={sectionStatuses.keyControls}
              onAccept={() => handleSetStatus('keyControls', 'Accepted')}
              onReject={() => setActiveModal({ type: 'reject', sectionKey: 'keyControls' })}
              onEdit={() => handleOpenEdit('keyControls')}
            >
              <div className="overflow-x-auto border border-[#EDEBE9] rounded">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] border-b border-[#EDEBE9]">
                    <tr>
                      <th className="p-2.5">Control Activity</th>
                      <th className="p-2.5">Control Type</th>
                      <th className="p-2.5">Assigned Owner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEBE9]">
                    {extractedData.keyControls.map(item => (
                      <tr key={item.id} className="hover:bg-[#FAF9F8]">
                        <td className="p-2.5 font-medium text-[#201F1E]">{item.control}</td>
                        <td className="p-2.5 text-[#605E5C]">{item.type}</td>
                        <td className="p-2.5 text-[#0078D4] font-semibold">{item.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* SECTION 5: MATERIAL FINANCIAL INFORMATION */}
            <SectionCard
              title="5. Material Financial Information"
              icon={<DollarSign className="h-4 w-4 text-[#0078D4]" />}
              statusState={sectionStatuses.financialInfo}
              onAccept={() => handleSetStatus('financialInfo', 'Accepted')}
              onReject={() => setActiveModal({ type: 'reject', sectionKey: 'financialInfo' })}
              onEdit={() => handleOpenEdit('financialInfo')}
            >
              <div className="overflow-x-auto border border-[#EDEBE9] rounded">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] border-b border-[#EDEBE9]">
                    <tr>
                      <th className="p-2.5">General Ledger Account</th>
                      <th className="p-2.5">Ledger Code</th>
                      <th className="p-2.5">Balance Amount</th>
                      <th className="p-2.5">Materiality Benchmark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEBE9]">
                    {extractedData.financialInfo.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F8]">
                        <td className="p-2.5 font-medium text-[#201F1E]">{item.account}</td>
                        <td className="p-2.5 text-[#605E5C] font-mono">{item.ledgerCode}</td>
                        <td className="p-2.5 font-bold text-[#201F1E]">{item.balance}</td>
                        <td className="p-2.5">
                          <Badge variant="outline" className="bg-[#E5F0FA] text-[#0078D4] border-[#0078D4]/30 font-semibold text-[10px]">
                            {item.materialityFlag}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* SECTION 6: HISTORICAL FINDINGS */}
            <SectionCard
              title="6. Historical Audit Findings"
              icon={<History className="h-4 w-4 text-[#0078D4]" />}
              statusState={sectionStatuses.historicalFindings}
              onAccept={() => handleSetStatus('historicalFindings', 'Accepted')}
              onReject={() => setActiveModal({ type: 'reject', sectionKey: 'historicalFindings' })}
              onEdit={() => handleOpenEdit('historicalFindings')}
            >
              <div className="overflow-x-auto border border-[#EDEBE9] rounded">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] border-b border-[#EDEBE9]">
                    <tr>
                      <th className="p-2.5">Financial Year</th>
                      <th className="p-2.5">Finding Summary</th>
                      <th className="p-2.5">Rating</th>
                      <th className="p-2.5">Remediation Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEBE9]">
                    {extractedData.historicalFindings.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F8]">
                        <td className="p-2.5 font-bold text-[#201F1E]">{item.year}</td>
                        <td className="p-2.5 text-[#323130]">{item.title}</td>
                        <td className="p-2.5">
                          <Badge className="bg-[#FFF4CE] text-[#797673] text-[10px] font-semibold">{item.rating}</Badge>
                        </td>
                        <td className="p-2.5">
                          <Badge variant="outline" className="bg-[#DFF6DD] text-[#107C41] border-[#107C41]/30 text-[10px] font-semibold">
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* SECTION 7: REPEAT OBSERVATIONS */}
            <SectionCard
              title="7. Repeat Observations"
              icon={<RotateCcw className="h-4 w-4 text-[#0078D4]" />}
              statusState={sectionStatuses.repeatObservations}
              onAccept={() => handleSetStatus('repeatObservations', 'Accepted')}
              onReject={() => setActiveModal({ type: 'reject', sectionKey: 'repeatObservations' })}
              onEdit={() => handleOpenEdit('repeatObservations')}
            >
              <div className="space-y-2">
                {extractedData.repeatObservations.map(item => (
                  <div key={item.id} className="p-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#201F1E]">{item.title}</p>
                      <Badge className="bg-[#FDE7E9] text-[#A80000] text-[10px] font-bold">
                        {item.occurrences}
                      </Badge>
                    </div>
                    <p className="text-[#605E5C]"><span className="font-semibold text-[#323130]">Root Cause:</span> {item.rootCause}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* SECTION 8: PENALTIES */}
            <SectionCard
              title="8. Statutory Penalties & Regulatory Notices"
              icon={<ShieldAlert className="h-4 w-4 text-[#0078D4]" />}
              statusState={sectionStatuses.penalties}
              onAccept={() => handleSetStatus('penalties', 'Accepted')}
              onReject={() => setActiveModal({ type: 'reject', sectionKey: 'penalties' })}
              onEdit={() => handleOpenEdit('penalties')}
            >
              <div className="overflow-x-auto border border-[#EDEBE9] rounded">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] border-b border-[#EDEBE9]">
                    <tr>
                      <th className="p-2.5">Notice Description</th>
                      <th className="p-2.5">Penalty Amount</th>
                      <th className="p-2.5">Regulatory Authority</th>
                      <th className="p-2.5">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEBE9]">
                    {extractedData.penalties.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F8]">
                        <td className="p-2.5 font-medium text-[#201F1E]">{item.notice}</td>
                        <td className="p-2.5 font-bold text-[#A80000]">{item.amount}</td>
                        <td className="p-2.5 text-[#605E5C]">{item.authority}</td>
                        <td className="p-2.5">
                          <Badge variant="outline" className="bg-[#DFF6DD] text-[#107C41] border-[#107C41]/30 text-[10px] font-semibold">
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* SECTION 9: FRAUDS */}
            <SectionCard
              title="9. Fraud Incident & Hotline Review"
              icon={<ShieldCheck className="h-4 w-4 text-[#0078D4]" />}
              statusState={sectionStatuses.frauds}
              onAccept={() => handleSetStatus('frauds', 'Accepted')}
              onReject={() => setActiveModal({ type: 'reject', sectionKey: 'frauds' })}
              onEdit={() => handleOpenEdit('frauds')}
            >
              <div className="overflow-x-auto border border-[#EDEBE9] rounded">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] border-b border-[#EDEBE9]">
                    <tr>
                      <th className="p-2.5">Whistleblower Log Check</th>
                      <th className="p-2.5">Department</th>
                      <th className="p-2.5">Finding Status</th>
                      <th className="p-2.5">Governance Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEBE9]">
                    {extractedData.frauds.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F8]">
                        <td className="p-2.5 font-medium text-[#201F1E]">{item.incident}</td>
                        <td className="p-2.5 text-[#605E5C]">{item.department}</td>
                        <td className="p-2.5 font-bold text-[#107C41]">{item.status}</td>
                        <td className="p-2.5 text-[#323130]">{item.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* SECTION 10: MANAGEMENT RESPONSES */}
            <SectionCard
              title="10. Management Action Plans & Responses"
              icon={<Layers className="h-4 w-4 text-[#0078D4]" />}
              statusState={sectionStatuses.managementResponses}
              onAccept={() => handleSetStatus('managementResponses', 'Accepted')}
              onReject={() => setActiveModal({ type: 'reject', sectionKey: 'managementResponses' })}
              onEdit={() => handleOpenEdit('managementResponses')}
            >
              <div className="overflow-x-auto border border-[#EDEBE9] rounded">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] border-b border-[#EDEBE9]">
                    <tr>
                      <th className="p-2.5">Finding Reference</th>
                      <th className="p-2.5">Agreed Action Plan</th>
                      <th className="p-2.5">Target Completion</th>
                      <th className="p-2.5">Responsible Steward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEBE9]">
                    {extractedData.managementResponses.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F8]">
                        <td className="p-2.5 font-bold text-[#201F1E]">{item.findingId}</td>
                        <td className="p-2.5 text-[#323130]">{item.response}</td>
                        <td className="p-2.5 text-[#0078D4] font-semibold">{item.targetDate}</td>
                        <td className="p-2.5 text-[#605E5C]">{item.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

          </div>

        </div>

        {/* BOTTOM FIXED ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDEBE9] p-4 shadow-lg z-20">
          <div className="max-w-[1500px] mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/audit/new')}
              className="border-[#C8C6C4] hover:bg-[#F3F2F1] text-[#201F1E] text-xs font-semibold px-4 h-9 rounded-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Creation
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#605E5C] font-medium hidden sm:inline">
                {approvedCount}/{totalSections} Sections Verified
              </span>

              <Button
                variant="outline"
                onClick={() => saveMutation.mutate({
                  status: 'Document Review In-Progress',
                  workspaceData: JSON.stringify({ sectionStatuses, extractedData })
                })}
                disabled={saveMutation.isPending}
                className="border-[#0078D4] text-[#0078D4] hover:bg-[#E5F0FA] text-xs font-semibold px-4 h-9 gap-1.5 rounded-sm"
              >
                <Save className="h-4 w-4" /> Save Review Draft
              </Button>

              <Button
                onClick={handleSaveAndProceed}
                className="bg-[#0078D4] hover:bg-[#005A9E] text-white text-xs font-semibold px-5 h-9 gap-2 rounded-sm shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve All Extracted Data & Proceed to Planning
              </Button>
            </div>
          </div>
        </div>

        {/* REJECT REASON MODAL */}
        <Dialog open={activeModal?.type === 'reject'} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="border-b border-[#EDEBE9] pb-3">
              <DialogTitle className="text-base font-bold text-[#A80000] flex items-center gap-2">
                <XCircle className="h-5 w-5 text-[#A80000]" /> Reject / Flag Extracted Section
              </DialogTitle>
              <DialogDescription className="text-xs text-[#605E5C]">
                Specify the reason for flagging or rejecting the extracted data in "{activeModal ? getSectionTitle(activeModal.sectionKey) : ''}".
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 space-y-3">
              <label className="text-xs font-semibold text-[#201F1E] block">Rejection Reason / Auditor Flag:</label>
              <textarea
                rows={3}
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
                placeholder="e.g. Incomplete vendor sub-ledger data extracted, missing Q3 tax remittance records..."
                className="w-full p-2.5 rounded-sm border border-[#C8C6C4] text-xs font-sans focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EDEBE9]">
              <Button size="sm" variant="outline" onClick={() => setActiveModal(null)} className="text-xs h-8">
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={() => {
                  if (activeModal) {
                    handleSetStatus(activeModal.sectionKey, 'Rejected', rejectReasonInput);
                    setActiveModal(null);
                    setRejectReasonInput('');
                  }
                }}
                className="bg-[#A80000] hover:bg-[#8A0000] text-white text-xs font-semibold px-4 h-8"
              >
                Flag Section
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* EDIT SECTION CONTENT MODAL */}
        <Dialog open={activeModal?.type === 'edit'} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader className="border-b border-[#EDEBE9] pb-3">
              <DialogTitle className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-[#0078D4]" /> Edit Extracted Section Content
              </DialogTitle>
              <DialogDescription className="text-xs text-[#605E5C]">
                Modify extracted fields or text for "{activeModal ? getSectionTitle(activeModal.sectionKey) : ''}".
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 space-y-3">
              <label className="text-xs font-semibold text-[#201F1E] block">Extracted Data Content:</label>
              <textarea
                rows={8}
                value={editDataInput}
                onChange={(e) => setEditDataInput(e.target.value)}
                className="w-full p-2.5 rounded-sm border border-[#C8C6C4] text-xs font-mono focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EDEBE9]">
              <Button size="sm" variant="outline" onClick={() => setActiveModal(null)} className="text-xs h-8">
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveEdit}
                className="bg-[#0078D4] hover:bg-[#005A9E] text-white text-xs font-semibold px-4 h-8"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </PageLayout>
  );
}

// --- REUSABLE SECTION CARD COMPONENT WITH ACCEPT, REJECT, EDIT BUTTONS ---
interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  statusState: ReviewSectionState;
  onAccept: () => void;
  onReject: () => void;
  onEdit: () => void;
  children: React.ReactNode;
}

function SectionCard({ title, icon, statusState, onAccept, onReject, onEdit, children }: SectionCardProps) {
  const isAccepted = statusState?.status === 'Accepted';
  const isRejected = statusState?.status === 'Rejected';

  return (
    <Card className="border-[#EDEBE9] bg-white shadow-xs">
      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#E5F0FA] rounded-sm">
            {icon}
          </div>
          <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider">
            {title}
          </CardTitle>
          {isAccepted && (
            <Badge className="bg-[#DFF6DD] text-[#107C41] border border-[#107C41]/30 text-[10px] font-bold px-2 py-0.5 gap-1">
              <Check className="h-3 w-3" /> Approved
            </Badge>
          )}
          {isRejected && (
            <Badge className="bg-[#FDE7E9] text-[#A80000] border border-[#A80000]/30 text-[10px] font-bold px-2 py-0.5 gap-1">
              <XCircle className="h-3 w-3" /> Flagged / Rejected
            </Badge>
          )}
        </div>

        {/* SECTION ACTION BUTTONS (ACCEPT, REJECT, EDIT) */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={onAccept}
            className={`h-7 px-3 text-[11px] font-bold gap-1 rounded-sm ${
              isAccepted 
                ? 'bg-[#107C41] text-white border-[#107C41]' 
                : 'border-[#107C41] text-[#107C41] hover:bg-[#DFF6DD]'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Accept
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onReject}
            className={`h-7 px-3 text-[11px] font-bold gap-1 rounded-sm ${
              isRejected 
                ? 'bg-[#A80000] text-white border-[#A80000]' 
                : 'border-[#A80000] text-[#A80000] hover:bg-[#FDE7E9]'
            }`}
          >
            <XCircle className="h-3.5 w-3.5" /> Reject
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="h-7 px-3 text-[11px] border-[#0078D4] text-[#0078D4] hover:bg-[#E5F0FA] font-bold gap-1 rounded-sm"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {statusState?.rejectionReason && (
          <div className="p-3 mb-4 bg-[#FDE7E9] border border-[#A80000]/30 rounded text-xs text-[#A80000] space-y-0.5">
            <span className="font-bold block">Rejection Flag Note:</span>
            <p>{statusState.rejectionReason}</p>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
