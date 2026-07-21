import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft, Layers } from 'lucide-react';
import { useStore } from '@/src/store';
import { Badge } from '@/src/components/ui/badge';
import { ApiClient } from '@/src/lib/api';

export default function ReviewCenter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();

  const { data: audit, isLoading, error } = useQuery({
    queryKey: ['audit', id],
    queryFn: async () => {
      if (!user || !id) return null;
      return ApiClient.get(`/audits/${id}`);
    },
    enabled: !!user && !!id
  });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="p-6 h-full flex items-center justify-center bg-[#F8F9FA]">
          <p className="text-sm text-[#6C757D]">Loading workspace...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !audit) {
    return (
      <PageLayout>
        <div className="p-6 h-full flex flex-col items-center justify-center bg-[#F8F9FA]">
          <p className="text-sm text-[#DC3545] mb-4">Failed to load workspace</p>
          <Button onClick={() => navigate('/dashboard')} variant="outline">Return to Dashboard</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-full bg-[#F8F9FA]">
        <header className="h-14 border-b border-[#DEE2E6] bg-white flex items-center px-4 shrink-0 justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="h-8 w-8 text-[#6C757D]">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-[15px] font-semibold text-[#212529] leading-tight">{audit.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-[#6C757D]">{audit.department}</span>
                <span className="text-[#DEE2E6]">•</span>
                <span className="text-[11px] text-[#6C757D]">{audit.financialYear}</span>
              </div>
            </div>
          </div>
          <div>
            <Badge variant="outline" className="rounded-sm text-[10px] font-semibold tracking-wide border-[#005A9E] text-[#005A9E] bg-[#E5F0FA]">
              {audit.status.toUpperCase()}
            </Badge>
          </div>
        </header>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full shadow-sm border-[#DEE2E6]">
            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 bg-[#E5F0FA] rounded-full flex items-center justify-center">
                <Layers className="h-6 w-6 text-[#005A9E]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#212529] mb-1">Workspace Foundation</h3>
                <p className="text-[13px] text-[#6C757D] mb-4">
                  The infrastructure for this audit workspace is provisioned. Business logic, document processing, and planning tools will be integrated in future sprints.
                </p>
              </div>
              <Button onClick={() => navigate('/dashboard')} className="w-full bg-[#005A9E] hover:bg-[#004578]">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
