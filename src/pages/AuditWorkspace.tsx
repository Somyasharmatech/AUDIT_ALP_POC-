import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { 
  ArrowLeft, Upload, CheckCircle2, Sparkles, AlertCircle, FileText, Settings, 
  Building2, Layers, Check, FileCheck, Target, DollarSign, Activity, GitBranch,
  ShieldAlert, BookOpen, User, Clock, FileSpreadsheet, Loader2, ListChecks, History, BarChart3, Database, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

import { KnowledgeExtractionCenter } from '@/src/components/workspace/KnowledgeExtractionCenter';
import { ExecutiveSummary } from '@/src/components/workspace/ExecutiveSummary';
import { AuditIntelligenceCenter } from '@/src/components/workspace/AuditIntelligenceCenter';
import { BusinessUnderstanding } from '@/src/components/workspace/BusinessUnderstanding';
import { SopReview } from '@/src/components/workspace/SopReview';
import { ProcessFlow } from '@/src/components/workspace/ProcessFlow';
import { HistoricalAnalysis } from '@/src/components/workspace/HistoricalAnalysis';
import { FinancialAnalysis } from '@/src/components/workspace/FinancialAnalysis';
import { RiskAssessment } from '@/src/components/workspace/RiskAssessment';
import { EnterpriseAnalytics } from '@/src/components/workspace/EnterpriseAnalytics';
import { PlanningMemorandum } from '@/src/components/workspace/PlanningMemorandum';
import { ScopingDocument } from '@/src/components/workspace/ScopingDocument';
import { AuditProgram } from '@/src/components/workspace/AuditProgram';
import { FinalReviewPackage } from '@/src/components/workspace/FinalReviewPackage';

type Phase = 'upload' | 'processing' | 'results';
type Document = { 
  id: string; 
  name: string; 
  status: 'Awaiting Upload' | 'Uploaded'; 
  parsingStatus?: string; 
  extractionStatus?: string;
  version?: string;
  required: boolean;
  types: string;
};

const REQUIRED_DOCUMENTS: Document[] = [
  { id: '1', name: 'Previous Audit Report', status: 'Awaiting Upload', required: true, types: 'PDF, DOCX' },
  { id: '2', name: 'Current Year Documents', status: 'Awaiting Upload', required: true, types: 'PDF, DOCX, XLSX' },
  { id: '3', name: 'Government Notifications', status: 'Awaiting Upload', required: false, types: 'PDF' },
  { id: '4', name: 'Regulatory Circulars', status: 'Awaiting Upload', required: false, types: 'PDF' },
  { id: '5', name: 'Balance Sheet', status: 'Awaiting Upload', required: true, types: 'XLSX, CSV' },
  { id: '6', name: 'Trial Balance', status: 'Awaiting Upload', required: true, types: 'XLSX, CSV' },
  { id: '7', name: 'SOP', status: 'Awaiting Upload', required: true, types: 'PDF, DOCX' },
  { id: '8', name: 'Operations Manual', status: 'Awaiting Upload', required: false, types: 'PDF, DOCX' },
  { id: '9', name: 'Risk Register', status: 'Awaiting Upload', required: true, types: 'XLSX' },
  { id: '10', name: 'Fraud Register', status: 'Awaiting Upload', required: false, types: 'XLSX' },
  { id: '11', name: 'RCM', status: 'Awaiting Upload', required: false, types: 'XLSX' },
  { id: '12', name: 'Previous Process Flow', status: 'Awaiting Upload', required: false, types: 'PDF, VSDX' },
  { id: '13', name: 'Policy Documents', status: 'Awaiting Upload', required: false, types: 'PDF' },
];

const PROCESSING_STEPS = [
  'Reading Previous Audit Report',
  'Reading Current Year Documents',
  'Reading Government Notifications',
  'Reading SOP',
  'Reading Balance Sheet',
  'Reading Trial Balance',
  'Reading Risk Register',
  'Reading Fraud Register',
  'Reading RCM',
  'Extracting Business Processes',
  'Building SOP Summary',
  'Generating Process Flow',
  'Historical Audit Analysis',
  'Financial Analysis',
  'Materiality Calculation',
  'Control Analysis',
  'Risk Assessment',
  'Penalty Detection',
  'Fraud Detection',
  'High Risk Detection',
  'Planning Memorandum',
  'Scoping Document',
  'Audit Program'
];

export default function AuditWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('upload');
  const [documents, setDocuments] = useState<Document[]>(REQUIRED_DOCUMENTS);

  // User provided inputs (Step 1)
  const [financialYear, setFinancialYear] = useState('2025-26');
  const [department, setDepartment] = useState('Procurement & Treasury');
  const [auditType, setAuditType] = useState('Financial & Operational ICFR Audit');
  const [autoAuditName, setAutoAuditName] = useState('Procure to Pay (P2P) Automation & Control Review FY25');
  
  // Processing state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Results state
  const [activeTab, setActiveTab] = useState('knowledge-extraction');

  const handleUpload = (docId: string) => {
    setDocuments(docs => docs.map(d => 
      d.id === docId ? { ...d, status: 'Uploaded', parsingStatus: 'Completed', extractionStatus: 'Completed', version: 'v1.0' } : d
    ));
    toast.success("Document uploaded successfully");
  };

  const startProcessing = () => {
    setPhase('processing');
    setCurrentStepIndex(0);
    setProgress(0);
    setElapsedSeconds(0);
  };

  useEffect(() => {
    if (phase === 'processing') {
      const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
      
      const stepTimer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= PROCESSING_STEPS.length - 1) {
            clearInterval(stepTimer);
            clearInterval(timer);
            setTimeout(() => setPhase('results'), 1000);
            return prev;
          }
          setProgress(((prev + 1) / PROCESSING_STEPS.length) * 100);
          return prev + 1;
        });
      }, 500); // Fast simulation

      return () => {
        clearInterval(timer);
        clearInterval(stepTimer);
      };
    }
  }, [phase]);

  return (
    <PageLayout>
      <div className="flex h-full bg-[#F8F9FA]">
        
        {/* Only show sidebar if in results phase */}
        {phase === 'results' && (
          <div className="w-64 bg-white border-r border-[#DEE2E6] flex flex-col shrink-0">
             <div className="p-4 border-b border-[#DEE2E6]">
               <h2 className="text-[14px] font-bold text-[#212529] uppercase tracking-wider">AI Outputs</h2>
             </div>
              <div className="flex-1 overflow-y-auto py-2">
                {[
                  { id: 'knowledge-extraction', label: 'Knowledge Extraction', icon: Database },
                  { id: 'audit-intelligence-center', label: 'Audit Intelligence Center', icon: ShieldCheck },
                  { id: 'executive-summary', label: 'Executive Summary', icon: Sparkles },
                  { id: 'business-understanding', label: 'Business Understanding', icon: Building2 },
                  { id: 'sop-review', label: 'SOP Review & Edit', icon: FileCheck },
                  { id: 'process-flow', label: 'Process Flow', icon: GitBranch },
                  { id: 'historical', label: 'Historical Analysis', icon: History },
                  { id: 'financial', label: 'Financial Analysis', icon: DollarSign },
                  { id: 'risk-assessment', label: 'Risk Assessment', icon: ShieldAlert },
                  { id: 'analytics', label: 'Enterprise Analytics', icon: BarChart3 },
                  { id: 'planning-memo', label: 'Planning Memorandum', icon: FileText },
                  { id: 'scoping-document', label: 'Scoping Document', icon: Target },
                  { id: 'audit-program', label: 'Audit Program', icon: ListChecks },
                  { id: 'final-review', label: 'Final Review & Package', icon: CheckCircle2 },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                      activeTab === item.id 
                        ? 'bg-[#E5F0FA] text-[#005A9E] border-r-2 border-[#005A9E] font-medium' 
                        : 'text-[#495057] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                ))}
             </div>
          </div>
        )}

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {phase !== 'processing' && (
            <div className="border-b border-[#DEE2E6] bg-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="h-8 w-8 text-[#005A9E]">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-[#212529]">
                    {phase === 'upload' ? 'Required Documents' : 'Procure to Pay Automation Audit'}
                  </h1>
                  <p className="text-xs text-[#6C757D]">
                    {phase === 'upload' ? 'Upload foundational documents for AI analysis' : 'Auto Extracted Audit Name'}
                  </p>
                </div>
              </div>
              {phase === 'upload' && (
                <Button 
                  onClick={startProcessing} 
                  className="bg-[#005A9E] hover:bg-[#004578] font-semibold px-6 shadow-md shadow-[#005A9E]/20"
                >
                  <Sparkles className="h-4 w-4 mr-2" /> Generate AI Planning
                </Button>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1200px] mx-auto">
              
              {/* PHASE: UPLOAD */}
              {phase === 'upload' && (
                <div className="space-y-6 pb-20">
                  {/* STEP 1: USER INPUTS & AUTO-EXTRACTED AUDIT NAME */}
                  <Card className="shadow-sm border-[#005A9E] bg-white">
                    <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#E5F0FA]/50 flex flex-row items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#005A9E] text-white text-[10px] uppercase font-bold">Step 1 — Scope Parameters</Badge>
                          <span className="text-xs text-[#005A9E] font-semibold">User Defined Parameters & Auto-Extracted Name</span>
                        </div>
                        <CardTitle className="text-base font-bold text-[#212529] mt-1">Audit Engagement Scope Configuration</CardTitle>
                      </div>
                      <Badge variant="outline" className="border-[#198754] text-[#198754] bg-[#F0FDF4] text-[10px] font-bold">
                        <Sparkles className="h-3 w-3 mr-1" /> Audit Name Auto-Extracted
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] font-bold text-[#6C757D] uppercase block mb-1">Financial Year</label>
                          <input 
                            type="text" 
                            value={financialYear} 
                            onChange={(e) => setFinancialYear(e.target.value)} 
                            className="w-full text-xs p-2 border border-[#DEE2E6] rounded font-semibold text-[#212529] focus:outline-none focus:border-[#005A9E]" 
                            placeholder="e.g. 2025-26"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#6C757D] uppercase block mb-1">Department Scope</label>
                          <input 
                            type="text" 
                            value={department} 
                            onChange={(e) => setDepartment(e.target.value)} 
                            className="w-full text-xs p-2 border border-[#DEE2E6] rounded font-semibold text-[#212529] focus:outline-none focus:border-[#005A9E]" 
                            placeholder="e.g. Procurement & Treasury"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#6C757D] uppercase block mb-1">Audit Type</label>
                          <input 
                            type="text" 
                            value={auditType} 
                            onChange={(e) => setAuditType(e.target.value)} 
                            className="w-full text-xs p-2 border border-[#DEE2E6] rounded font-semibold text-[#212529] focus:outline-none focus:border-[#005A9E]" 
                            placeholder="e.g. Financial & Operational ICFR"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-[#F8F9FA] border border-[#DEE2E6] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#005A9E] shrink-0" />
                          <div>
                            <span className="text-[10px] text-[#6C757D] font-bold uppercase block">Auto-Extracted Engagement Name (From Previous Audit Report)</span>
                            <span className="text-sm font-black text-[#005A9E]">{autoAuditName}</span>
                          </div>
                        </div>
                        <Badge className="bg-[#198754] text-white text-[10px] shrink-0">100% Parsed from Doc #1</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* UPLOAD DOCUMENT MATRIX */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#005A9E] uppercase tracking-wider flex items-center gap-2 border-b border-[#DEE2E6] pb-2">
                      <Upload className="h-4 w-4 text-[#005A9E]" /> Required Foundational Enterprise Documents (13 Sources)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {documents.map(doc => (
                    <Card key={doc.id} className="shadow-sm border-[#DEE2E6]">
                      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
                        <CardTitle className="text-sm font-semibold text-[#212529] line-clamp-1 flex-1 pr-2">{doc.name}</CardTitle>
                        <Badge variant="outline" className={`shrink-0 text-[10px] ${doc.required ? 'border-[#A80000] text-[#A80000]' : 'border-[#6C757D] text-[#6C757D]'}`}>
                           {doc.required ? 'Required' : 'Optional'}
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-semibold text-[#6C757D] uppercase">Types</span>
                          <span className="text-xs text-[#212529]">{doc.types}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-semibold text-[#6C757D] uppercase">Upload Status</span>
                          <Badge variant="outline" className={
                            doc.status === 'Uploaded' ? 'bg-[#E6F4EA] text-[#198754] border-[#198754]' : 'bg-[#FDF2F2] text-[#A80000] border-[#A80000]'
                          }>
                            {doc.status}
                          </Badge>
                        </div>

                        {doc.status === 'Uploaded' && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] font-semibold text-[#6C757D] uppercase">Parsing</span>
                              <span className="text-xs text-[#005A9E] font-medium">{doc.parsingStatus || 'Pending'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] font-semibold text-[#6C757D] uppercase">Extraction</span>
                              <span className="text-xs text-[#005A9E] font-medium">{doc.extractionStatus || 'Pending'}</span>
                            </div>
                          </>
                        )}
                        
                        <div className="pt-3 border-t border-[#DEE2E6]">
                          {doc.status === 'Awaiting Upload' ? (
                            <Button 
                              variant="outline" 
                              className="w-full text-xs h-8 border-dashed border-[#005A9E] text-[#005A9E] bg-[#F8F9FA] hover:bg-[#E5F0FA]"
                              onClick={() => handleUpload(doc.id)}
                            >
                              <Upload className="h-3 w-3 mr-2" /> Upload Document
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="w-full text-xs h-8 text-[#495057]"
                            >
                              Replace Document
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

              {/* PHASE: PROCESSING */}
              {phase === 'processing' && (
                <div className="min-h-[70vh] flex items-center justify-center">
                  <div className="w-full max-w-2xl bg-white p-10 rounded-sm shadow-xl border border-[#DEE2E6]">
                    <div className="flex flex-col items-center text-center mb-8">
                       <div className="h-16 w-16 bg-[#005A9E] rounded-full flex items-center justify-center shadow-lg mb-6 animate-pulse">
                         <Sparkles className="h-8 w-8 text-white" />
                       </div>
                       <h2 className="text-2xl font-bold text-[#212529] mb-2">AI Audit Assistant is Working</h2>
                       <p className="text-[#6C757D]">Analyzing all uploaded documents and generating planning outputs.</p>
                    </div>

                    <div className="space-y-2 mb-8">
                       <div className="flex justify-between text-sm font-semibold">
                         <span className="text-[#005A9E]">{PROCESSING_STEPS[currentStepIndex]}</span>
                         <span className="text-[#495057]">{Math.round(progress)}%</span>
                       </div>
                       <Progress value={progress} className="h-2 bg-[#E9ECEF] [&>div]:bg-[#005A9E]" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm bg-[#F8F9FA] p-4 rounded-sm border border-[#DEE2E6]">
                       <div className="flex flex-col">
                         <span className="text-[#6C757D] uppercase text-xs font-semibold tracking-wider">Elapsed Time</span>
                         <span className="text-[#212529] font-medium font-mono">{elapsedSeconds}s</span>
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[#6C757D] uppercase text-xs font-semibold tracking-wider">Estimated Time</span>
                         <span className="text-[#212529] font-medium font-mono">11s</span>
                       </div>
                    </div>

                    <div className="mt-8 border-t border-[#DEE2E6] pt-6 max-h-[150px] overflow-y-auto">
                      <ul className="space-y-2">
                        {PROCESSING_STEPS.map((step, idx) => (
                          <li key={idx} className={`flex items-center gap-3 text-sm ${
                            idx < currentStepIndex ? 'text-[#198754]' :
                            idx === currentStepIndex ? 'text-[#005A9E] font-medium' :
                            'text-[#ADB5BD]'
                          }`}>
                            {idx < currentStepIndex ? <CheckCircle2 className="h-4 w-4" /> : 
                             idx === currentStepIndex ? <Loader2 className="h-4 w-4 animate-spin" /> :
                             <div className="h-4 w-4 rounded-full border-2 border-[#DEE2E6]" />}
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* PHASE: RESULTS */}
              {phase === 'results' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {activeTab === 'knowledge-extraction' && <KnowledgeExtractionCenter onSelectTab={(tabId) => setActiveTab(tabId)} />}
                  {activeTab === 'audit-intelligence-center' && <AuditIntelligenceCenter onSelectTab={(tabId) => setActiveTab(tabId)} />}
                  {activeTab === 'executive-summary' && <ExecutiveSummary />}
                  {activeTab === 'business-understanding' && <BusinessUnderstanding />}
                  {activeTab === 'sop-review' && <SopReview />}
                  {activeTab === 'process-flow' && <ProcessFlow />}
                  {activeTab === 'historical' && <HistoricalAnalysis />}
                  {activeTab === 'financial' && <FinancialAnalysis />}
                  {activeTab === 'risk-assessment' && <RiskAssessment />}
                  {activeTab === 'analytics' && <EnterpriseAnalytics />}
                  {activeTab === 'planning-memo' && <PlanningMemorandum />}
                  {activeTab === 'scoping-document' && <ScopingDocument />}
                  {activeTab === 'audit-program' && <AuditProgram />}
                  {activeTab === 'final-review' && <FinalReviewPackage />}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
