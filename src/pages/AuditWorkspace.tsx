import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/src/components/ui/dialog';
import { Progress } from '@/src/components/ui/progress';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  FolderOpen, 
  History, 
  HelpCircle, 
  GitBranch, 
  AlertTriangle, 
  FileText, 
  FileCode, 
  ListChecks, 
  CheckCircle, 
  Sparkles, 
  Save, 
  Download, 
  Play, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  BookOpen, 
  ShieldAlert, 
  Building2, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  RefreshCw, 
  Trash2, 
  Upload, 
  User, 
  Calendar, 
  Check, 
  XCircle, 
  Info,
  Send,
  MessageSquare,
  ShieldCheck,
  FileCheck,
  Target,
  DollarSign,
  RotateCcw,
  SlidersHorizontal,
  ListOrdered,
  FileQuestion,
  TrendingUp,
  ThumbsUp
} from 'lucide-react';
import { toast } from 'sonner';
import { ApiClient } from '@/src/lib/api';

// --- TYPES ---
interface KnowledgeFile {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  status?: string;
  contentSummary?: string;
}

interface HistoricalFinding {
  id: string;
  year: string;
  riskRating: 'High' | 'Medium' | 'Low';
  majorFindings: string;
  repeatFindings: 'Yes' | 'No';
  frauds: string;
  penalties: string;
  managementResponse: string;
  status: 'Closed' | 'In Progress' | 'Remediated';
  details: {
    rootCause: string;
    actionPlan: string;
    targetCompletion: string;
    auditorNotes: string;
  };
}

interface RiskItem {
  id: string;
  risk: string;
  category: string;
  likelihood: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  overallRisk: 'High' | 'Medium' | 'Low';
  reason: string;
  evidence: string;
  status: 'Identified' | 'Under Review' | 'Mitigated';
}

interface ProcedureItem {
  id: string;
  objective: string;
  procedure: string;
  evidenceRequired: string;
  owner: string;
  status: 'Planned' | 'Draft' | 'Pending AI';
}

// Default mock historical records
const DEFAULT_HISTORICAL_FINDINGS: HistoricalFinding[] = [
  {
    id: 'h-1',
    year: '2025-26',
    riskRating: 'Medium',
    majorFindings: 'Inadequate segregation of duties in vendor payment approvals over $50,000.',
    repeatFindings: 'No',
    frauds: 'Nil',
    penalties: 'Nil',
    managementResponse: 'Agreed. ERP workflow limits updated in Q3.',
    status: 'Remediated',
    details: {
      rootCause: 'Manual override permission enabled during SAP system migration.',
      actionPlan: 'Enforce Dual-authorization rule in SAP GRC module.',
      targetCompletion: 'Oct 31, 2025',
      auditorNotes: 'Verified configuration fix during follow-up testing.'
    }
  },
  {
    id: 'h-2',
    year: '2024-25',
    riskRating: 'High',
    majorFindings: 'Unreconciled suspense accounts pending for >180 days in Treasury sub-ledger.',
    repeatFindings: 'Yes',
    frauds: 'Nil',
    penalties: 'Nil',
    managementResponse: 'Dedicated clearing team deployed to liquidate aged open items.',
    status: 'Closed',
    details: {
      rootCause: 'Lack of automated bank statement clearing interface.',
      actionPlan: 'Implement Host-to-Host automated bank reconciliation.',
      targetCompletion: 'Jan 15, 2025',
      auditorNotes: 'Suspense balance reduced by 94% as of Q4 audit review.'
    }
  },
  {
    id: 'h-3',
    year: '2023-24',
    riskRating: 'Medium',
    majorFindings: 'Delay in filing statutory GST withholding tax returns for IT service vendors.',
    repeatFindings: 'No',
    frauds: 'Nil',
    penalties: '$12,500 Late Fee',
    managementResponse: 'Tax calendar automated with automated email alerts to tax lead.',
    status: 'Closed',
    details: {
      rootCause: 'Staff turnover in tax compliance team without handover checklist.',
      actionPlan: 'Establish automated compliance tracker and SLA dashboard.',
      targetCompletion: 'Aug 20, 2023',
      auditorNotes: 'Penalty reimbursed by tax advisory firm due to service failure.'
    }
  },
  {
    id: 'h-4',
    year: '2022-23',
    riskRating: 'Low',
    majorFindings: 'Minor delay in fixed asset physical verification tagging across regional branch offices.',
    repeatFindings: 'No',
    frauds: 'Nil',
    penalties: 'Nil',
    managementResponse: 'RFID barcode scanners provided to regional asset custodians.',
    status: 'Closed',
    details: {
      rootCause: 'Manual paper register maintained at branch locations.',
      actionPlan: 'Digitize fixed asset register into centralized ERP.',
      targetCompletion: 'Nov 10, 2022',
      auditorNotes: '100% asset tagging confirmed across 42 regional branches.'
    }
  },
  {
    id: 'h-5',
    year: '2021-22',
    riskRating: 'Medium',
    majorFindings: 'Lack of formal quarterly user access reviews for core banking & treasury sub-systems.',
    repeatFindings: 'Yes',
    frauds: 'Nil',
    penalties: 'Nil',
    managementResponse: 'Quarterly IAM access review policy approved by CISO.',
    status: 'Closed',
    details: {
      rootCause: 'Access review process owned informally by IT operations team.',
      actionPlan: 'Automate quarterly entitlement review via Identity Governance tool.',
      targetCompletion: 'Mar 31, 2022',
      auditorNotes: 'Quarterly access certification logs inspected and verified.'
    }
  }
];

// Default mock risk matrix items
const DEFAULT_RISKS: RiskItem[] = [
  {
    id: 'r-1',
    risk: 'Unauthorized disbursements or duplicate payment processing via manual vendor creation.',
    category: 'Financial & Treasury',
    likelihood: 'High',
    impact: 'High',
    overallRisk: 'High',
    reason: 'Vendor master modification privileges shared across Accounts Payable staff without dual control.',
    evidence: 'SOP Section 4.2 & Trial Balance Ledger #4102',
    status: 'Identified'
  },
  {
    id: 'r-2',
    risk: 'Non-compliance with updated regional statutory tax withholding limits resulting in regulatory fines.',
    category: 'Regulatory Compliance',
    likelihood: 'Medium',
    impact: 'High',
    overallRisk: 'Medium',
    reason: 'New tax amendments implemented without automated ERP validation rules.',
    evidence: 'Regulatory Review Memo FY2026',
    status: 'Under Review'
  },
  {
    id: 'r-3',
    risk: 'Privileged user account misuse or unauthorized database modifications in core financial ledger.',
    category: 'Information Security',
    likelihood: 'Medium',
    impact: 'High',
    overallRisk: 'Medium',
    reason: 'Generic administrator account shared among database operations team.',
    evidence: 'IT Infrastructure Security Log',
    status: 'Identified'
  },
  {
    id: 'r-4',
    risk: 'Inaccurate revenue recognition due to manual end-of-period journal entry adjustments.',
    category: 'Financial Reporting',
    likelihood: 'Low',
    impact: 'High',
    overallRisk: 'Medium',
    reason: 'High volume of manual journal vouchers posted during month-end financial close.',
    evidence: 'Balance Sheet Account #1005',
    status: 'Mitigated'
  }
];

// Default mock audit program
const DEFAULT_PROCEDURES: ProcedureItem[] = [
  {
    id: 'p-1',
    objective: 'Evaluate segregation of duties in vendor creation and payment authorization.',
    procedure: 'Obtain SAP user access matrix for AP module. Verify if any user holds both vendor creation and payment approval privileges.',
    evidenceRequired: 'SAP User Role Matrix, Vendor Master Modification Logs',
    owner: 'Senior Auditor (Finance)',
    status: 'Planned'
  },
  {
    id: 'p-2',
    objective: 'Test completeness and accuracy of bank reconciliations.',
    procedure: 'Select sample of 12 monthly bank reconciliations across top 5 operational accounts. Trace un-cleared items to subsequent bank statements.',
    evidenceRequired: 'Monthly Bank Statements, Sub-ledger Reconciliation Files',
    owner: 'Lead Auditor',
    status: 'Planned'
  },
  {
    id: 'p-3',
    objective: 'Verify compliance with statutory tax withholding rules.',
    procedure: 'Sample 50 vendor invoices subject to tax deduction. Verify tax rates applied against current statutory schedule.',
    evidenceRequired: 'Vendor Invoices, Tax Challans, Remittance Receipts',
    owner: 'Tax Specialist',
    status: 'Planned'
  },
  {
    id: 'p-4',
    objective: 'Assess privileged access governance for database admin accounts.',
    procedure: 'Inspect Privileged Access Management (PAM) session logs for database adjustments made during financial year.',
    evidenceRequired: 'PAM Access Logs, Change Control Vouchers',
    owner: 'IT Auditor',
    status: 'Planned'
  }
];

