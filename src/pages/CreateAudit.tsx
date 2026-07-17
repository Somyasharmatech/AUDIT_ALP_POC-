import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Upload, File, X, Sparkles } from 'lucide-react';

export default function CreateAudit() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock file upload for PoC
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const startAudit = async () => {
    if (!name || files.length === 0) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, department: department || 'Auto Detect' })
      });
      const data = await res.json();
      
      // trigger execution
      await fetch(`/api/audits/${data.id}/start`, { method: 'POST' });
      
      navigate(`/audit/${data.id}/execute`);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  const populateDemo = async () => {
    setName("Q3 Treasury Operations Audit");
    setDepartment("Treasury & Finance");
    // Mock files
    const mockFile1 = new File(["dummy content"], "Treasury_Transfer_Log_Q3.csv", { type: "text/csv" });
    const mockFile2 = new File(["dummy content"], "Treasury_RCM_v2.pdf", { type: "application/pdf" });
    const mockFile3 = new File(["dummy content"], "Corporate_Policy_2026.pdf", { type: "application/pdf" });
    const mockFile4 = new File(["dummy content"], "Previous_Audit_Q2.pdf", { type: "application/pdf" });
    const mockFile5 = new File(["dummy content"], "Vendor_Master_Data.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const mockFile6 = new File(["dummy content"], "General_Ledger_Extract.csv", { type: "text/csv" });
    setFiles([mockFile1, mockFile2, mockFile3, mockFile4, mockFile5, mockFile6]);

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "Q3 Treasury Operations Audit", department: "Treasury & Finance" })
      });
      const data = await res.json();
      
      // trigger execution
      await fetch(`/api/audits/${data.id}/start`, { method: 'POST' });
      
      navigate(`/audit/${data.id}/execute`);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Create New Audit</h1>
            <p className="text-muted-foreground">Upload business data and let AI orchestrate the workflow.</p>
          </div>
          <Button variant="outline" onClick={populateDemo} className="gap-2 text-primary border-primary/20 hover:bg-primary/10">
            <Sparkles className="h-4 w-4" /> Load Demo Data
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Audit Details</CardTitle>
            <CardDescription>Provide basic context or let the AI automatically determine the scope.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Audit Name</label>
              <input 
                type="text" 
                className="w-full h-10 px-3 rounded-md border bg-background"
                placeholder="e.g., Q3 Treasury Audit"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department (Optional)</label>
              <input 
                type="text" 
                className="w-full h-10 px-3 rounded-md border bg-background"
                placeholder="Leave blank for Auto Detect"
                value={department}
                onChange={e => setDepartment(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Business Documents</label>
              <p className="text-xs text-muted-foreground mb-2">Upload RCMs, SOPs, GL Extracts, CSVs, or PDFs.</p>
              
              <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">Drag and drop files here</p>
                <p className="text-xs text-muted-foreground mb-4">Support for PDF, CSV, Excel</p>
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  id="file-upload"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="secondary" asChild><span className="pointer-events-none">Select Files</span></Button>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-md border bg-card text-sm">
                      <div className="flex items-center gap-3">
                        <File className="h-4 w-4 text-primary" />
                        <span className="font-medium">{f.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <Button size="lg" onClick={startAudit} disabled={isSubmitting || !name || files.length === 0} className="w-full sm:w-auto">
                {isSubmitting ? 'Initializing Orchestrator...' : 'Start AI Audit Workflow'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
