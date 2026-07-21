import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  FileText, 
  FileSpreadsheet, 
  BookOpen, 
  History, 
  DollarSign, 
  Target, 
  SlidersHorizontal, 
  ListOrdered, 
  FastForward,
  Building2,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ApiClient } from '@/src/lib/api';
import { toast } from 'sonner';

export interface StageItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  durationMs: number;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  elapsedSec?: number;
  details?: string;
}

export default function ProcessingOrchestrator() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch audit details for context
  const { data: audit, isLoading } = useQuery({
    queryKey: ['audit', id],
    queryFn: () => ApiClient.get(`/audits/${id}`),
    enabled: !!id,
  });

  const [stages, setStages] = useState<StageItem[]>([
    {
      id: 1,
      title: 'Validating Uploaded Documents',
      description: 'Checking file integrity, permissions, and parsing document metadata across 8 ingested artifacts.',
      icon: <FileText className="h-4 w-4" />,
      durationMs: 1200,
      status: 'pending',
      details: '8/8 files validated • Zero corruption detected'
    },
    {
      id: 2,
      title: 'Reading Previous Audit Reports',
      description: 'Extracting historical findings, remediation statuses, and issue ratings from FY24 and FY25 reports.',
      icon: <History className="h-4 w-4" />,
      durationMs: 1400,
      status: 'pending',
      details: '11 findings analyzed • 1 repeat observation flagged'
    },
    {
      id: 3,
      title: 'Reading SOP & Policy Documents',
      description: 'Analyzing Treasury Standard Operating Procedures (v3.2) and approval matrices.',
      icon: <BookOpen className="h-4 w-4" />,
      durationMs: 1300,
      status: 'pending',
      details: 'Dual-authorization threshold identified ($10,000)'
    },
    {
      id: 4,
      title: 'Reading Balance Sheet & Trial Balances',
      description: 'Parsing sub-ledger accounts, cash suspense ledgers, and foreign exchange reserve balances.',
      icon: <FileSpreadsheet className="h-4 w-4" />,
      durationMs: 1500,
      status: 'pending',
      details: 'GL Account #2100-AP-01 ($24.85M) & #1010-CS-04 ($1.42M) mapped'
    },
    {
      id: 5,
      title: 'Reading Enterprise Risk Register',
      description: 'Correlating inherent process risks with department-level risk register items.',
      icon: <AlertTriangle className="h-4 w-4" />,
      durationMs: 1200,
      status: 'pending',
      details: '3 critical risk domains aligned with audit scope'
    },
    {
      id: 6,
      title: 'Reading Fraud & Incident Register',
      description: 'Scanning ethics committee logs, whistleblower hotline reports, and regulatory notices.',
      icon: <ShieldCheck className="h-4 w-4" />,
      durationMs: 1100,
      status: 'pending',
      details: 'Zero active fraud incidents • 1 tax penalty notice logged'
    },
    {
      id: 7,
      title: 'Conducting Multi-Year Historical Analysis',
      description: 'Synthesizing 3-year audit rating trends and open remediation action items.',
      icon: <Cpu className="h-4 w-4" />,
      durationMs: 1600,
      status: 'pending',
      details: 'Trend rating: Satisfactory with Exceptions (FY25)'
    },
    {
      id: 8,
      title: 'Calculating Materiality & Testing Thresholds',
      description: 'Determining Planning Materiality ($1.25M) and Tolerable Misstatement ($250k).',
      icon: <DollarSign className="h-4 w-4" />,
      durationMs: 1300,
      status: 'pending',
      details: 'Benchmark: 1% of Annual Treasury Turnover ($140M+)'
    },
    {
      id: 9,
      title: 'Synthesizing Risk Assessment Matrix',
      description: 'Evaluating risk likelihood vs impact scores and assigning inherent risk ratings.',
      icon: <Target className="h-4 w-4" />,
      durationMs: 1700,
      status: 'pending',
      details: '4 high/medium risk scenarios mapped to controls'
    },
    {
      id: 10,
      title: 'Generating Audit Planning Recommendations',
      description: 'Constructing business-focused planning strategy, readiness score (92/100), and next steps.',
      icon: <SlidersHorizontal className="h-4 w-4" />,
      durationMs: 1800,
      status: 'pending',
      details: 'Planning Brief generated with 96% AI confidence'
    },
    {
      id: 11,
      title: 'Drafting Audit Scope & Boundaries',
      description: 'Defining core in-scope treasury processes and setting out-of-scope rationales.',
      icon: <Layers className="h-4 w-4" />,
      durationMs: 1400,
      status: 'pending',
      details: 'In-Scope: Payment Vouchers, H2H Bank Interface, Tax Compliance'
    },
    {
      id: 12,
      title: 'Formulating Audit Program & Testing Steps',
      description: 'Auto-populating Risk Control Matrix (RCM) and substantive audit procedures.',
      icon: <ListOrdered className="h-4 w-4" />,
      durationMs: 1600,
      status: 'pending',
      details: '4 priority audit areas • 12 audit procedures generated'
    }
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [totalTimeElapsedSec, setTotalTimeElapsedSec] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Overall timer counter
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTotalTimeElapsedSec(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  // Orchestrator simulation sequence
  useEffect(() => {
    if (currentStepIndex >= stages.length) {
      setIsFinished(true);
      toast.success("AI Planning Orchestration Completed Successfully!");
      const navTimer = setTimeout(() => {
        navigate(`/audit/${id}/workspace`);
      }, 1200);
      return () => clearTimeout(navTimer);
    }

    // Set current step to in_progress
    setStages(prev => prev.map((stage, idx) => {
      if (idx === currentStepIndex) {
        return { ...stage, status: 'in_progress', elapsedSec: 0 };
      }
      return stage;
    }));

    const stepDuration = stages[currentStepIndex].durationMs;

    const timeout = setTimeout(() => {
      // Mark current step completed
      setStages(prev => prev.map((stage, idx) => {
        if (idx === currentStepIndex) {
          return { ...stage, status: 'completed', elapsedSec: Math.round(stepDuration / 1000 * 10) / 10 };
        }
        return stage;
      }));

      // Advance to next step
      setCurrentStepIndex(prev => prev + 1);
    }, stepDuration);

    return () => clearTimeout(timeout);
  }, [currentStepIndex, id, navigate, stages.length]);

  const completedCount = stages.filter(s => s.status === 'completed').length;
  const overallProgressPct = Math.round((completedCount / stages.length) * 100);

  const handleSkipOrchestration = () => {
    setStages(prev => prev.map(s => ({ ...s, status: 'completed', elapsedSec: 1.0 })));
    setCurrentStepIndex(stages.length);
    setIsFinished(true);
    toast.info("Fast-forwarded AI Orchestration processing");
    navigate(`/audit/${id}/workspace`);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#F8F9FA] text-[#323130] p-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* HEADER BAR */}
        <div className="bg-white p-6 rounded-md border border-[#EDEBE9] shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EDEBE9]">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E5F0FA] rounded-sm text-[#0078D4]">
                  <Cpu className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#201F1E]">
                    AI Audit Planning Orchestration Center
                  </h1>
                  <p className="text-xs text-[#605E5C] mt-0.5">
                    Executing multi-agent synthesis, risk modeling, materiality calculation, and audit program drafting.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkipOrchestration}
                className="border-[#0078D4] text-[#0078D4] hover:bg-[#E5F0FA] text-xs font-semibold h-8 gap-1.5 rounded-sm"
              >
                <FastForward className="h-3.5 w-3.5" /> Fast-Forward Simulation
              </Button>
            </div>
          </div>

          {/* AUDIT METADATA & TIMER ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
            <div>
              <span className="text-[#605E5C] block text-[11px] font-semibold">Audit Name</span>
              <span className="font-bold text-[#201F1E]">{audit?.name || 'Treasury & AP Operations Audit'}</span>
            </div>
            <div>
              <span className="text-[#605E5C] block text-[11px] font-semibold">Department</span>
              <span className="font-bold text-[#201F1E]">{audit?.department || 'Finance & Treasury'}</span>
            </div>
            <div>
              <span className="text-[#605E5C] block text-[11px] font-semibold">Time Elapsed</span>
              <span className="font-bold text-[#0078D4] font-mono flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> 00:{totalTimeElapsedSec < 10 ? `0${totalTimeElapsedSec}` : totalTimeElapsedSec}s
              </span>
            </div>
            <div>
              <span className="text-[#605E5C] block text-[11px] font-semibold">Processing Stage</span>
              <span className="font-bold text-[#107C41]">
                {isFinished ? 'Completed (12/12)' : `Stage ${Math.min(currentStepIndex + 1, 12)} of 12`}
              </span>
            </div>
            <div>
              <span className="text-[#605E5C] block text-[11px] font-semibold">Target Destination</span>
              <span className="font-bold text-[#0078D4]">Audit Planning Workspace</span>
            </div>
          </div>

          {/* OVERALL PROGRESS BAR */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#201F1E] flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#0078D4]" />
                Overall Orchestration Progress: <strong className="text-[#0078D4]">{overallProgressPct}%</strong>
              </span>
              <span className="text-[#605E5C] text-[11px] font-mono font-semibold">
                {completedCount} of 12 Stages Completed
              </span>
            </div>
            <Progress value={overallProgressPct} className="h-2.5 bg-[#EDEBE9]" />
          </div>
        </div>

        {/* 12-STAGE ORCHESTRATOR PIPELINE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((stage) => {
            const isCompleted = stage.status === 'completed';
            const isInProgress = stage.status === 'in_progress';
            const isPending = stage.status === 'pending';

            return (
              <Card 
                key={stage.id} 
                className={`transition-all border rounded-md shadow-xs ${
                  isInProgress 
                    ? 'border-[#0078D4] bg-white ring-2 ring-[#0078D4]/20' 
                    : isCompleted 
                    ? 'border-[#107C41]/30 bg-[#F2F9F2]' 
                    : 'border-[#EDEBE9] bg-[#FAF9F8] opacity-75'
                }`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-sm ${
                        isCompleted ? 'bg-[#DFF6DD] text-[#107C41]' :
                        isInProgress ? 'bg-[#E5F0FA] text-[#0078D4]' :
                        'bg-[#EDEBE9] text-[#605E5C]'
                      }`}>
                        {stage.icon}
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#605E5C]">
                        Stage {stage.id < 10 ? `0${stage.id}` : stage.id}
                      </span>
                    </div>

                    {/* STATUS BADGE */}
                    {isCompleted && (
                      <Badge className="bg-[#DFF6DD] text-[#107C41] border-[#107C41]/30 text-[10px] font-bold px-2 py-0.5 gap-1">
                        <CheckCircle2 className="h-3 w-3 text-[#107C41]" /> Complete
                      </Badge>
                    )}
                    {isInProgress && (
                      <Badge className="bg-[#E5F0FA] text-[#0078D4] border-[#0078D4]/30 text-[10px] font-bold px-2 py-0.5 gap-1 animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin text-[#0078D4]" /> Processing
                      </Badge>
                    )}
                    {isPending && (
                      <Badge variant="outline" className="bg-white text-[#605E5C] border-[#E1DFDD] text-[10px] font-semibold">
                        Pending
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className={`text-xs font-bold ${
                      isInProgress ? 'text-[#0078D4]' : isCompleted ? 'text-[#201F1E]' : 'text-[#605E5C]'
                    }`}>
                      {stage.title}
                    </h3>
                    <p className="text-[11px] text-[#605E5C] mt-1 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  {/* STAGE DETAILS / SUB-RESULT */}
                  {stage.details && (isCompleted || isInProgress) && (
                    <div className={`p-2 rounded text-[10px] font-mono border ${
                      isCompleted ? 'bg-white border-[#107C41]/20 text-[#107C41]' : 'bg-[#E5F0FA]/50 border-[#0078D4]/20 text-[#0078D4]'
                    }`}>
                      ✓ {stage.details}
                    </div>
                  )}

                  {/* MINI STEP PROGRESS */}
                  {isInProgress && (
                    <Progress value={65} className="h-1 bg-[#E5F0FA]" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* COMPLETION BANNER */}
        {isFinished && (
          <div className="bg-[#DFF6DD] border border-[#107C41] p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-[#107C41] shrink-0" />
              <div>
                <p className="font-bold text-[#107C41] text-sm">All 12 AI Orchestration Stages Completed Successfully!</p>
                <p className="text-[#323130] mt-0.5">Redirecting to Audit Planning Workspace with fully populated planning strategy...</p>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/audit/${id}/workspace`)}
              className="bg-[#107C41] hover:bg-[#0B5A2F] text-white text-xs font-semibold px-4 h-9 gap-1.5 shrink-0"
            >
              Open Planning Workspace <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

      </div>
    </PageLayout>
  );
}