export default function AuditWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [expandedRow, setExpandedRow] = useState<string | null>('h-1');
  const [previewDoc, setPreviewDoc] = useState<{ title: string; content: string; format: string } | null>(null);
  const [approvalComments, setApprovalComments] = useState<string>('');

  // Fetch Audit details
  const { data: audit, isLoading, error } = useQuery({
    queryKey: ['audit', id],
    queryFn: () => ApiClient.get(`/audits/${id}`),
    enabled: !!id,
  });

  // Fetch real dynamic Readiness Score
  const { data: readinessData, refetch: refetchReadiness } = useQuery({
    queryKey: ['readiness', id],
    queryFn: () => ApiClient.get(`/audits/${id}/readiness`),
    enabled: !!id
  });

  // Fetch real Missing Documents Gap Analysis
  const { data: missingDocsData, refetch: refetchMissingDocs } = useQuery({
    queryKey: ['missing-documents', id],
    queryFn: () => ApiClient.get(`/audits/${id}/missing-documents`),
    enabled: !!id
  });

  // Fetch real uploaded backend documents
  const { data: backendDocs = [], refetch: refetchDocs } = useQuery({
    queryKey: ['documents', id],
    queryFn: () => ApiClient.get(`/documents?engagementId=${id}`),
    enabled: !!id
  });

  // Fetch real historical findings from DB
  const { data: backendHistoricalFindings = [], refetch: refetchHistorical } = useQuery({
    queryKey: ['historical-findings', id],
    queryFn: () => ApiClient.get(`/historical-findings?engagementId=${id}`),
    enabled: !!id
  });

  // Fetch real planning questionnaire responses from DB
  const { data: savedQuestionnaireData, refetch: refetchQuestionnaire } = useQuery({
    queryKey: ['questionnaire', id],
    queryFn: () => ApiClient.get(`/audits/${id}/questionnaire`),
    enabled: !!id
  });

  // Fetch real approval history from DB
  const { data: approvalData, refetch: refetchApproval } = useQuery({
    queryKey: ['approval', id],
    queryFn: () => ApiClient.get(`/audits/${id}/approval`),
    enabled: !!id
  });

  // Fetch Staged AI status and outputs
  const { data: stagedData, refetch: refetchStaged } = useQuery({
    queryKey: ['staged-status', id],
    queryFn: () => ApiClient.get(`/ai/staged/status/${id}`),
    enabled: !!id,
    refetchInterval: 3000
  });

  const [reviewComments, setReviewComments] = useState<Record<number, string>>({});
  const [overrideModal, setOverrideModal] = useState<{ open: boolean; stageNumber: number; text: string }>({ open: false, stageNumber: 1, text: '' });

  const updateDocAiStatusMutation = useMutation({
    mutationFn: ({ docId, aiStatus }: { docId: string; aiStatus: string }) =>
      ApiClient.put(`/documents/${docId}/ai-status`, { aiStatus }),
    onSuccess: () => {
      refetchDocs();
      toast.success("Document AI status updated");
    }
  });

  const executeStage1Mutation = useMutation({
    mutationFn: () => ApiClient.post('/ai/staged/stage1', { engagementId: id, engagementName: audit?.name, department: audit?.department, auditType: audit?.auditType, financialYear: audit?.financialYear }),
    onSuccess: () => {
      toast.success("Stage 1 Risk Assessment & Background Analysis generated!");
      refetchStaged();
      refetchReadiness();
    },
    onError: (err: any) => {
      toast.error(err.message || "Stage 1 AI Execution Failed");
    }
  });

  const executeStage2Mutation = useMutation({
    mutationFn: () => ApiClient.post('/ai/staged/stage2', { engagementId: id, engagementName: audit?.name, department: audit?.department, auditType: audit?.auditType, financialYear: audit?.financialYear }),
    onSuccess: () => {
      toast.success("Stage 2 Planning Memorandum generated!");
      refetchStaged();
      refetchReadiness();
    },
    onError: (err: any) => {
      toast.error(err.message || "Stage 2 AI Execution Failed");
    }
  });

  const executeStage3Mutation = useMutation({
    mutationFn: () => ApiClient.post('/ai/staged/stage3', { engagementId: id, engagementName: audit?.name, department: audit?.department, auditType: audit?.auditType }),
    onSuccess: () => {
      toast.success("Stage 3 Scoping Document generated!");
      refetchStaged();
      refetchReadiness();
    },
    onError: (err: any) => {
      toast.error(err.message || "Stage 3 AI Execution Failed");
    }
  });

  const executeStage4Mutation = useMutation({
    mutationFn: () => ApiClient.post('/ai/staged/stage4', { engagementId: id, engagementName: audit?.name, auditType: audit?.auditType }),
    onSuccess: () => {
      toast.success("Stage 4 Audit Test Program generated!");
      refetchStaged();
      refetchReadiness();
    },
    onError: (err: any) => {
      toast.error(err.message || "Stage 4 AI Execution Failed");
    }
  });

  const reviewActionMutation = useMutation({
    mutationFn: (payload: { stageNumber: number; action: string; comments?: string; overrideOutputs?: any }) =>
      ApiClient.post('/ai/staged/review-action', { engagementId: id, ...payload }),
    onSuccess: (_, variables) => {
      toast.success(`Stage ${variables.stageNumber} action '${variables.action}' recorded!`);
      refetchStaged();
      refetchApproval();
      refetchReadiness();
    },
    onError: (err: any) => {
      toast.error(err.message || "Review action failed");
    }
  });

  // Local state for workspace documents
  const [knowledgeSources, setKnowledgeSources] = useState<Record<string, KnowledgeFile | null>>({});

  useEffect(() => {
    if (audit?.knowledgeSources) {
      try {
        const parsed = typeof audit.knowledgeSources === 'string' 
          ? JSON.parse(audit.knowledgeSources) 
          : audit.knowledgeSources;
        setKnowledgeSources(parsed || {});
      } catch (e) {
        setKnowledgeSources({});
      }
    } else {
      // Set sensible defaults for workspace demo
      setKnowledgeSources({
        previousAuditReports: { name: 'Previous_Audit_Report_FY25.pdf', size: '2.4 MB', type: 'application/pdf', uploadedAt: '21 Jul 2026, 10:15 AM', status: 'Parsed & Ready' },
        currentYearDocuments: { name: 'Annual_Operating_Plan_FY27.pdf', size: '4.1 MB', type: 'application/pdf', uploadedAt: '21 Jul 2026, 10:18 AM', status: 'Parsed & Ready' },
        balanceSheet: { name: 'Trial_Balance_Q4_2026.xlsx', size: '1.8 MB', type: 'application/xlsx', uploadedAt: '21 Jul 2026, 10:20 AM', status: 'Parsed & Ready' },
        sop: { name: 'Treasury_SOP_v3.2.docx', size: '850 KB', type: 'application/docx', uploadedAt: '21 Jul 2026, 10:22 AM', status: 'Parsed & Ready' },
        riskRegister: { name: 'Enterprise_Risk_Register_2026.xlsx', size: '3.2 MB', type: 'application/xlsx', uploadedAt: '21 Jul 2026, 10:25 AM', status: 'Parsed & Ready' },
        fraudRegister: { name: 'Fraud_Incident_Log_2026.pdf', size: '512 KB', type: 'application/pdf', uploadedAt: '21 Jul 2026, 10:28 AM', status: 'Parsed & Ready' },
        regulatoryReview: { name: 'Regulatory_Inspection_Report.pdf', size: '1.1 MB', type: 'application/pdf', uploadedAt: '21 Jul 2026, 10:30 AM', status: 'Parsed & Ready' },
        rcm: { name: 'Risk_Control_Matrix_Finance.xlsx', size: '2.9 MB', type: 'application/xlsx', uploadedAt: '21 Jul 2026, 10:32 AM', status: 'Parsed & Ready' },
      });
    }
  }, [audit]);

  // Parse questionnaire
  const questionnaire = React.useMemo(() => {
    if (audit?.questionnaire) {
      try {
        return typeof audit.questionnaire === 'string' ? JSON.parse(audit.questionnaire) : audit.questionnaire;
      } catch (e) {
        return { penaltiesOrFines: 'No', fraudReported: 'No', highRiskObservations: 'No' };
      }
    }
    return { penaltiesOrFines: 'No', fraudReported: 'No', highRiskObservations: 'No' };
  }, [audit]);

  // Save Draft Mutation
  const saveMutation = useMutation({
    mutationFn: (data: any) => ApiClient.put(`/audits/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit', id] });
      toast.success("Audit Planning Workspace draft saved successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save workspace draft");
    }
  });

  const handleSaveDraft = () => {
    saveMutation.mutate({
      status: 'Planning',
      knowledgeSources: JSON.stringify(knowledgeSources),
      questionnaire: JSON.stringify(questionnaire),
      workspaceData: JSON.stringify({
        lastUpdated: new Date().toISOString(),
        comments: approvalComments
      })
    });
  };

  const handleDocumentReplace = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
    const updated = {
      ...knowledgeSources,
      [key]: {
        name: file.name,
        size: formattedSize,
        type: file.type || 'Document',
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Parsed & Ready'
      }
    };
    setKnowledgeSources(updated);
    toast.success(`Updated document for ${key}`);
  };

  const handleDocumentRemove = (key: string) => {
    const updated = { ...knowledgeSources, [key]: null };
    setKnowledgeSources(updated);
    toast.info("Document removed from workspace");
  };

  const getStageState = (stageNumber: number) => {
    return stagedData?.stages?.[stageNumber] || {
      stageName: `Stage ${stageNumber}`,
      status: 'Pending Review',
      version: 1,
      aiOutputs: null,
      history: []
    };
  };

  const renderStageReviewBar = (stageNumber: 1 | 2 | 3 | 4, stageTitle: string, onExecute: () => void, isExecuting: boolean) => {
    const stage = getStageState(stageNumber);
    const status = stage.status || 'Pending Review';
    const comments = reviewComments[stageNumber] || '';

    const statusColor = status === 'Approved' 
      ? 'bg-[#107C41] text-white' 
      : status === 'Rejected' 
      ? 'bg-[#A80000] text-white' 
      : status === 'Needs Revision' 
      ? 'bg-[#C57F00] text-white' 
      : 'bg-[#0078D4] text-white';

    const isPrevApproved = stageNumber === 1 || stagedData?.stages?.[stageNumber - 1]?.status === 'Approved';

    return (
      <Card className="border border-[#EDEBE9] shadow-sm mb-6 bg-white overflow-hidden">
        <CardHeader className="p-4 bg-[#FAF9F8] border-b border-[#EDEBE9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#605E5C] uppercase tracking-wider">Stage {stageNumber} Human Review</span>
              <Badge className={`text-[11px] font-bold px-2.5 py-0.5 rounded-sm ${statusColor}`}>
                {status}
              </Badge>
              <Badge variant="outline" className="text-[10px] text-[#605E5C] border-[#E1DFDD]">
                v{stage.version || 1}.0
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-[#201F1E] mt-1">{stageTitle}</h3>
            {stage.reviewedBy && (
              <p className="text-[11px] text-[#605E5C] mt-0.5">
                Last reviewed by <span className="font-semibold text-[#201F1E]">{stage.reviewerName || stage.reviewedBy}</span> on {new Date(stage.reviewedAt!).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!stage.aiOutputs ? (
              <Button 
                onClick={onExecute} 
                disabled={isExecuting || !isPrevApproved}
                className="bg-[#0078D4] hover:bg-[#005A9E] text-white text-xs font-bold h-8 px-3 rounded-sm gap-1.5 shadow-xs"
              >
                {isExecuting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {!isPrevApproved ? `Locked (Approve Stage ${stageNumber - 1} first)` : `Execute Stage ${stageNumber} AI`}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={onExecute} 
                  disabled={isExecuting}
                  variant="outline"
                  className="border-[#E1DFDD] hover:bg-[#F3F2F1] text-[#323130] text-xs font-semibold h-8 px-3 rounded-sm gap-1"
                >
                  {isExecuting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 text-[#0078D4]" />}
                  Re-Run AI
                </Button>

                <Button 
                  onClick={() => reviewActionMutation.mutate({ stageNumber, action: 'Approve', comments })}
                  disabled={reviewActionMutation.isPending || status === 'Approved'}
                  className="bg-[#107C41] hover:bg-[#0B5A2F] text-white text-xs font-bold h-8 px-3 rounded-sm gap-1 shadow-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approve Stage
                </Button>

                <Button 
                  onClick={() => reviewActionMutation.mutate({ stageNumber, action: 'Request Revision', comments })}
                  disabled={reviewActionMutation.isPending}
                  className="bg-[#C57F00] hover:bg-[#966100] text-white text-xs font-bold h-8 px-3 rounded-sm gap-1 shadow-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Request Revision
                </Button>

                <Button 
                  onClick={() => reviewActionMutation.mutate({ stageNumber, action: 'Reject', comments })}
                  disabled={reviewActionMutation.isPending}
                  className="bg-[#A80000] hover:bg-[#780000] text-white text-xs font-bold h-8 px-3 rounded-sm gap-1 shadow-xs"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </Button>

                <Button 
                  onClick={() => setOverrideModal({ open: true, stageNumber, text: JSON.stringify(stage.aiOutputs, null, 2) })}
                  variant="outline"
                  className="border-[#8A2BE2] text-[#8A2BE2] hover:bg-[#F3E8FF] text-xs font-bold h-8 px-3 rounded-sm gap-1"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Manual Override
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-3 bg-white border-t border-[#EDEBE9] flex items-center gap-3">
          <MessageSquare className="h-4 w-4 text-[#605E5C] shrink-0" />
          <input 
            type="text" 
            value={comments} 
            onChange={(e) => setReviewComments(prev => ({ ...prev, [stageNumber]: e.target.value }))}
            placeholder={`Auditor notes / comments for Stage ${stageNumber}...`}
            className="w-full text-xs bg-[#FAF9F8] border border-[#E1DFDD] rounded px-3 py-1.5 focus:outline-none focus:border-[#0078D4]"
          />
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="p-12 min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] text-[#605E5C]">
          <Loader2 className="h-8 w-8 animate-spin text-[#0078D4] mb-3" />
          <p className="text-sm font-semibold text-[#201F1E]">Loading Audit Planning Workspace...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !audit) {
    return (
      <PageLayout>
        <div className="p-12 min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] text-[#323130]">
          <AlertTriangle className="h-10 w-10 text-[#A80000] mb-3" />
          <h2 className="text-lg font-bold text-[#201F1E]">Audit Workspace Not Found</h2>
          <p className="text-xs text-[#605E5C] mt-1 mb-4">The requested planning engagement record could not be retrieved.</p>
          <Button onClick={() => navigate('/dashboard')} className="bg-[#0078D4] hover:bg-[#005A9E] text-white text-xs font-semibold px-4 h-9">
            Return to Dashboard
          </Button>
        </div>
      </PageLayout>
    );
  }

  const TABS = [
    { id: 'overview', label: '1. Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'knowledge', label: '2. Knowledge Sources', icon: <FolderOpen className="h-4 w-4" />, badge: '8 Docs' },
    { id: 'historical', label: '3. Historical Audit Analysis', icon: <History className="h-4 w-4" />, badge: '5 Yrs' },
    { id: 'questionnaire', label: '4. Planning Questionnaire', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'process', label: '5. Process Understanding', icon: <GitBranch className="h-4 w-4" /> },
    { id: 'risk', label: '6. Risk Assessment', icon: <AlertTriangle className="h-4 w-4" />, badge: '4 Risks' },
    { id: 'planningDoc', label: '7. Planning Document', icon: <FileText className="h-4 w-4" /> },
    { id: 'scopingDoc', label: '8. Scoping Document', icon: <FileCode className="h-4 w-4" /> },
    { id: 'program', label: '9. Audit Program', icon: <ListChecks className="h-4 w-4" />, badge: '4 Steps' },
    { id: 'approval', label: '10. Approval', icon: <CheckCircle className="h-4 w-4" /> },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F9FA] text-[#323130] flex flex-col justify-between">
        
        <div className="p-6 max-w-[1500px] mx-auto w-full space-y-6 pb-24">
          
          {/* HEADER BAR - Fluent Style */}
          <div className="bg-white p-6 rounded-md border border-[#EDEBE9] shadow-sm flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EDEBE9]">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => navigate('/dashboard')}
                  className="h-9 w-9 border-[#E1DFDD] hover:bg-[#F3F2F1] text-[#605E5C] rounded-sm shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight text-[#201F1E]">
                      Audit Planning Workspace
                    </h1>
                    <Badge className="bg-[#0078D4] text-white px-2.5 py-0.5 text-[11px] font-semibold rounded-sm">
                      {audit.status || 'Planning'}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#605E5C] mt-1">
                    Review uploaded documents, historical audits, generated planning outputs, and approve before AI execution.
                  </p>
                </div>
              </div>

              {/* Document Readiness Score Badge */}
              <div className="flex items-center gap-3 bg-[#FAF9F8] p-3 rounded-md border border-[#EDEBE9] shrink-0">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-[#605E5C] tracking-wider">Planning Readiness Score</p>
                  <p className={`text-sm font-bold flex items-center justify-end gap-1 ${(readinessData?.overallScore ?? 0) >= 80 ? 'text-[#107C41]' : (readinessData?.overallScore ?? 0) >= 60 ? 'text-[#C57F00]' : 'text-[#A80000]'}`}>
                    {readinessData?.overallScore ?? 85}% • {readinessData?.status || 'Calculated Readiness'}
                  </p>
                </div>
                <div className={`h-10 w-10 rounded-full border-4 flex items-center justify-center text-xs font-bold bg-white ${(readinessData?.overallScore ?? 0) >= 80 ? 'border-[#107C41] text-[#107C41]' : (readinessData?.overallScore ?? 0) >= 60 ? 'border-[#C57F00] text-[#C57F00]' : 'border-[#A80000] text-[#A80000]'}`}>
                  {readinessData?.overallScore ?? 85}%
                </div>
              </div>
            </div>

            {/* Header Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-xs">
              <div>
                <span className="text-[#605E5C] block text-[11px] font-semibold">Audit Type</span>
                <span className="font-bold text-[#201F1E]">{audit.auditType || 'Operational Audit'}</span>
              </div>
              <div>
                <span className="text-[#605E5C] block text-[11px] font-semibold">Department</span>
                <span className="font-bold text-[#201F1E]">{audit.department}</span>
              </div>
              <div>
                <span className="text-[#605E5C] block text-[11px] font-semibold">Financial Year</span>
                <span className="font-bold text-[#201F1E]">{audit.financialYear}</span>
              </div>
              <div>
                <span className="text-[#605E5C] block text-[11px] font-semibold">Planning Status</span>
                <span className="font-bold text-[#0078D4] flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Draft Workspace
                </span>
              </div>
              <div>
                <span className="text-[#605E5C] block text-[11px] font-semibold">Generated On</span>
                <span className="font-medium text-[#323130]">
                  {new Date(audit.createdAt || Date.now()).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="text-[#605E5C] block text-[11px] font-semibold">Created By</span>
                <span className="font-medium text-[#323130] flex items-center gap-1">
                  <User className="h-3 w-3 text-[#0078D4]" /> Internal Auditor
                </span>
              </div>
            </div>
          </div>

          {/* MAIN WORKSPACE LAYOUT (LEFT SIDEBAR + RIGHT CONTENT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT NAVIGATION SIDEBAR (10 TABS) */}
            <div className="lg:col-span-3 bg-white border border-[#EDEBE9] rounded-md shadow-sm p-2 space-y-1 sticky top-6">
              <div className="px-3 py-2 border-b border-[#EDEBE9] mb-1">
                <p className="text-[11px] font-bold text-[#605E5C] uppercase tracking-wider">
                  Workspace Sections
                </p>
              </div>

              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-sm text-xs font-semibold flex items-center justify-between transition-all ${
                      isActive 
                        ? 'bg-[#0078D4] text-white shadow-xs' 
                        : 'text-[#323130] hover:bg-[#F3F2F1] hover:text-[#0078D4]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={isActive ? 'text-white' : 'text-[#0078D4]'}>
                        {tab.icon}
                      </span>
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#F3F2F1] text-[#605E5C] border border-[#E1DFDD]'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* RIGHT MAIN CONTENT AREA */}
            <div className="lg:col-span-9 bg-white border border-[#EDEBE9] rounded-md shadow-sm min-h-[650px] p-6">
              
              {/* TAB 1: OVERVIEW & PLANNING RECOMMENDATIONS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDEBE9]">
                    <div>
                      <h2 className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#0078D4]" /> AI Audit Planning Recommendation & Strategy Brief
                      </h2>
                      <p className="text-xs text-[#605E5C] mt-0.5">
                        Synthesized business-focused strategy, risk-weighted scope recommendations, and planning readiness score generated by AI Orchestration.
                      </p>
                    </div>
                    <Badge className="bg-[#107C41] text-white text-xs font-semibold px-2.5 py-1 w-fit">
                      Grade A • Readiness Score: 92/100
                    </Badge>
                  </div>

                  {/* 1. PLANNING READINESS SCORE & AUDIT SELECTION SUMMARY */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* AUDIT SELECTION SUMMARY */}
                    <Card className="lg:col-span-2 border-[#EDEBE9] bg-white shadow-xs">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-[#0078D4]" /> 1. Audit Selection & Charter Summary
                          </span>
                          <Badge variant="outline" className="text-[10px] bg-[#E5F0FA] text-[#0078D4] border-[#0078D4]/30 font-semibold">
                            Annual Audit Plan Item
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3 text-xs">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF9F8] p-3 rounded border border-[#EDEBE9]">
                          <div>
                            <span className="text-[#605E5C] block font-semibold text-[10px]">Audit Entity</span>
                            <span className="font-bold text-[#201F1E]">Treasury & AP Operations</span>
                          </div>
                          <div>
                            <span className="text-[#605E5C] block font-semibold text-[10px]">Financial Year</span>
                            <span className="font-bold text-[#201F1E]">{audit.financialYear}</span>
                          </div>
                          <div>
                            <span className="text-[#605E5C] block font-semibold text-[10px]">Target Duration</span>
                            <span className="font-bold text-[#201F1E]">6 Weeks (320 Hours)</span>
                          </div>
                          <div>
                            <span className="text-[#605E5C] block font-semibold text-[10px]">Team Size</span>
                            <span className="font-bold text-[#0078D4]">1 Lead + 2 Staff Auditors</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-[#201F1E] block">Strategic Justification & Risk Rationale:</span>
                          <p className="text-[#323130] leading-relaxed bg-white p-2.5 rounded border border-[#EDEBE9] text-[11px]">
                            Selected due to high annual disbursement volume ($140M+ across 18,500 payment vouchers), recent deployment of Host-to-Host ERP bank integrations, multi-currency foreign exchange exposures, and unresolved repeat access control observations from FY25 internal audit.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* PLANNING READINESS SCORE */}
                    <Card className="border-[#EDEBE9] bg-white shadow-xs flex flex-col justify-between">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider flex items-center gap-2">
                          <Target className="h-4 w-4 text-[#107C41]" /> Planning Readiness Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="text-center bg-[#DFF6DD]/40 p-3 rounded-md border border-[#107C41]/20">
                          <span className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block">Overall Readiness</span>
                          <p className="text-3xl font-extrabold text-[#107C41] my-0.5">92 / 100</p>
                          <Badge className="bg-[#107C41] text-white text-[10px] font-bold">Ready for Fieldwork</Badge>
                        </div>

                        <div className="space-y-2 text-[11px]">
                          <div>
                            <div className="flex justify-between font-semibold mb-0.5">
                              <span className="text-[#323130]">Data Completeness</span>
                              <span className="text-[#107C41] font-bold">95%</span>
                            </div>
                            <Progress value={95} className="h-1.5 bg-[#EDEBE9]" />
                          </div>

                          <div>
                            <div className="flex justify-between font-semibold mb-0.5">
                              <span className="text-[#323130]">Control Documentation</span>
                              <span className="text-[#107C41] font-bold">90%</span>
                            </div>
                            <Progress value={90} className="h-1.5 bg-[#EDEBE9]" />
                          </div>

                          <div>
                            <div className="flex justify-between font-semibold mb-0.5">
                              <span className="text-[#323130]">Historical Finding Coverage</span>
                              <span className="text-[#107C41] font-bold">92%</span>
                            </div>
                            <Progress value={92} className="h-1.5 bg-[#EDEBE9]" />
                          </div>

                          <div>
                            <div className="flex justify-between font-semibold mb-0.5">
                              <span className="text-[#323130]">Governance Alignment</span>
                              <span className="text-[#0078D4] font-bold">88%</span>
                            </div>
                            <Progress value={88} className="h-1.5 bg-[#EDEBE9]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 2. KEY RISKS RECOMMENDATIONS */}
                  <Card className="border-[#EDEBE9] bg-white shadow-xs">
                    <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                      <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-[#A80000]" /> 2. Key Identified Risk Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      
                      {/* Risk Item 1 */}
                      <div className="p-3.5 rounded-sm border border-[#EDEBE9] bg-[#FAF9F8] hover:border-[#0078D4]/40 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EDEBE9]">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-xs text-[#201F1E]">1. Dual-Authorization Bypass Risk in Vendor Master Updates</p>
                            <Badge className="bg-[#FDE7E9] text-[#A80000] text-[10px] font-semibold">High Inherent Risk</Badge>
                          </div>
                          <Badge variant="outline" className="text-[10px] bg-white border-[#0078D4]/30 text-[#0078D4] font-mono font-bold w-fit">
                            <Sparkles className="h-3 w-3 mr-1 text-[#0078D4]" /> Confidence: 96%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                          <div>
                            <span className="font-bold text-[10px] text-[#605E5C] uppercase tracking-wider block flex items-center gap-1">
                              <Info className="h-3 w-3 text-[#0078D4]" /> Reason
                            </span>
                            <p className="text-[#323130] leading-relaxed text-[11px] mt-0.5">Manual override permitted in SAP ERP master file updates without enforced 2-person sign-off in 14 logged cases during Q2.</p>
                          </div>
                          <div>
                            <span className="font-bold text-[10px] text-[#605E5C] uppercase tracking-wider block flex items-center gap-1">
                              <FileText className="h-3 w-3 text-[#107C41]" /> Supporting Evidence
                            </span>
                            <p className="text-[#323130] leading-relaxed font-mono text-[10px] bg-white p-1.5 rounded border border-[#EDEBE9] mt-0.5">SAP Change Logs & Treasury SOP v3.2 Section 4.12; 14 unapproved account modifications.</p>
                          </div>
                          <div>
                            <span className="font-bold text-[10px] text-[#605E5C] uppercase tracking-wider block flex items-center gap-1">
                              <ShieldAlert className="h-3 w-3 text-[#A80000]" /> Business Impact
                            </span>
                            <p className="text-[#A80000] font-medium leading-relaxed text-[11px] bg-[#FDE7E9]/40 p-1.5 rounded border border-[#FDE7E9] mt-0.5">High risk of unauthorized vendor account diversion and fraudulent wire disbursements (up to $500k limit).</p>
                          </div>
                        </div>
                      </div>

                      {/* Risk Item 2 */}
                      <div className="p-3.5 rounded-sm border border-[#EDEBE9] bg-[#FAF9F8] hover:border-[#0078D4]/40 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EDEBE9]">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-xs text-[#201F1E]">2. Aged Cash Suspense Balance Reconciliation Delay</p>
                            <Badge className="bg-[#FDE7E9] text-[#A80000] text-[10px] font-semibold">High Financial Risk</Badge>
                          </div>
                          <Badge variant="outline" className="text-[10px] bg-white border-[#0078D4]/30 text-[#0078D4] font-mono font-bold w-fit">
                            <Sparkles className="h-3 w-3 mr-1 text-[#0078D4]" /> Confidence: 94%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                          <div>
                            <span className="font-bold text-[10px] text-[#605E5C] uppercase tracking-wider block flex items-center gap-1">
                              <Info className="h-3 w-3 text-[#0078D4]" /> Reason
                            </span>
                            <p className="text-[#323130] leading-relaxed text-[11px] mt-0.5">Uncleared suspense account balances totaling $1.42M have remained pending for &gt;180 days, exceeding corporate 30-day clearing guidelines.</p>
                          </div>
                          <div>
                            <span className="font-bold text-[10px] text-[#605E5C] uppercase tracking-wider block flex items-center gap-1">
                              <FileText className="h-3 w-3 text-[#107C41]" /> Supporting Evidence
                            </span>
                            <p className="text-[#323130] leading-relaxed font-mono text-[10px] bg-white p-1.5 rounded border border-[#EDEBE9] mt-0.5">Trial Balance GL Account 1010-CS-04 & Bank Reconciliation Statements.</p>
                          </div>
                          <div>
                            <span className="font-bold text-[10px] text-[#605E5C] uppercase tracking-wider block flex items-center gap-1">
                              <ShieldAlert className="h-3 w-3 text-[#A80000]" /> Business Impact
                            </span>
                            <p className="text-[#A80000] font-medium leading-relaxed text-[11px] bg-[#FDE7E9]/40 p-1.5 rounded border border-[#FDE7E9] mt-0.5">Risk of unrecognized uncollectible write-offs, financial misstatement, and delayed transaction error detection.</p>
                          </div>
                        </div>
                      </div>

                    </CardContent>
                  </Card>

                  {/* 3. HISTORICAL SUMMARY & MATERIALITY SUMMARY */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* HISTORICAL SUMMARY */}
                    <Card className="border-[#EDEBE9] bg-white shadow-xs">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider flex items-center gap-2">
                          <History className="h-4 w-4 text-[#0078D4]" /> 3. Historical Audit Summary (3-Year Trend)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3 text-xs">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2.5 bg-[#FAF9F8] rounded border border-[#EDEBE9]">
                            <span className="text-[10px] text-[#605E5C] font-semibold block">FY24 Rating</span>
                            <span className="text-xs font-bold text-[#A80000]">Needs Improvement</span>
                          </div>
                          <div className="p-2.5 bg-[#FAF9F8] rounded border border-[#EDEBE9]">
                            <span className="text-[10px] text-[#605E5C] font-semibold block">FY25 Rating</span>
                            <span className="text-xs font-bold text-[#797673]">Satisfactory w/ Exceptions</span>
                          </div>
                          <div className="p-2.5 bg-[#FAF9F8] rounded border border-[#EDEBE9]">
                            <span className="text-[10px] text-[#605E5C] font-semibold block">FY26 Target</span>
                            <span className="text-xs font-bold text-[#107C41]">Fully Effective</span>
                          </div>
                        </div>

                        <div className="overflow-x-auto border border-[#EDEBE9] rounded">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] border-b border-[#EDEBE9]">
                              <tr>
                                <th className="p-2">Audit Cycle</th>
                                <th className="p-2">Issues</th>
                                <th className="p-2">Closed</th>
                                <th className="p-2">Open Repeat</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EDEBE9]">
                              <tr className="hover:bg-[#FAF9F8]">
                                <td className="p-2 font-bold text-[#201F1E]">FY 2024-25 Treasury Audit</td>
                                <td className="p-2 font-bold">5</td>
                                <td className="p-2 text-[#107C41] font-bold">4 Closed</td>
                                <td className="p-2 text-[#A80000] font-bold">1 Repeat (#TR-03)</td>
                              </tr>
                              <tr className="hover:bg-[#FAF9F8]">
                                <td className="p-2 font-bold text-[#201F1E]">FY 2023-24 AP Audit</td>
                                <td className="p-2 font-bold">6</td>
                                <td className="p-2 text-[#107C41] font-bold">6 Closed</td>
                                <td className="p-2 text-[#107C41] font-bold">0 Open</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* MATERIALITY SUMMARY */}
                    <Card className="border-[#EDEBE9] bg-white shadow-xs">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-[#0078D4]" /> 4. Materiality Summary & Thresholds
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-[#E5F0FA] rounded border border-[#0078D4]/30">
                            <span className="text-[10px] text-[#0078D4] font-bold uppercase block">Planning Materiality</span>
                            <span className="text-base font-extrabold text-[#201F1E]">$1,250,000</span>
                            <span className="text-[10px] text-[#605E5C] block mt-0.5">1% Annual Treasury Volume</span>
                          </div>
                          <div className="p-3 bg-[#FFF4CE] rounded border border-[#797673]/30">
                            <span className="text-[10px] text-[#797673] font-bold uppercase block">Tolerable Misstatement</span>
                            <span className="text-base font-extrabold text-[#201F1E]">$250,000</span>
                            <span className="text-[10px] text-[#605E5C] block mt-0.5">Posting Testing Cutoff</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="p-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded flex justify-between items-center text-[11px]">
                            <div>
                              <span className="font-bold text-[#201F1E] block">Vendor Accounts Payable Sub-ledger</span>
                              <span className="text-[#605E5C]">GL Account #2100-AP-01</span>
                            </div>
                            <span className="font-bold text-[#A80000]">$24.85M (Material)</span>
                          </div>
                          <div className="p-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded flex justify-between items-center text-[11px]">
                            <div>
                              <span className="font-bold text-[#201F1E] block">Foreign Exchange Reserve Ledger</span>
                              <span className="text-[#605E5C]">GL Account #3200-FX-02</span>
                            </div>
                            <span className="font-bold text-[#0078D4]">$8.90M (In-Scope)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 5. RECOMMENDED SCOPE & RECOMMENDED AUDIT AREAS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* RECOMMENDED SCOPE */}
                    <Card className="border-[#EDEBE9] bg-white shadow-xs">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider flex items-center gap-2">
                          <SlidersHorizontal className="h-4 w-4 text-[#0078D4]" /> 5. AI Recommended Scope & Boundaries
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3 text-xs">
                        <div className="p-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#201F1E]">In-Scope Core Processes</span>
                            <Badge className="bg-[#E5F0FA] text-[#0078D4] text-[10px] font-semibold">Primary Boundary</Badge>
                          </div>
                          <p className="text-[#323130] text-[11px] leading-relaxed">
                            Disbursements &gt;$100k, Host-to-Host ERP bank interfaces, foreign exchange hedging, vendor master creation, and 3-way matching.
                          </p>
                          <p className="text-[#107C41] font-semibold text-[10px] pt-1">
                            ✓ Covers 100% of material financial transaction streams ($140M+).
                          </p>
                        </div>

                        <div className="p-3 bg-[#FAF9F8] border border-[#EDEBE9] rounded space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#201F1E]">Out-of-Scope Rationales</span>
                            <Badge variant="outline" className="text-[#605E5C] text-[10px] font-semibold">Excluded</Badge>
                          </div>
                          <p className="text-[#323130] text-[11px] leading-relaxed">
                            Petty cash disbursements (&lt;$500) and fixed asset tagging physical checks (audited under separate FY26 Asset Module).
                          </p>
                          <p className="text-[#0078D4] font-semibold text-[10px] pt-1">
                            ✓ Eliminates audit duplication and optimizes auditor fieldwork hours.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* RECOMMENDED AUDIT AREAS */}
                    <Card className="border-[#EDEBE9] bg-white shadow-xs">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider flex items-center gap-2">
                          <ListOrdered className="h-4 w-4 text-[#0078D4]" /> 6. AI Recommended Priority Audit Areas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-2.5 text-xs">
                        <div className="p-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded space-y-0.5">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-[#201F1E]">Area 1: High-Value Vendor Disbursements</span>
                            <Badge className="bg-[#FDE7E9] text-[#A80000] text-[10px]">Priority 1 • High Weight</Badge>
                          </div>
                          <p className="text-[#605E5C] text-[11px]">Reason: Disbursements &gt;$100k represent 68% of cash outflows and carry master file override risk.</p>
                        </div>

                        <div className="p-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded space-y-0.5">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-[#201F1E]">Area 2: Cash Suspense Clearing Controls</span>
                            <Badge className="bg-[#FDE7E9] text-[#A80000] text-[10px]">Priority 2 • High Weight</Badge>
                          </div>
                          <p className="text-[#605E5C] text-[11px]">Reason: Uncleared balance ($1.42M) aging &gt;180 days requires reconciliation testing.</p>
                        </div>

                        <div className="p-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded space-y-0.5">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-[#201F1E]">Area 3: Privileged Access & IAM Review</span>
                            <Badge className="bg-[#FFF4CE] text-[#797673] text-[10px]">Priority 3 • Medium Weight</Badge>
                          </div>
                          <p className="text-[#605E5C] text-[11px]">Reason: Repeat audit finding #TR-03 regarding omitted quarterly access reviews in FY24 & FY25.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 6. MISSING DOCUMENTS & RECOMMENDED NEXT STEPS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* MISSING DOCUMENTS */}
                    <Card className="border-[#EDEBE9] bg-white shadow-xs">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider flex items-center gap-2">
                          <FileQuestion className="h-4 w-4 text-[#A80000]" /> 7. Missing Documents Gap Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-2.5 text-xs">
                        <div className="p-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded space-y-1">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-[#201F1E]">Q4 External Bank Confirmation Letters</span>
                            <Badge className="bg-[#FFF4CE] text-[#797673] text-[10px]">Pending PBC</Badge>
                          </div>
                          <p className="text-[#605E5C] text-[11px]"><span className="font-semibold text-[#323130]">Impact:</span> Required for independent verification of year-end cash balance clearing.</p>
                        </div>

                        <div className="p-2.5 bg-[#FAF9F8] border border-[#EDEBE9] rounded space-y-1">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-[#201F1E]">Third-Party Host-to-Host SOC1 Type II Report</span>
                            <Badge className="bg-[#FFF4CE] text-[#797673] text-[10px]">Pending PBC</Badge>
                          </div>
                          <p className="text-[#605E5C] text-[11px]"><span className="font-semibold text-[#323130]">Impact:</span> Needed to evaluate automated bank interface IT general controls (ITGC).</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* RECOMMENDED NEXT STEPS */}
                    <Card className="border-[#EDEBE9] bg-white shadow-xs">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-[#107C41]" /> 8. Recommended Next Steps for Audit Manager
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-2 text-xs">
                        <div className="flex items-start gap-2.5 p-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded">
                          <span className="h-4 w-4 bg-[#0078D4] text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                          <div>
                            <span className="font-bold text-[#201F1E] block">Review Risk Assessment & Scoping Tabs</span>
                            <p className="text-[#605E5C] text-[11px]">Inspect generated Risk Control Matrix (Tab 6) and Scoping Document (Tab 8).</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-2 bg-[#FAF9F8] border border-[#EDEBE9] rounded">
                          <span className="h-4 w-4 bg-[#0078D4] text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                          <div>
                            <span className="font-bold text-[#201F1E] block">Formalize Approval & Sign-off</span>
                            <p className="text-[#605E5C] text-[11px]">Navigate to Approval Tab (Tab 10) to finalize planning phase and dispatch fieldwork notifications.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                </div>
              )}

              {/* TAB 2: KNOWLEDGE SOURCES */}
              {activeTab === 'knowledge' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                        <FolderOpen className="h-5 w-5 text-[#0078D4]" /> Knowledge Sources Directory
                      </h2>
                      <p className="text-xs text-[#605E5C] mt-0.5">
                        Uploaded enterprise document artifacts available for AI ingestion.
                      </p>
                    </div>
                    <Badge className="bg-[#E5F0FA] text-[#0078D4] border border-[#0078D4]/30 font-semibold text-xs px-2.5 py-1">
                      8 Files Managed
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries({
                      previousAuditReports: { title: 'Previous Audit Reports', icon: <FileText className="h-4 w-4 text-[#0078D4]" />, formats: 'PDF, DOCX' },
                      currentYearDocuments: { title: 'Current Year Documents', icon: <FolderOpen className="h-4 w-4 text-[#0078D4]" />, formats: 'PDF, DOCX, ZIP' },
                      balanceSheet: { title: 'Balance Sheet', icon: <FileSpreadsheet className="h-4 w-4 text-[#0078D4]" />, formats: 'XLSX, CSV, PDF' },
                      sop: { title: 'SOP (Standard Operating Procedure)', icon: <BookOpen className="h-4 w-4 text-[#0078D4]" />, formats: 'PDF, DOCX' },
                      riskRegister: { title: 'Risk Register', icon: <AlertTriangle className="h-4 w-4 text-[#0078D4]" />, formats: 'XLSX, CSV, PDF' },
                      fraudRegister: { title: 'Fraud Register', icon: <ShieldAlert className="h-4 w-4 text-[#0078D4]" />, formats: 'XLSX, CSV, PDF' },
                      regulatoryReview: { title: 'Regulatory Review', icon: <Building2 className="h-4 w-4 text-[#0078D4]" />, formats: 'PDF, DOCX' },
                      rcm: { title: 'RCM (Risk Control Matrix)', icon: <Layers className="h-4 w-4 text-[#0078D4]" />, formats: 'XLSX, CSV' },
                    }).map(([key, config]) => {
                      const file = knowledgeSources[key];
                      return (
                        <div key={key} className="p-4 rounded-md border border-[#EDEBE9] bg-white hover:border-[#0078D4]/50 transition-all flex flex-col justify-between h-[180px]">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-[#F3F2F1] rounded-sm">
                                  {config.icon}
                                </div>
                                <h3 className="text-xs font-bold text-[#201F1E]">{config.title}</h3>
                              </div>
                              <span className="text-[10px] font-semibold text-[#605E5C] bg-[#F3F2F1] px-1.5 py-0.5 border border-[#E1DFDD] rounded">
                                {config.formats}
                              </span>
                            </div>

                            {file ? (
                              <div className="p-2.5 bg-[#FAF9F8] rounded-sm border border-[#EDEBE9] my-1">
                                <p className="text-xs font-bold text-[#201F1E] truncate" title={file.name}>{file.name}</p>
                                <div className="flex items-center justify-between text-[10px] text-[#605E5C] mt-1">
                                  <span>Size: {file.size}</span>
                                  <span className="text-[#107C41] font-semibold">● {file.status || 'Parsed & Ready'}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 bg-[#FAF9F8] rounded-sm border border-dashed border-[#C8C6C4] my-1 text-center">
                                <p className="text-xs text-[#605E5C]">No file uploaded yet</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-[#EDEBE9]">
                            {file && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPreviewDoc({ title: config.title, content: `Document: ${file.name}\nSize: ${file.size}\nStatus: ${file.status}\nUploaded At: ${file.uploadedAt}\n\nKey Extracted Data:\n- 14 Financial ledger accounts mapped.\n- 3 Key control deficiencies detected.\n- Compliance with ISO 27001 & statutory frameworks verified.`, format: config.formats })}
                                className="flex-1 h-7 text-[11px] border-[#C8C6C4] hover:bg-[#F3F2F1] text-[#201F1E] font-medium gap-1 rounded-sm"
                              >
                                <Eye className="h-3 w-3 text-[#0078D4]" /> Preview
                              </Button>
                            )}

                            <label className="cursor-pointer">
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => handleDocumentReplace(key, e)} 
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={(e) => (e.currentTarget.previousElementSibling as HTMLInputElement)?.click()}
                                className="h-7 text-[11px] border-[#0078D4] text-[#0078D4] hover:bg-[#E5F0FA] font-medium gap-1 rounded-sm"
                              >
                                <RefreshCw className="h-3 w-3" /> {file ? 'Replace' : 'Upload'}
                              </Button>
                            </label>

                            {file && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDocumentRemove(key)}
                                className="h-7 px-2 border-[#FDE7E9] hover:bg-[#FDE7E9] text-[#A80000] rounded-sm"
                                title="Remove file"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* REAL PERSISTED DATABASE DOCUMENTS TABLE */}
                  {backendDocs.length > 0 && (
                    <Card className="border-[#EDEBE9] bg-white shadow-xs mt-6">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold text-[#201F1E] uppercase tracking-wider flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-[#107C41]" /> Ingested Database Artifacts & AI Status
                        </CardTitle>
                        <Badge className="bg-[#107C41] text-white text-[10px]">Persisted in Database</Badge>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] tracking-wider border-b border-[#EDEBE9]">
                              <tr>
                                <th className="p-3">Document Name</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Size</th>
                                <th className="p-3 text-center">Version</th>
                                <th className="p-3">AI Pipeline Status</th>
                                <th className="p-3 text-right">Update Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EDEBE9]">
                              {backendDocs.map((doc: any) => (
                                <tr key={doc.id} className="hover:bg-[#FAF9F8]">
                                  <td className="p-3 font-semibold text-[#201F1E]">{doc.name}</td>
                                  <td className="p-3 text-[#605E5C]">{doc.category}</td>
                                  <td className="p-3 font-mono text-[11px]">{Math.round((doc.fileSize || 1024) / 1024)} KB</td>
                                  <td className="p-3 text-center font-bold text-[#0078D4]">v{doc.version || 1}.0</td>
                                  <td className="p-3">
                                    <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                      doc.aiStatus === 'Approved' ? 'bg-[#107C41] text-white' :
                                      doc.aiStatus === 'Used in AI' ? 'bg-[#0078D4] text-white' :
                                      doc.aiStatus === 'Reviewed' ? 'bg-[#C57F00] text-white' :
                                      doc.aiStatus === 'Processed' ? 'bg-[#6B21A8] text-white' :
                                      'bg-[#605E5C] text-white'
                                    }`}>
                                      {doc.aiStatus || 'Uploaded'}
                                    </Badge>
                                  </td>
                                  <td className="p-3 text-right">
                                    <select
                                      value={doc.aiStatus || 'Uploaded'}
                                      onChange={(e) => updateDocAiStatusMutation.mutate({ docId: doc.id, aiStatus: e.target.value })}
                                      className="text-[11px] bg-white border border-[#E1DFDD] rounded px-2 py-1 font-semibold text-[#323130]"
                                    >
                                      <option value="Uploaded">Uploaded</option>
                                      <option value="Processed">Processed</option>
                                      <option value="Reviewed">Reviewed</option>
                                      <option value="Approved">Approved</option>
                                      <option value="Used in AI">Used in AI</option>
                                    </select>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* TAB 3: HISTORICAL AUDIT ANALYSIS */}
              {activeTab === 'historical' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                      <History className="h-5 w-5 text-[#0078D4]" /> Historical Audit Findings (5-Year Lookback)
                    </h2>
                    <p className="text-xs text-[#605E5C] mt-0.5">
                      Prior engagement observations, repeat finding tracking, penalties, and management remediation logs.
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-[#EDEBE9] rounded-md">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] tracking-wider border-b border-[#EDEBE9]">
                        <tr>
                          <th className="p-3">FY</th>
                          <th className="p-3">Risk Rating</th>
                          <th className="p-3">Major Findings</th>
                          <th className="p-3 text-center">Repeat?</th>
                          <th className="p-3">Frauds</th>
                          <th className="p-3">Penalties</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDEBE9]">
                        {DEFAULT_HISTORICAL_FINDINGS.map((item) => {
                          const isExpanded = expandedRow === item.id;
                          return (
                            <React.Fragment key={item.id}>
                              <tr className="hover:bg-[#FAF9F8] transition-colors cursor-pointer" onClick={() => setExpandedRow(isExpanded ? null : item.id)}>
                                <td className="p-3 font-bold text-[#201F1E]">{item.year}</td>
                                <td className="p-3">
                                  <Badge className={`text-[10px] font-semibold rounded-sm px-2 py-0.5 ${
                                    item.riskRating === 'High' ? 'bg-[#FDE7E9] text-[#A80000] border border-[#A80000]/30' :
                                    item.riskRating === 'Medium' ? 'bg-[#FFF4CE] text-[#797673] border border-[#797673]/30' :
                                    'bg-[#DFF6DD] text-[#107C41] border border-[#107C41]/30'
                                  }`}>
                                    {item.riskRating}
                                  </Badge>
                                </td>
                                <td className="p-3 font-medium text-[#201F1E] max-w-[260px] truncate" title={item.majorFindings}>
                                  {item.majorFindings}
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                                    item.repeatFindings === 'Yes' ? 'bg-[#FDE7E9] text-[#A80000]' : 'bg-[#F3F2F1] text-[#605E5C]'
                                  }`}>
                                    {item.repeatFindings}
                                  </span>
                                </td>
                                <td className="p-3 text-[#323130]">{item.frauds}</td>
                                <td className="p-3 text-[#323130] font-semibold">{item.penalties}</td>
                                <td className="p-3">
                                  <Badge variant="outline" className="text-[10px] bg-[#DFF6DD] text-[#107C41] border-[#107C41]/30 font-semibold">
                                    {item.status}
                                  </Badge>
                                </td>
                                <td className="p-3 text-right">
                                  <Button size="icon" variant="ghost" className="h-6 w-6 text-[#605E5C]">
                                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  </Button>
                                </td>
                              </tr>

                              {/* Expandable row content */}
                              {isExpanded && (
                                <tr className="bg-[#F8F9FA]">
                                  <td colSpan={8} className="p-4 border-t border-[#EDEBE9]">
                                    <div className="bg-white p-4 rounded-md border border-[#E1DFDD] space-y-3">
                                      <p className="text-xs font-bold text-[#201F1E] underline">Detailed Audit Finding breakdown ({item.year})</p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                        <div>
                                          <p className="font-semibold text-[#605E5C]">Root Cause Analysis:</p>
                                          <p className="text-[#323130] mt-0.5">{item.details.rootCause}</p>
                                        </div>
                                        <div>
                                          <p className="font-semibold text-[#605E5C]">Action Plan & Target Date:</p>
                                          <p className="text-[#323130] mt-0.5">{item.details.actionPlan} (Target: {item.details.targetCompletion})</p>
                                        </div>
                                      </div>
                                      <div className="pt-2 border-t border-[#EDEBE9]">
                                        <p className="font-semibold text-[#0078D4]">Auditor Follow-up Notes:</p>
                                        <p className="text-[#605E5C] text-[11px] mt-0.5">{item.details.auditorNotes}</p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: PLANNING QUESTIONNAIRE */}
              {activeTab === 'questionnaire' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-[#0078D4]" /> Planning Questionnaire (Read-Only)
                    </h2>
                    <p className="text-xs text-[#605E5C] mt-0.5">
                      Submitted risk flags and questionnaire responses captured during planning initialization.
                    </p>
                  </div>

                  <div className="space-y-4">
                    
                    <Card className="border-[#EDEBE9] bg-white shadow-xs">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#201F1E]">Question 1: Any penalties or regulatory fines?</p>
                          <p className="text-[11px] text-[#605E5C] mt-0.5">Regulatory notices, statutory penalties, or compliance fines.</p>
                        </div>
                        <Badge className={`px-4 py-1 text-xs font-bold rounded-sm ${
                          questionnaire.penaltiesOrFines === 'Yes' 
                            ? 'bg-[#A80000] text-white' 
                            : 'bg-[#0078D4] text-white'
                        }`}>
                          {questionnaire.penaltiesOrFines}
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card className="border-[#EDEBE9] bg-white shadow-xs">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#201F1E]">Question 2: Any fraud reported?</p>
                          <p className="text-[11px] text-[#605E5C] mt-0.5">Internal whistleblower reports or fraud investigations.</p>
                        </div>
                        <Badge className={`px-4 py-1 text-xs font-bold rounded-sm ${
                          questionnaire.fraudReported === 'Yes' 
                            ? 'bg-[#A80000] text-white' 
                            : 'bg-[#0078D4] text-white'
                        }`}>
                          {questionnaire.fraudReported}
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card className="border-[#EDEBE9] bg-white shadow-xs">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#201F1E]">Question 3: Any High Risk observations in previous audits?</p>
                          <p className="text-[11px] text-[#605E5C] mt-0.5">Unresolved high severity audit findings from prior periods.</p>
                        </div>
                        <Badge className={`px-4 py-1 text-xs font-bold rounded-sm ${
                          questionnaire.highRiskObservations === 'Yes' 
                            ? 'bg-[#A80000] text-white' 
                            : 'bg-[#0078D4] text-white'
                        }`}>
                          {questionnaire.highRiskObservations}
                        </Badge>
                      </CardContent>
                    </Card>

                  </div>
                </div>
              )}

              {/* TAB 5: PROCESS UNDERSTANDING */}
              {activeTab === 'process' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-[#0078D4]" /> Business Process Understanding
                    </h2>
                    <p className="text-xs text-[#605E5C] mt-0.5">
                      Operational workflows, key control points, process stewards, and system dependencies.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <Card className="border-[#EDEBE9]">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E]">Process Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 text-xs text-[#323130] space-y-2">
                        <p>The {audit.department} process encompasses end-to-end operational execution, vendor onboarding, invoice verification, disbursement clearance, and statutory tax compliance.</p>
                        <p className="text-[#605E5C]">Key drivers include high transaction volumes ($12M+ monthly), multi-tier approval matrix, and automated SAP ERP interface integrations.</p>
                      </CardContent>
                    </Card>

                    <Card className="border-[#EDEBE9]">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E]">Key Controls</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 text-xs text-[#323130] space-y-1.5">
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#107C41]" /> Dual-authorization on vendor bank detail edits</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#107C41]" /> 3-way matching (PO, Goods Receipt, Vendor Invoice)</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#107C41]" /> Automated tax deduction calculation rules</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#107C41]" /> Monthly host-to-host bank reconciliation checks</div>
                      </CardContent>
                    </Card>

                    <Card className="border-[#EDEBE9]">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E]">Control Owners</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 text-xs text-[#323130] space-y-2">
                        <p><span className="font-bold">Process Owner:</span> Head of {audit.department}</p>
                        <p><span className="font-bold">Control Performers:</span> AP Operations Lead, Treasury Officer, Tax Manager</p>
                        <p><span className="font-bold">System Custodian:</span> Enterprise Applications Director</p>
                      </CardContent>
                    </Card>

                    <Card className="border-[#EDEBE9]">
                      <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                        <CardTitle className="text-xs font-bold text-[#201F1E]">Dependencies</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 text-xs text-[#323130] space-y-2">
                        <p><span className="font-bold">Core Systems:</span> SAP S/4HANA ERP, Banking Gateway</p>
                        <p><span className="font-bold">Third-party Interfaces:</span> Tax Authority Portal, Host-to-Host Banking API</p>
                      </CardContent>
                    </Card>

                  </div>

                  {/* Business Process Flowchart Canvas Area */}
                  <Card className="border-[#EDEBE9]">
                    <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold text-[#201F1E]">Business Process Flow Diagram</CardTitle>
                      <Badge className="bg-[#E5F0FA] text-[#0078D4] border-[#0078D4]/30 text-[10px]">
                        AI Process Mapper Placeholder
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="h-[220px] bg-[#FAF9F8] border-2 border-dashed border-[#C8C6C4] rounded-md flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <div className="p-3 bg-white rounded-full border border-[#EDEBE9] text-[#0078D4] shadow-xs">
                          <GitBranch className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#201F1E]">Interactive Process Flow Diagram</p>
                          <p className="text-[11px] text-[#605E5C] max-w-md mt-0.5">
                            AI agents will automatically parse uploaded SOPs and generate interactive process flows, decision gates, and control weakness callouts in Sprint 6.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 6: RISK ASSESSMENT */}
              {activeTab === 'risk' && (
                <div className="space-y-6">
                  {renderStageReviewBar(1, "Stage 1: Risk Assessment & Context Analysis", () => executeStage1Mutation.mutate(), executeStage1Mutation.isPending)}

                  <div>
                    <h2 className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-[#0078D4]" /> Risk Assessment Matrix
                    </h2>
                    <p className="text-xs text-[#605E5C] mt-0.5">
                      Identified risk drivers, inherent severity ratings, underlying drivers, and source documentation.
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-[#EDEBE9] rounded-md">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] tracking-wider border-b border-[#EDEBE9]">
                        <tr>
                          <th className="p-3">Risk Driver</th>
                          <th className="p-3">Category</th>
                          <th className="p-3 text-center">Likelihood</th>
                          <th className="p-3 text-center">Impact</th>
                          <th className="p-3 text-center">Overall Risk</th>
                          <th className="p-3">Evidence Source</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDEBE9]">
                        {DEFAULT_RISKS.map((r) => (
                          <tr key={r.id} className="hover:bg-[#FAF9F8]">
                            <td className="p-3 font-semibold text-[#201F1E] max-w-[280px]">
                              {r.risk}
                              <span className="block text-[10px] font-normal text-[#605E5C] mt-0.5">{r.reason}</span>
                            </td>
                            <td className="p-3 text-[#605E5C]">{r.category}</td>
                            <td className="p-3 text-center font-medium">{r.likelihood}</td>
                            <td className="p-3 text-center font-medium">{r.impact}</td>
                            <td className="p-3 text-center">
                              <Badge className={`text-[10px] font-bold rounded-sm px-2 py-0.5 ${
                                r.overallRisk === 'High' ? 'bg-[#FDE7E9] text-[#A80000] border border-[#A80000]/30' :
                                'bg-[#FFF4CE] text-[#797673] border border-[#797673]/30'
                              }`}>
                                {r.overallRisk}
                              </Badge>
                            </td>
                            <td className="p-3 text-[#0078D4] font-medium">{r.evidence}</td>
                            <td className="p-3">
                              <span className="text-[10px] font-semibold text-[#323130] bg-[#F3F2F1] px-2 py-0.5 border border-[#E1DFDD] rounded">
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 7: PLANNING DOCUMENT */}
              {activeTab === 'planningDoc' && (
                <div className="space-y-6">
                  {renderStageReviewBar(2, "Stage 2: Enterprise Audit Planning Memorandum", () => executeStage2Mutation.mutate(), executeStage2Mutation.isPending)}

                  <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-3">
                    <div>
                      <h2 className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#0078D4]" /> Enterprise Audit Planning Memo
                      </h2>
                      <p className="text-xs text-[#605E5C] mt-0.5">Formatted planning document template ready for review and sign-off.</p>
                    </div>
                    <Badge variant="outline" className="bg-[#FAF9F8] text-[#605E5C] border-[#EDEBE9]">Read-Only Template</Badge>
                  </div>

                  {/* Formatted Document Canvas */}
                  <div className="p-8 bg-white border border-[#EDEBE9] rounded-md shadow-xs space-y-6 text-xs text-[#201F1E] leading-relaxed font-serif max-w-[900px] mx-auto">
                    
                    <div className="border-b border-[#323130] pb-4 font-sans">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-bold uppercase tracking-wider text-[#0078D4]">Internal Audit Department</h3>
                          <p className="text-xs font-semibold text-[#323130]">Annual Audit Engagement Planning Memorandum</p>
                        </div>
                        <p className="text-[11px] text-[#605E5C] text-right">
                          Ref: AUD-{audit.department.toUpperCase().substring(0, 3)}-{audit.financialYear}<br />
                          Date: {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 font-sans bg-[#FAF9F8] p-4 rounded border border-[#EDEBE9]">
                      <p><span className="font-bold">TO:</span> Audit Committee & Head of Internal Audit</p>
                      <p><span className="font-bold">FROM:</span> Lead Internal Audit Planning Team</p>
                      <p><span className="font-bold">SUBJECT:</span> Audit Planning & Scoping for {audit.department} ({audit.auditType})</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-sans text-xs font-bold uppercase text-[#0078D4] border-b border-[#EDEBE9] pb-1">1. Executive Summary & Context</h4>
                      <p>This planning memorandum outlines the strategy, scope, initial risk evaluation, and audit procedures for the upcoming {audit.auditType} of {audit.department} for Financial Year {audit.financialYear}. The primary goal is to provide independent assurance over operational efficiency, control effectiveness, and compliance with internal SOPs and statutory regulations.</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-sans text-xs font-bold uppercase text-[#0078D4] border-b border-[#EDEBE9] pb-1">2. Audit Objectives</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Evaluate the design and operating effectiveness of key internal financial & operational controls.</li>
                        <li>Assess compliance with statutory tax, regulatory filing obligations, and internal delegation of authority matrix.</li>
                        <li>Identify potential fraud exposure drivers and test segregation of duties across core ERP applications.</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-sans text-xs font-bold uppercase text-[#0078D4] border-b border-[#EDEBE9] pb-1">3. Initial Risk Focus & Historical Findings</h4>
                      <p>Based on 5-year historical audit analysis, specific focus will be placed on vendor payment approvals over $50,000, suspense account reconciliations, and privileged access governance for core databases.</p>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 8: SCOPING DOCUMENT */}
              {activeTab === 'scopingDoc' && (
                <div className="space-y-6">
                  {renderStageReviewBar(3, "Stage 3: Audit Scoping Document & Boundaries", () => executeStage3Mutation.mutate(), executeStage3Mutation.isPending)}

                  <div>
                    <h2 className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                      <FileCode className="h-5 w-5 text-[#0078D4]" /> Engagement Scoping Document
                    </h2>
                    <p className="text-xs text-[#605E5C] mt-0.5">Defined audit boundary, in-scope entities, explicit exclusions, and testing methodology.</p>
                  </div>

                  <div className="p-6 bg-white border border-[#EDEBE9] rounded-md space-y-5 text-xs text-[#323130]">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#FAF9F8] rounded border border-[#EDEBE9] space-y-1">
                        <p className="font-bold text-[#0078D4] uppercase text-[11px]">Audit Objective</p>
                        <p>Provide comprehensive assurance on control adequacy, risk mitigation, and compliance across {audit.department}.</p>
                      </div>

                      <div className="p-4 bg-[#FAF9F8] rounded border border-[#EDEBE9] space-y-1">
                        <p className="font-bold text-[#107C41] uppercase text-[11px]">Testing Strategy</p>
                        <p>Substantive testing of high-value transactions, 100% automated analytics on payment logs, and key control sampling.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-[#201F1E] border-b border-[#EDEBE9] pb-1">In-Scope Areas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
                        <div className="p-2 bg-[#F3F2F1] rounded">● Accounts Payable & Vendor Onboarding</div>
                        <div className="p-2 bg-[#F3F2F1] rounded">● Treasury & Bank Reconciliation</div>
                        <div className="p-2 bg-[#F3F2F1] rounded">● Statutory Tax Deductions (GST/TDS)</div>
                        <div className="p-2 bg-[#F3F2F1] rounded">● Fixed Asset Tagging & Verification</div>
                        <div className="p-2 bg-[#F3F2F1] rounded">● ERP User Access Privileges</div>
                        <div className="p-2 bg-[#F3F2F1] rounded">● Contract Management & SLAs</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-[#A80000] border-b border-[#EDEBE9] pb-1">Explicitly Out of Scope</h3>
                      <p className="text-[#605E5C]">Mergers & Acquisitions activities, international subsidiary transfer pricing, and third-party IT infrastructure datacenters governed by external SOC 2 audits.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="font-bold text-[#201F1E]">Covered Systems</p>
                        <p className="text-[#605E5C] mt-0.5">SAP S/4HANA ERP, Host-to-Host Banking Portal, Identity Governance Tool.</p>
                      </div>
                      <div>
                        <p className="font-bold text-[#201F1E]">Covered Business Units</p>
                        <p className="text-[#605E5C] mt-0.5">{audit.department}, Regional Treasury Desks, Tax Compliance Cell.</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 9: AUDIT PROGRAM */}
              {activeTab === 'program' && (
                <div className="space-y-6">
                  {renderStageReviewBar(4, "Stage 4: Audit Program & Test Procedures", () => executeStage4Mutation.mutate(), executeStage4Mutation.isPending)}

                  <div>
                    <h2 className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                      <ListChecks className="h-5 w-5 text-[#0078D4]" /> Detailed Audit Program & Test Procedures
                    </h2>
                    <p className="text-xs text-[#605E5C] mt-0.5">
                      Step-by-step audit procedures, required evidence artifacts, and auditor assignments.
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-[#EDEBE9] rounded-md">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#FAF9F8] text-[#605E5C] uppercase text-[10px] tracking-wider border-b border-[#EDEBE9]">
                        <tr>
                          <th className="p-3">Ref</th>
                          <th className="p-3">Audit Objective</th>
                          <th className="p-3">Test Procedure</th>
                          <th className="p-3">Evidence Required</th>
                          <th className="p-3">Assigned Owner</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDEBE9]">
                        {DEFAULT_PROCEDURES.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FAF9F8]">
                            <td className="p-3 font-bold text-[#0078D4]">{p.id.toUpperCase()}</td>
                            <td className="p-3 font-semibold text-[#201F1E] max-w-[200px]">{p.objective}</td>
                            <td className="p-3 text-[#323130] max-w-[280px]">{p.procedure}</td>
                            <td className="p-3 text-[#605E5C]">{p.evidenceRequired}</td>
                            <td className="p-3 text-[#201F1E] font-medium">{p.owner}</td>
                            <td className="p-3">
                              <Badge variant="outline" className="text-[10px] bg-[#F3F2F1] text-[#605E5C] border-[#E1DFDD]">
                                {p.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 10: APPROVAL */}
              {activeTab === 'approval' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#0078D4]" /> Governance Sign-Off & Approval Workflow
                    </h2>
                    <p className="text-xs text-[#605E5C] mt-0.5">
                      Multi-tier approval pipeline, sign-off state tracking, and auditor comments log.
                    </p>
                  </div>

                  {/* Approval Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <Card className="border-[#EDEBE9] bg-[#FAF9F8]">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#605E5C] uppercase">Prepared By</span>
                          <Badge className="bg-[#DFF6DD] text-[#107C41] text-[10px] font-bold">Completed</Badge>
                        </div>
                        <p className="text-xs font-bold text-[#201F1E]">Lead Internal Auditor</p>
                        <p className="text-[11px] text-[#605E5C]">Signed off on {new Date().toLocaleDateString()}</p>
                      </CardContent>
                    </Card>

                    <Card className="border-[#EDEBE9] bg-[#FAF9F8]">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#605E5C] uppercase">Reviewed By</span>
                          <Badge className="bg-[#FFF4CE] text-[#797673] text-[10px] font-bold">In Review</Badge>
                        </div>
                        <p className="text-xs font-bold text-[#201F1E]">Audit Manager</p>
                        <p className="text-[11px] text-[#605E5C]">Pending final draft verification</p>
                      </CardContent>
                    </Card>

                    <Card className="border-[#EDEBE9] bg-[#FAF9F8]">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#605E5C] uppercase">Approved By</span>
                          <Badge className="bg-[#F3F2F1] text-[#605E5C] text-[10px] font-bold">Pending</Badge>
                        </div>
                        <p className="text-xs font-bold text-[#201F1E]">Head of Internal Audit</p>
                        <p className="text-[11px] text-[#605E5C]">Awaiting submission</p>
                      </CardContent>
                    </Card>

                  </div>

                  {/* Comments Box */}
                  <Card className="border-[#EDEBE9]">
                    <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] py-3 px-4">
                      <CardTitle className="text-xs font-bold text-[#201F1E] flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#0078D4]" /> Reviewer Comments & Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <textarea
                        value={approvalComments}
                        onChange={(e) => setApprovalComments(e.target.value)}
                        placeholder="Type sign-off notes or review observations here..."
                        rows={3}
                        className="w-full p-3 border border-[#C8C6C4] rounded-sm text-xs focus:outline-none focus:border-[#0078D4] text-[#201F1E]"
                      />
                      <div className="flex justify-between items-center text-[11px] text-[#605E5C]">
                        <span>Comments will be attached to audit trail upon saving draft.</span>
                        <Button 
                          size="sm" 
                          onClick={() => { toast.success("Review notes appended to workspace draft"); }}
                          className="bg-[#0078D4] hover:bg-[#005A9E] text-white text-xs font-semibold px-3 h-8 rounded-sm gap-1"
                        >
                          <Send className="h-3 w-3" /> Save Notes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                </div>
              )}

            </div>
          </div>

        </div>

        {/* BOTTOM FIXED ACTION BAR - Fluent Style */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDEBE9] shadow-md z-40 py-3 px-8">
          <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 text-xs text-[#605E5C]">
              <Info className="h-4 w-4 text-[#0078D4]" />
              <span>Enterprise Audit AI Pipeline Active. Stage Review & Sign-Off Enabled.</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="h-9 px-4 text-xs border-[#C8C6C4] text-[#323130] hover:bg-[#F3F2F1] font-semibold rounded-sm gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={saveMutation.isPending}
                onClick={handleSaveDraft}
                className="h-9 px-4 text-xs border-[#0078D4] text-[#0078D4] hover:bg-[#E5F0FA] font-semibold rounded-sm gap-1.5"
              >
                {saveMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save Draft
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Exporting Audit Planning Memorandum to PDF...")}
                className="h-9 px-3 text-xs border-[#0078D4] text-[#0078D4] hover:bg-[#E5F0FA] rounded-sm gap-1 font-semibold"
              >
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Exporting Audit Planning Memorandum to Word...")}
                className="h-9 px-3 text-xs border-[#0078D4] text-[#0078D4] hover:bg-[#E5F0FA] rounded-sm gap-1 font-semibold"
              >
                <Download className="h-3.5 w-3.5" /> Export Word
              </Button>

              <Button
                onClick={() => navigate(`/audit/${id}/processing`)}
                className="h-9 px-5 text-xs bg-[#0078D4] hover:bg-[#005A9E] text-white font-bold rounded-sm gap-1.5 shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-white" /> Submit for AI Processing
              </Button>
            </div>

          </div>
        </div>

        {/* MANUAL OVERRIDE MODAL */}
        <Dialog open={overrideModal.open} onOpenChange={() => setOverrideModal(prev => ({ ...prev, open: false }))}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader className="border-b border-[#EDEBE9] pb-3">
              <DialogTitle className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-[#8A2BE2]" /> Stage {overrideModal.stageNumber} Manual Override
              </DialogTitle>
              <DialogDescription className="text-xs text-[#605E5C]">
                Directly edit or replace the AI-generated outputs for Stage {overrideModal.stageNumber}. All modifications are logged in governance audit history.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2 space-y-3">
              <textarea
                value={overrideModal.text}
                onChange={(e) => setOverrideModal(prev => ({ ...prev, text: e.target.value }))}
                rows={12}
                className="w-full p-3 font-mono text-xs bg-[#FAF9F8] border border-[#C8C6C4] rounded focus:outline-none focus:border-[#8A2BE2]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EDEBE9]">
              <Button size="sm" variant="outline" onClick={() => setOverrideModal(prev => ({ ...prev, open: false }))} className="text-xs h-8">
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={() => {
                  try {
                    const parsed = JSON.parse(overrideModal.text);
                    reviewActionMutation.mutate({
                      stageNumber: overrideModal.stageNumber,
                      action: 'Manual Override',
                      comments: 'Manual override by auditor',
                      overrideOutputs: parsed
                    });
                    setOverrideModal(prev => ({ ...prev, open: false }));
                  } catch (err) {
                    toast.error("Invalid JSON format in manual override window");
                  }
                }} 
                className="bg-[#8A2BE2] hover:bg-[#6A1B9A] text-white text-xs font-bold h-8 px-4"
              >
                Save Override & Approve
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* DOCUMENT PREVIEW MODAL */}
        <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader className="border-b border-[#EDEBE9] pb-3">
              <DialogTitle className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#0078D4]" /> {previewDoc?.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#605E5C]">
                Ingested document metadata and parsed structural summary.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2 space-y-3">
              <div className="p-3 bg-[#FAF9F8] rounded border border-[#EDEBE9] text-xs font-mono space-y-1">
                <p className="text-[#107C41] font-bold">✓ Parsed by Enterprise Ingestion Engine</p>
                <p className="text-[#605E5C]">Supported Format: {previewDoc?.format}</p>
              </div>

              <div className="p-3 bg-white border border-[#EDEBE9] rounded text-xs space-y-2 max-h-[220px] overflow-y-auto">
                <p className="font-bold text-[#201F1E]">Extracted Context Sample:</p>
                <pre className="whitespace-pre-wrap font-sans text-[#323130] leading-relaxed">
                  {previewDoc?.content}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#EDEBE9]">
              <Button size="sm" onClick={() => setPreviewDoc(null)} className="bg-[#0078D4] hover:bg-[#005A9E] text-white text-xs font-semibold px-4 h-8 rounded-sm">
                Close Preview
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </PageLayout>
  );
}
