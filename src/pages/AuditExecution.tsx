import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { BrainCircuit, Activity, FileSearch, ShieldCheck, Database, FileText, Zap, Network, Clock, ServerCog, ArrowRight } from 'lucide-react';
import { Audit } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

const WORKERS = [
  { name: "Document Intelligence", icon: FileSearch, desc: "Data & Metadata Extraction", duration: 4000 },
  { name: "Business Understanding", icon: Network, desc: "Process & Context Mapping", duration: 3500 },
  { name: "Audit Planning", icon: FileText, desc: "Scope & Evidence Definition", duration: 3000 },
  { name: "Business Intelligence", icon: Activity, desc: "KPIs & Variance Analytics", duration: 4500 },
  { name: "Risk & Controls", icon: ShieldCheck, desc: "Control Failure Detection", duration: 4000 },
  { name: "Compliance", icon: Database, desc: "SOP & Policy Validation", duration: 3500 },
  { name: "Exception & Insight Engine", icon: Zap, desc: "Anomaly & Outlier Detection", duration: 5000 },
  { name: "Executive Reporting", icon: FileText, desc: "Summary & Action Formatting", duration: 4000 }
];

export default function AuditExecution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [activeTimeMs, setActiveTimeMs] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/audits/${id}`)
        .then(r => r.json())
        .then(data => {
          setAudit(data);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    setActiveTimeMs(0);
    if (audit?.status === 'completed') return;
    
    let lastTick = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveTimeMs(prev => prev + (now - lastTick));
      lastTick = now;
    }, 100);
    
    return () => clearInterval(interval);
  }, [audit?.currentStep, audit?.status]);

  if (!audit) return <PageLayout><div className="p-8 flex items-center justify-center h-full"><div className="animate-pulse flex items-center gap-3"><ServerCog className="h-6 w-6 text-primary animate-spin" /><span className="text-muted-foreground">Initializing Orchestrator...</span></div></div></PageLayout>;

  const workerNames = WORKERS.map(w => w.name);
  const currentIndex = audit.status === 'completed' ? workerNames.length : workerNames.indexOf(audit.currentStep);

  return (
    <PageLayout>
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-full flex flex-col">
        {/* Orchestrator Header */}
        <Card className="mb-8 border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.05)] bg-card overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                <ServerCog className={`h-8 w-8 text-primary ${audit.status === 'running' ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Badge variant="outline" className={`border-primary/30 ${audit.status === 'running' ? 'text-primary bg-primary/5 animate-pulse' : 'text-green-500 border-green-500/30'}`}>
                    {audit.status === 'running' ? 'LIVE EXECUTION' : 'WORKFLOW COMPLETED'}
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">ID: {audit.id}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Audit Orchestrator</h1>
                <p className="text-muted-foreground mt-1">Coordinating {WORKERS.length} autonomous AI departments for {audit.department}.</p>
              </div>
            </div>
            {audit.status === 'completed' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Button size="lg" onClick={() => navigate(`/audit/${id}/review`)} className="gap-2 shadow-lg shadow-primary/20">
                  Review Findings <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Main Body */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
          {/* Workers Grid */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {WORKERS.map((worker, index) => {
              const isCompleted = currentIndex > index || audit.status === 'completed';
              const isRunning = currentIndex === index && audit.status !== 'completed';
              const isPending = currentIndex < index && audit.status !== 'completed';

              const progress = isCompleted ? 100 : (isRunning ? Math.min((activeTimeMs / worker.duration) * 100, 99) : 0);
              const timeStr = isCompleted ? `${(worker.duration / 1000).toFixed(1)}s` : (isRunning ? `${(activeTimeMs / 1000).toFixed(1)}s` : "0.0s");
              const confidence = isCompleted ? `${94 + (index % 5)}%` : (isRunning ? "Analyzing..." : "-");
              
              let currentLog = "Waiting in queue...";
              if (isCompleted) currentLog = "Task completed successfully.";
              else if (isRunning) {
                currentLog = audit.logs[audit.logs.length - 1]?.message || "Processing...";
              }

              return (
                <motion.div
                  key={worker.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <Card className={`h-full flex flex-col transition-all duration-500 ${isRunning ? 'border-primary shadow-[0_0_20px_rgba(var(--primary),0.15)] ring-1 ring-primary/20 bg-card scale-[1.02] relative z-10' : isCompleted ? 'border-border/60 bg-secondary/10' : 'border-border/30 bg-background/40 opacity-60'}`}>
                    <CardContent className="p-4 md:p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-lg transition-colors ${isRunning ? 'bg-primary/20 text-primary' : isCompleted ? 'bg-secondary text-muted-foreground' : 'bg-secondary/50 text-muted-foreground/50'}`}>
                            <worker.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className={`font-semibold leading-tight text-sm ${isRunning ? 'text-foreground' : isCompleted ? 'text-foreground/80' : 'text-muted-foreground'}`}>{worker.name}</h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{worker.desc}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 flex-1 flex flex-col justify-end">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <Badge variant="outline" className={`text-[9px] md:text-[10px] uppercase px-1.5 py-0 h-4 border-transparent ${isRunning ? 'text-primary bg-primary/10 animate-pulse' : isCompleted ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground bg-secondary/50'}`}>
                              {isRunning ? 'Running' : isCompleted ? 'Completed' : 'Pending'}
                            </Badge>
                            <span className="font-mono">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className={`h-1.5 ${isRunning ? '[&>div]:bg-primary' : isCompleted ? '[&>div]:bg-green-500' : ''}`} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase text-muted-foreground tracking-wider mb-1 flex items-center gap-1.5"><Clock className="h-2.5 w-2.5" /> Run Time</span>
                            <span className={`text-[11px] font-mono font-medium ${isRunning ? 'text-foreground' : 'text-muted-foreground'}`}>{timeStr}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase text-muted-foreground tracking-wider mb-1 flex items-center gap-1.5"><BrainCircuit className="h-2.5 w-2.5" /> Confidence</span>
                            <span className={`text-[11px] font-mono font-medium ${isRunning ? 'text-primary animate-pulse' : isCompleted ? 'text-green-500' : 'text-muted-foreground'}`}>{confidence}</span>
                          </div>
                        </div>
                        
                        <div className="pt-2.5 bg-black/20 rounded-md p-2.5 border border-border/30 mt-1">
                          <span className="text-[9px] uppercase text-muted-foreground tracking-wider block mb-1">Live Task</span>
                          <p className={`text-[10px] md:text-xs font-mono truncate ${isRunning ? 'text-primary/90' : 'text-muted-foreground'}`} title={currentLog}>
                            {">"} {currentLog}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Timeline & Logs */}
          <div className="xl:col-span-1 h-full min-h-[400px]">
            <Card className="h-full flex flex-col bg-[#050505] border-border/50 shadow-inner">
              <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Live Event Stream</span>
                {audit.status === 'running' && (
                  <span className="ml-auto flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                )}
              </div>
              <div className="p-5 overflow-y-auto flex-1 font-mono text-[11px] md:text-xs space-y-4 flex flex-col-reverse custom-scrollbar">
                <AnimatePresence>
                  {[...audit.logs].reverse().map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-muted-foreground border-l border-white/10 pl-3 relative before:absolute before:left-[-1px] before:top-1.5 before:h-1.5 before:w-1.5 before:-translate-x-1/2 before:rounded-full before:bg-white/30"
                    >
                      <div className="text-primary/60 mb-0.5 text-[9px] md:text-[10px]">[{log.timestamp.split('T')[1].split('.')[0]}]</div> 
                      <div className="text-foreground/90 leading-relaxed">{log.message}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </div>
        </div>

        {/* Overall Progress Bottom Bar */}
        <div className="mt-auto pt-4 md:pt-6 border-t border-border/50 pb-2">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest">Overall Audit Progress</span>
              {audit.status === 'completed' && <Badge className="bg-green-500 text-white border-transparent">100% DONE</Badge>}
            </div>
            <span className="font-mono font-bold text-primary text-base md:text-lg">{audit.progress}%</span>
          </div>
          <Progress value={audit.progress} className={`h-2 md:h-2.5 ${audit.status === 'completed' ? '[&>div]:bg-green-500' : ''}`} />
        </div>
      </div>
    </PageLayout>
  );
}
