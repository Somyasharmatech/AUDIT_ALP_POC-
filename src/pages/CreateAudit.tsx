import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { 
  Loader2, 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  RefreshCw, 
  AlertCircle,
  FolderOpen,
  HelpCircle,
  FileSpreadsheet,
  ShieldAlert,
  BookOpen,
  Building2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { ApiClient } from '@/src/lib/api';

const schema = z.object({
  financialYear: z.enum(['2028-29', '2027-28', '2026-27', '2025-26']),
  auditType: z.enum([
    'Operational Audit',
    'Financial Audit',
    'Compliance Audit',
    'Information Technology Audit',
    'Strategic Audit'
  ]),
  department: z.enum([
    'Finance & Treasury',
    'Information Technology',
    'Human Resources',
    'Operations',
    'Legal & Compliance'
  ]),
  penaltiesOrFines: z.enum(['Yes', 'No']),
  fraudReported: z.enum(['Yes', 'No']),
  highRiskObservations: z.enum(['Yes', 'No'])
});

type FormData = z.infer<typeof schema>;

interface UploadedFile {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

interface KnowledgeCardConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  supportedTypes: string;
}

const KNOWLEDGE_CARDS: KnowledgeCardConfig[] = [
  {
    id: 'previousAuditReports',
    title: 'Previous Audit Reports',
    description: 'Prior year engagement findings, audit ratings, and recommendation tracking history.',
    icon: <FileText className="h-5 w-5 text-[#0078D4]" />,
    supportedTypes: 'PDF, DOCX'
  },
  {
    id: 'currentYearDocuments',
    title: 'Current Year Documents',
    description: 'Updated operating plans, organizational charts, minutes, and current policies.',
    icon: <FolderOpen className="h-5 w-5 text-[#0078D4]" />,
    supportedTypes: 'PDF, DOCX, ZIP'
  },
  {
    id: 'balanceSheet',
    title: 'Balance Sheet',
    description: 'Trial balances, sub-ledger details, asset registers, and financial statements.',
    icon: <FileSpreadsheet className="h-5 w-5 text-[#0078D4]" />,
    supportedTypes: 'XLSX, CSV, PDF'
  },
  {
    id: 'sop',
    title: 'SOP (Standard Operating Procedure)',
    description: 'Standard operating workflows, process maps, and desktop manuals.',
    icon: <BookOpen className="h-5 w-5 text-[#0078D4]" />,
    supportedTypes: 'PDF, DOCX'
  },
  {
    id: 'riskRegister',
    title: 'Risk Register',
    description: 'Enterprise & operational risk logs, severity scores, and risk appetite statements.',
    icon: <AlertCircle className="h-5 w-5 text-[#0078D4]" />,
    supportedTypes: 'XLSX, CSV, PDF'
  },
  {
    id: 'fraudRegister',
    title: 'Fraud Register',
    description: 'Whistleblower logs, incident reports, hotline summaries, and investigation files.',
    icon: <ShieldAlert className="h-5 w-5 text-[#0078D4]" />,
    supportedTypes: 'XLSX, CSV, PDF'
  },
  {
    id: 'regulatoryReview',
    title: 'Regulatory Review',
    description: 'Compliance inspection reports, regulatory correspondence, and penalty notices.',
    icon: <Building2 className="h-5 w-5 text-[#0078D4]" />,
    supportedTypes: 'PDF, DOCX'
  },
  {
    id: 'rcm',
    title: 'RCM (Risk Control Matrix)',
    description: 'Key control mappings, risk drivers, testing frequency, and control owners.',
    icon: <Layers className="h-5 w-5 text-[#0078D4]" />,
    supportedTypes: 'XLSX, CSV'
  }
];

export default function CreateAudit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Knowledge Sources upload states mapping card ID -> UploadedFile | null
  const [uploads, setUploads] = useState<Record<string, UploadedFile | null>>({
    previousAuditReports: null,
    currentYearDocuments: null,
    balanceSheet: null,
    sop: null,
    riskRegister: null,
    fraudRegister: null,
    regulatoryReview: null,
    rcm: null
  });

  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      financialYear: '2026-27',
      auditType: 'Operational Audit',
      department: 'Finance & Treasury',
      penaltiesOrFines: 'No',
      fraudReported: 'No',
      highRiskObservations: 'No'
    }
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => ApiClient.post('/audits', payload),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      toast.success("Audit created! Opening AI Document Review Workspace...");
      navigate(`/audit/${data.id}/review`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save audit planning request");
    }
  });

  const handleFileUpload = (cardId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingState(prev => ({ ...prev, [cardId]: true }));

    // Simulate fast enterprise document upload / parsing
    setTimeout(() => {
      const fileSizeFormatted = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      setUploads(prev => ({
        ...prev,
        [cardId]: {
          name: file.name,
          size: fileSizeFormatted,
          type: file.type || 'Document',
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      }));

      setUploadingState(prev => ({ ...prev, [cardId]: false }));
      toast.success(`Uploaded ${file.name}`);
    }, 600);
  };

  const handleRemoveFile = (cardId: string) => {
    setUploads(prev => ({ ...prev, [cardId]: null }));
    toast.info("Document removed from knowledge sources");
  };

  const onSubmit = (data: FormData) => {
    const payload = {
      financialYear: data.financialYear,
      auditType: data.auditType,
      department: data.department,
      knowledgeSources: uploads,
      questionnaire: {
        penaltiesOrFines: data.penaltiesOrFines,
        fraudReported: data.fraudReported,
        highRiskObservations: data.highRiskObservations
      },
      status: 'Planning'
    };

    mutation.mutate(payload);
  };

  return (
    <PageLayout>
      <div className="p-8 max-w-[1400px] mx-auto min-h-screen flex flex-col space-y-8 bg-[#F8F9FA] text-[#323130]">
        
        {/* Top Header - Fluent Style */}
        <div className="flex items-center justify-between bg-white p-6 rounded-md border border-[#EDEBE9] shadow-sm">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/dashboard')} 
              className="h-9 w-9 border-[#E1DFDD] hover:bg-[#F3F2F1] text-[#605E5C] rounded-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#201F1E] flex items-center gap-2">
                Create Audit Planning
              </h1>
              <p className="text-xs text-[#605E5C] mt-0.5">
                AI-driven audit scoping and knowledge source ingestion center.
              </p>
            </div>
          </div>
          <Badge className="bg-[#E5F0FA] text-[#0078D4] border border-[#0078D4]/30 px-3 py-1 font-medium text-xs rounded-sm gap-1">
            <Sparkles className="h-3.5 w-3.5 text-[#0078D4]" /> Auto-Naming Enabled
          </Badge>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* SECTION 1: Core Parameters (Financial Year, Audit Type, Department) */}
          <Card className="rounded-md border border-[#EDEBE9] shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] px-6 py-4">
              <CardTitle className="text-sm font-semibold text-[#201F1E] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0078D4]" /> Scoping Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Financial Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#323130] flex items-center gap-1">
                    Financial Year <span className="text-[#A80000]">*</span>
                  </label>
                  <select
                    {...register("financialYear")}
                    className={`w-full h-10 px-3 rounded-sm border ${errors.financialYear ? 'border-[#A80000]' : 'border-[#C8C6C4]'} bg-white text-xs font-medium text-[#201F1E] focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4]`}
                  >
                    <option value="2028-29">2028-29</option>
                    <option value="2027-28">2027-28</option>
                    <option value="2026-27">2026-27</option>
                    <option value="2025-26">2025-26</option>
                  </select>
                  {errors.financialYear && (
                    <p className="text-[11px] text-[#A80000]">{errors.financialYear.message}</p>
                  )}
                </div>

                {/* Audit Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#323130] flex items-center gap-1">
                    Audit Type <span className="text-[#A80000]">*</span>
                  </label>
                  <select
                    {...register("auditType")}
                    className={`w-full h-10 px-3 rounded-sm border ${errors.auditType ? 'border-[#A80000]' : 'border-[#C8C6C4]'} bg-white text-xs font-medium text-[#201F1E] focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4]`}
                  >
                    <option value="Operational Audit">Operational Audit</option>
                    <option value="Financial Audit">Financial Audit</option>
                    <option value="Compliance Audit">Compliance Audit</option>
                    <option value="Information Technology Audit">Information Technology Audit</option>
                    <option value="Strategic Audit">Strategic Audit</option>
                  </select>
                  {errors.auditType && (
                    <p className="text-[11px] text-[#A80000]">{errors.auditType.message}</p>
                  )}
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#323130] flex items-center gap-1">
                    Department <span className="text-[#A80000]">*</span>
                  </label>
                  <select
                    {...register("department")}
                    className={`w-full h-10 px-3 rounded-sm border ${errors.department ? 'border-[#A80000]' : 'border-[#C8C6C4]'} bg-white text-xs font-medium text-[#201F1E] focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4]`}
                  >
                    <option value="Finance & Treasury">Finance & Treasury</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                  </select>
                  {errors.department && (
                    <p className="text-[11px] text-[#A80000]">{errors.department.message}</p>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>

          {/* SECTION 2: Knowledge Sources */}
          <Card className="rounded-md border border-[#EDEBE9] shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] px-6 py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#201F1E] flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-[#0078D4]" /> Knowledge Sources
                </CardTitle>
                <p className="text-xs text-[#605E5C] mt-1">
                  Upload relevant enterprise artifacts to feed the AI planning engine. Upload cards occupy the primary workspace below.
                </p>
              </div>
              <Badge className="bg-[#F3F2F1] text-[#323130] border border-[#E1DFDD] font-semibold text-xs px-2.5 py-1">
                8 Document Types
              </Badge>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
                {KNOWLEDGE_CARDS.map((card) => {
                  const uploadedFile = uploads[card.id];
                  const isUploading = uploadingState[card.id];

                  return (
                    <div 
                      key={card.id} 
                      className={`p-5 rounded-md border transition-all flex flex-col justify-between h-[280px] bg-white ${
                        uploadedFile 
                          ? 'border-[#107C41] bg-[#F3F9F5]/30 shadow-sm' 
                          : 'border-[#E1DFDD] hover:border-[#0078D4]/60'
                      }`}
                    >
                      {/* Top Header info */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#F3F2F1] rounded-sm shrink-0">
                              {card.icon}
                            </div>
                            <h3 className="text-xs font-bold text-[#201F1E] leading-tight">
                              {card.title}
                            </h3>
                          </div>
                          <div>
                            {isUploading ? (
                              <Badge variant="outline" className="text-[10px] bg-[#FFF4CE] text-[#797673] border-[#FFE699] font-medium gap-1">
                                <Loader2 className="h-3 w-3 animate-spin text-[#0078D4]" /> Uploading
                              </Badge>
                            ) : uploadedFile ? (
                              <Badge className="text-[10px] bg-[#DFF6DD] text-[#107C41] border border-[#107C41]/30 font-semibold gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Uploaded
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] bg-[#F3F2F1] text-[#605E5C] border-[#E1DFDD]">
                                Empty
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-[#605E5C] leading-snug line-clamp-3 mb-3">
                          {card.description}
                        </p>
                      </div>

                      {/* Middle Body: Uploaded file info or supported formats */}
                      <div className="my-2 p-3 rounded-sm bg-[#FAF9F8] border border-[#EDEBE9]">
                        {uploadedFile ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold text-[#201F1E]">
                              <span className="truncate max-w-[180px]" title={uploadedFile.name}>
                                {uploadedFile.name}
                              </span>
                              <span className="text-[10px] font-medium text-[#605E5C] bg-white border border-[#E1DFDD] px-1.5 py-0.5 rounded">
                                {uploadedFile.size}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#107C41] font-medium flex items-center gap-1">
                              Ready for AI extraction • {uploadedFile.uploadedAt}
                            </p>
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#605E5C] flex items-center justify-between">
                            <span>Supported files:</span>
                            <span className="font-semibold text-[#323130] bg-white px-1.5 py-0.5 border border-[#E1DFDD] rounded text-[10px]">
                              {card.supportedTypes}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="pt-2 border-t border-[#EDEBE9]">
                        <input 
                          type="file" 
                          id={`file-input-${card.id}`}
                          className="hidden" 
                          onChange={(e) => handleFileUpload(card.id, e)}
                          accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.zip,.png,.jpg"
                        />

                        {uploadedFile ? (
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById(`file-input-${card.id}`)?.click()}
                              className="flex-1 h-8 text-[11px] border-[#C8C6C4] hover:bg-[#F3F2F1] text-[#201F1E] font-medium rounded-sm gap-1"
                            >
                              <RefreshCw className="h-3 w-3 text-[#0078D4]" /> Replace File
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveFile(card.id)}
                              className="h-8 px-2.5 text-[11px] border-[#FDE7E9] hover:bg-[#FDE7E9] text-[#A80000] font-medium rounded-sm"
                              title="Remove file"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isUploading}
                            onClick={() => document.getElementById(`file-input-${card.id}`)?.click()}
                            className="w-full h-8 text-xs border-[#0078D4] text-[#0078D4] hover:bg-[#E5F0FA] font-semibold rounded-sm gap-1.5"
                          >
                            {isUploading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Upload className="h-3.5 w-3.5" />
                            )}
                            Upload Button
                          </Button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: Planning Questionnaire */}
          <Card className="rounded-md border border-[#EDEBE9] shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-[#FAF9F8] border-b border-[#EDEBE9] px-6 py-4">
              <CardTitle className="text-sm font-semibold text-[#201F1E] flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#0078D4]" /> Planning Questionnaire
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                
                {/* Question 1 */}
                <div className="p-4 rounded-md border border-[#EDEBE9] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#201F1E]">
                      Question 1: Any penalties or regulatory fines?
                    </p>
                    <p className="text-[11px] text-[#605E5C]">
                      Specify if regulatory bodies issued warnings, compliance orders, or financial penalties.
                    </p>
                  </div>
                  <Controller
                    name="penaltiesOrFines"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-3 shrink-0">
                        <label className={`px-4 py-1.5 text-xs font-semibold rounded-sm border cursor-pointer transition-colors ${
                          field.value === 'Yes' 
                            ? 'bg-[#A80000] text-white border-[#A80000]' 
                            : 'bg-white text-[#323130] border-[#C8C6C4] hover:bg-[#F3F2F1]'
                        }`}>
                          <input 
                            type="radio" 
                            value="Yes" 
                            checked={field.value === 'Yes'} 
                            onChange={() => field.onChange('Yes')} 
                            className="hidden" 
                          />
                          Yes
                        </label>
                        <label className={`px-4 py-1.5 text-xs font-semibold rounded-sm border cursor-pointer transition-colors ${
                          field.value === 'No' 
                            ? 'bg-[#0078D4] text-white border-[#0078D4]' 
                            : 'bg-white text-[#323130] border-[#C8C6C4] hover:bg-[#F3F2F1]'
                        }`}>
                          <input 
                            type="radio" 
                            value="No" 
                            checked={field.value === 'No'} 
                            onChange={() => field.onChange('No')} 
                            className="hidden" 
                          />
                          No
                        </label>
                      </div>
                    )}
                  />
                </div>

                {/* Question 2 */}
                <div className="p-4 rounded-md border border-[#EDEBE9] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#201F1E]">
                      Question 2: Any fraud reported?
                    </p>
                    <p className="text-[11px] text-[#605E5C]">
                      Indicate whether internal whistleblower alerts, hotline complaints, or fraud instances occurred.
                    </p>
                  </div>
                  <Controller
                    name="fraudReported"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-3 shrink-0">
                        <label className={`px-4 py-1.5 text-xs font-semibold rounded-sm border cursor-pointer transition-colors ${
                          field.value === 'Yes' 
                            ? 'bg-[#A80000] text-white border-[#A80000]' 
                            : 'bg-white text-[#323130] border-[#C8C6C4] hover:bg-[#F3F2F1]'
                        }`}>
                          <input 
                            type="radio" 
                            value="Yes" 
                            checked={field.value === 'Yes'} 
                            onChange={() => field.onChange('Yes')} 
                            className="hidden" 
                          />
                          Yes
                        </label>
                        <label className={`px-4 py-1.5 text-xs font-semibold rounded-sm border cursor-pointer transition-colors ${
                          field.value === 'No' 
                            ? 'bg-[#0078D4] text-white border-[#0078D4]' 
                            : 'bg-white text-[#323130] border-[#C8C6C4] hover:bg-[#F3F2F1]'
                        }`}>
                          <input 
                            type="radio" 
                            value="No" 
                            checked={field.value === 'No'} 
                            onChange={() => field.onChange('No')} 
                            className="hidden" 
                          />
                          No
                        </label>
                      </div>
                    )}
                  />
                </div>

                {/* Question 3 */}
                <div className="p-4 rounded-md border border-[#EDEBE9] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#201F1E]">
                      Question 3: Any High Risk observations in previous audits?
                    </p>
                    <p className="text-[11px] text-[#605E5C]">
                      Confirm if outstanding high severity audit findings or unmitigated control defects exist.
                    </p>
                  </div>
                  <Controller
                    name="highRiskObservations"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-3 shrink-0">
                        <label className={`px-4 py-1.5 text-xs font-semibold rounded-sm border cursor-pointer transition-colors ${
                          field.value === 'Yes' 
                            ? 'bg-[#A80000] text-white border-[#A80000]' 
                            : 'bg-white text-[#323130] border-[#C8C6C4] hover:bg-[#F3F2F1]'
                        }`}>
                          <input 
                            type="radio" 
                            value="Yes" 
                            checked={field.value === 'Yes'} 
                            onChange={() => field.onChange('Yes')} 
                            className="hidden" 
                          />
                          Yes
                        </label>
                        <label className={`px-4 py-1.5 text-xs font-semibold rounded-sm border cursor-pointer transition-colors ${
                          field.value === 'No' 
                            ? 'bg-[#0078D4] text-white border-[#0078D4]' 
                            : 'bg-white text-[#323130] border-[#C8C6C4] hover:bg-[#F3F2F1]'
                        }`}>
                          <input 
                            type="radio" 
                            value="No" 
                            checked={field.value === 'No'} 
                            onChange={() => field.onChange('No')} 
                            className="hidden" 
                          />
                          No
                        </label>
                      </div>
                    )}
                  />
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 pb-12">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="h-10 px-5 text-xs border-[#C8C6C4] text-[#323130] hover:bg-[#F3F2F1] font-semibold rounded-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="h-10 px-6 text-xs bg-[#0078D4] hover:bg-[#005A9E] active:bg-[#004578] text-white font-bold rounded-sm shadow-sm gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving Planning Request...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Audit Planning
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </PageLayout>
  );
}
