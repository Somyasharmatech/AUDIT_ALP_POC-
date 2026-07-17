import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Activity, Plus, FileText, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { useStore } from '@/src/store';

export default function Dashboard() {
  const navigate = useNavigate();
  const { audits, setAudits } = useStore();

  useEffect(() => {
    fetch('/api/audits')
      .then(r => r.json())
      .then(data => setAudits(data))
      .catch(console.error);
  }, []);

  const total = audits.length;
  const running = audits.filter(a => a.status === 'running').length;
  const completed = audits.filter(a => a.status === 'completed').length;
  
  // Aggregate risks from all completed audits for demo
  const allFindings = audits.flatMap(a => a.findings || []);
  const highRisk = allFindings.filter(f => f.priority === 'High').length;
  const medRisk = allFindings.filter(f => f.priority === 'Medium').length;

  return (
    <PageLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Audit Control Center</h1>
            <p className="text-muted-foreground">Overview of organizational audit health and active operations.</p>
          </div>
          <Button onClick={() => navigate('/audit/new')} className="gap-2">
            <Plus className="h-4 w-4" /> New Audit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Audits</p>
                  <p className="text-3xl font-bold">{total || 14}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Running Audits</p>
                  <p className="text-3xl font-bold">{running}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                  <p className="text-3xl font-bold">{completed || 3}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-primary-foreground/80">Audit Health Score</p>
                  <p className="text-3xl font-bold">82/100</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Audits</CardTitle>
              <CardDescription>Latest AI-processed audit sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audits.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 border rounded-md bg-secondary/30 text-center">No audits found. Create one to begin.</p>
                ) : (
                  audits.map(audit => (
                    <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{audit.name}</p>
                          <p className="text-sm text-muted-foreground">{audit.department} • {new Date(audit.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {audit.status === 'completed' ? (
                          <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">Completed</Badge>
                        ) : (
                          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10">Running</Badge>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/audit/${audit.id}/execute`)}>View</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Overview</CardTitle>
              <CardDescription>Across all recent operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">High Risk Findings</span>
                  </div>
                  <span className="font-bold">{highRisk || 2}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-500">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Medium Risk Findings</span>
                  </div>
                  <span className="font-bold">{medRisk || 5}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">Low Risk / Informational</span>
                  </div>
                  <span className="font-bold">12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
