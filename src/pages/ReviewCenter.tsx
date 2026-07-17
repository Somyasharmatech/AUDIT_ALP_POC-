import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { FileText, ArrowRight, Check, X, MessageSquare, Download, ChevronRight, PieChart as PieChartIcon, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { Audit, Finding } from '@/src/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['hsl(var(--primary))', '#8884d8', '#82ca9d', '#ffc658'];

export default function ReviewCenter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<Audit | null>(null);

  useEffect(() => {
    fetch(`/api/audits/${id}`)
      .then(r => r.json())
      .then(data => setAudit(data));
  }, [id]);

  if (!audit) return <PageLayout><div className="p-8">Loading...</div></PageLayout>;

  const handleAction = (findingId: string, action: 'accepted' | 'rejected' | 'revision') => {
    setAudit(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        findings: prev.findings.map(f => f.id === findingId ? { ...f, status: action } : f)
      }
    });
  };

  const pendingCount = audit.findings?.filter(f => f.status === 'pending').length || 0;
  const approvedCount = audit.findings?.filter(f => f.status === 'accepted').length || 0;
  const rejectedCount = audit.findings?.filter(f => f.status === 'rejected').length || 0;

  return (
    <PageLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="text-primary border-primary/20">Ready for Review</Badge>
              <span className="text-sm text-muted-foreground font-mono">ID: {audit.id}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">{audit.name}</h1>
            <p className="text-muted-foreground">{audit.department} - Executed by AI Workforce</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export All
            </Button>
            <Button className="gap-2" onClick={() => window.print()}>
              <FileText className="h-4 w-4" /> Generate Final Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="mb-8 w-full justify-start border-b rounded-none bg-transparent h-auto p-0 space-x-6">
            <TabsTrigger value="analytics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base">Business Intelligence</TabsTrigger>
            <TabsTrigger value="findings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base flex items-center gap-2">
              Review Center <Badge variant="secondary" className="ml-1">{audit.findings?.length || 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="report" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-base">Executive Report</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* Top Level Exec KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
               <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-primary mb-1">Health Score</p>
                    <p className="text-4xl font-bold text-foreground">{audit.analytics?.healthScore}<span className="text-xl text-muted-foreground">/100</span></p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-muted-foreground mb-1">AI Confidence</p>
                    <p className="text-3xl font-bold text-foreground">{audit.analytics?.aiConfidence}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Controls Tested</p>
                    <p className="text-3xl font-bold text-foreground">{audit.analytics?.controlsTested}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Exceptions Found</p>
                    <p className="text-3xl font-bold text-destructive">{audit.analytics?.exceptionsFound}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Time Saved</p>
                    <p className="text-3xl font-bold text-green-500">{audit.analytics?.timeSaved}</p>
                  </CardContent>
                </Card>
            </div>

            {/* AI Insight KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {audit.analytics?.kpis.map((kpi, i) => (
                <Card key={i}>
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                      <Badge variant="outline" className={kpi.trend.includes('-') || kpi.trend === 'over' ? 'text-destructive border-destructive/20 bg-destructive/10' : 'text-green-500 border-green-500/20 bg-green-500/10'}>
                        {kpi.trend}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold mb-3">{kpi.value}</p>
                    {kpi.explanation && (
                      <div className="mt-auto p-2.5 bg-secondary/50 rounded text-xs text-muted-foreground border-l-2 border-primary/50">
                        {kpi.explanation}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Exception Trend (6 Months)</CardTitle>
                  <CardDescription>Detected anomalies across analyzed periods.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={audit.analytics?.monthlyTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="exceptions" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5 text-primary" /> Vendor Distribution</CardTitle>
                  <CardDescription>Concentration of expenditure across top vendors.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={audit.analytics?.vendorDistribution || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(audit.analytics?.vendorDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Budget vs Actual</CardTitle>
                  <CardDescription>Expenditure variance by category (in thousands).</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={audit.analytics?.budgetVsActual || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} cursor={{fill: 'hsl(var(--secondary))'}}/>
                      <Legend />
                      <Bar dataKey="budget" name="Budget" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.5} />
                      <Bar dataKey="actual" name="Actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" /> Risk Heatmap</CardTitle>
                  <CardDescription>Identified business risks mapped by severity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {audit.analytics?.riskHeatmap.map((risk, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                        <span className="font-medium">{risk.category}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${risk.risk === 'High' ? 'bg-destructive' : risk.risk === 'Medium' ? 'bg-orange-500' : 'bg-green-500'}`} 
                              style={{ width: `${risk.score}%` }} 
                            />
                          </div>
                          <Badge variant="outline" className={risk.risk === 'High' ? 'text-destructive border-destructive/20' : risk.risk === 'Medium' ? 'text-orange-500 border-orange-500/20' : 'text-green-500 border-green-500/20'}>
                            {risk.risk}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="findings" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
               <Card className="bg-secondary/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Pending Reviews</p>
                    <p className="text-3xl font-bold">{pendingCount}</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-green-500 mb-1">Approved Findings</p>
                    <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                  </CardContent>
                </Card>
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-destructive mb-1">Rejected Findings</p>
                    <p className="text-3xl font-bold text-destructive">{rejectedCount}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-primary mb-1">Avg AI Confidence</p>
                    <p className="text-3xl font-bold text-foreground">92%</p>
                  </CardContent>
                </Card>
            </div>

            {audit.findings?.map((finding) => (
              <Card key={finding.id} className={`border-l-4 overflow-hidden shadow-md ${finding.priority === 'High' ? 'border-l-destructive' : finding.priority === 'Medium' ? 'border-l-orange-500' : 'border-l-green-500'}`}>
                <CardHeader className="bg-secondary/10 pb-4 border-b border-border/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline" className={
                          finding.priority === 'High' ? 'text-destructive border-destructive/30 bg-destructive/5' :
                          finding.priority === 'Medium' ? 'text-orange-500 border-orange-500/30 bg-orange-500/5' :
                          'text-green-500 border-green-500/30 bg-green-500/5'
                        }>
                          {finding.priority} Priority
                        </Badge>
                        <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                          {finding.confidence} Confidence
                        </Badge>
                        {finding.status !== 'pending' && (
                          <Badge variant="default" className={finding.status === 'accepted' ? 'bg-green-500 hover:bg-green-600' : finding.status === 'revision' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-destructive hover:bg-destructive'}>
                            {finding.status.charAt(0).toUpperCase() + finding.status.slice(1)}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl text-foreground/90">{finding.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest flex items-center gap-2"><FileText className="h-4 w-4" /> Evidence</h4>
                        <div className="text-sm bg-[#050505] text-primary/90 p-4 rounded-lg font-mono border border-border/50 shadow-inner">
                          {finding.evidence}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">AI Reasoning</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/20 p-4 rounded-lg border border-border/30">{finding.reasoning}</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-destructive/80 mb-2 uppercase tracking-widest">Business Impact</h4>
                        <p className="text-sm text-destructive/90 bg-destructive/5 p-4 rounded-lg border border-destructive/10">{finding.impact}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Recommendation</h4>
                        <p className="text-sm bg-primary/5 p-4 rounded-lg border border-primary/20 text-foreground/90 font-medium">{finding.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-secondary/5 pt-4 pb-4 px-6 flex flex-wrap gap-3 border-t border-border/50">
                  <Button variant="default" onClick={() => handleAction(finding.id, 'accepted')} disabled={finding.status !== 'pending'} className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-sm">
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" onClick={() => handleAction(finding.id, 'rejected')} disabled={finding.status !== 'pending'} className="gap-2 shadow-sm">
                    <X className="h-4 w-4" /> Reject
                  </Button>
                  <Button variant="outline" onClick={() => handleAction(finding.id, 'revision')} disabled={finding.status !== 'pending'} className="gap-2 shadow-sm border-orange-500/30 text-orange-500 hover:bg-orange-500/10">
                    <MessageSquare className="h-4 w-4" /> Request Revision
                  </Button>
                  <Button variant="ghost" className="gap-2 ml-auto">
                    <MessageSquare className="h-4 w-4" /> Add Comment
                  </Button>
                  <Button variant="ghost" className="gap-2">
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="report">
            <Card className="max-w-4xl mx-auto shadow-2xl bg-card border-muted/30 print:shadow-none print:border-none">
              <CardContent className="p-10 md:p-16">
                <div className="border-b-2 border-border/50 pb-8 mb-10 text-center relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent print:hidden"></div>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground mt-4 font-serif">INTERNAL AUDIT REPORT</h1>
                  <h2 className="text-xl md:text-2xl text-primary font-medium">{audit.name}</h2>
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <Badge variant="outline" className="px-4 py-1 text-sm bg-secondary/50 print:border-black print:text-black">CONFIDENTIAL</Badge>
                    <p className="text-sm text-muted-foreground font-mono">Date: {new Date(audit.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <section className="mb-12">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3 border-b pb-2 print:border-black">
                    Executive Summary
                  </h3>
                  <div className="bg-secondary/10 p-6 rounded-lg border border-border/30 print:border-none print:p-0">
                    <p className="text-foreground/80 leading-relaxed text-lg">
                      The AI Audit Orchestrator has completed a comprehensive, autonomous review of the provided <strong>{audit.department}</strong> documentation. 
                      The algorithmic analysis identified <strong>{audit.findings?.length || 0} key exceptions</strong>, resulting in an overall Health Score of <strong>{audit.analytics?.healthScore}/100</strong>.
                      Immediate management attention is required regarding {audit.analytics?.riskHeatmap.filter(r => r.risk === 'High').map(r => r.category).join(', ') || 'certain identified risks'}.
                    </p>
                  </div>
                </section>

                <section className="mb-12">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3 border-b pb-2 print:border-black">
                    Audit Scope & Documents Processed
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                    <li>Treasury_Transfer_Log_Q3.csv</li>
                    <li>Treasury_RCM_v2.pdf</li>
                    <li>Corporate_Policy_2026.pdf</li>
                    <li>Previous_Audit_Q2.pdf</li>
                    <li>Vendor_Master_Data.xlsx</li>
                    <li>General_Ledger_Extract.csv</li>
                  </ul>
                </section>

                <section className="mb-12">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3 border-b pb-2 print:border-black">
                    Business Insights & Analytics Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {audit.analytics?.kpis.map((kpi, i) => (
                      <div key={i} className="p-5 border border-border/40 rounded-lg bg-card shadow-sm print:shadow-none print:border-black">
                        <span className="text-sm text-muted-foreground font-medium block mb-2">{kpi.label}</span>
                        <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-12 break-inside-avoid">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3 border-b pb-2 print:border-black">
                    Risk Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {audit.analytics?.riskHeatmap.map((risk, i) => (
                      <div key={i} className="flex justify-between p-3 border-b border-border/30 print:border-black">
                        <span className="font-medium text-foreground/80">{risk.category}</span>
                        <span className={risk.risk === 'High' ? 'text-destructive font-bold' : risk.risk === 'Medium' ? 'text-orange-500 font-bold' : 'text-green-500 font-bold'}>{risk.risk}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-12 break-inside-avoid">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3 border-b pb-2 print:border-black">
                    Detailed Findings & Recommendations
                  </h3>
                  <div className="space-y-8">
                    {audit.findings?.map((f, i) => (
                      <div key={i} className="rounded-lg border border-border/40 bg-secondary/5 print:border-black print:bg-transparent">
                        <div className="p-4 bg-secondary/10 border-b border-border/40 print:bg-gray-100 flex justify-between items-center">
                          <strong className="block text-lg text-foreground font-serif">Finding {i+1}: {f.title}</strong>
                          <span className="text-sm font-bold uppercase tracking-wider">{f.priority} PRIORITY</span>
                        </div>
                        <div className="p-4 space-y-4 text-sm text-foreground/80">
                          <p><strong className="text-foreground">Evidence:</strong> {f.evidence}</p>
                          <p><strong className="text-foreground">Reasoning:</strong> {f.reasoning}</p>
                          <p><strong className="text-destructive">Business Impact:</strong> {f.impact}</p>
                          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded print:border-black print:bg-transparent">
                            <strong className="text-primary block mb-1">Recommendation:</strong>
                            {f.recommendation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-12 break-inside-avoid">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3 border-b pb-2 print:border-black">
                    Management Actions
                  </h3>
                  <p className="text-foreground/80 leading-relaxed mb-6">
                    Management agrees with the findings above and will implement the recommended actions by the end of the next financial quarter.
                  </p>
                </section>

                <div className="mt-24 pt-8 border-t-2 border-border/50 flex justify-between items-end print:border-black break-inside-avoid">
                  <div>
                    <p className="font-semibold text-muted-foreground uppercase tracking-wider text-xs mb-2">Prepared by</p>
                    <p className="text-primary font-mono text-lg font-bold">AUDIT ALP</p>
                    <p className="text-sm text-muted-foreground">Agentic Intelligence Engine</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-muted-foreground uppercase tracking-wider text-xs mb-2">Approved By</p>
                    <div className="w-48 h-12 border-b border-dashed border-border/50 mb-2"></div>
                    <p className="text-sm text-foreground font-medium">Head of Internal Audit</p>
                  </div>
                </div>
                
                <div className="mt-12 flex justify-center gap-4 print:hidden">
                  <Button variant="outline">Export Word</Button>
                  <Button variant="default" onClick={() => window.print()}>Export PDF / Print</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
