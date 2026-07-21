import React from 'react';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Layout } from 'lucide-react';

export default function EmptyFeature({ title, description }: { title: string, description: string }) {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <div className="flex flex-col h-full bg-[#F8F9FA] p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#212529] mb-1">{title}</h1>
          <p className="text-sm text-[#6C757D]">{description}</p>
        </header>
        
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full shadow-sm border-[#DEE2E6]">
            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 bg-[#E5F0FA] rounded-full flex items-center justify-center">
                <Layout className="h-6 w-6 text-[#005A9E]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#212529] mb-1">Foundation Ready</h3>
                <p className="text-[13px] text-[#6C757D] mb-4">
                  The infrastructure for this module is provisioned. Business logic will be integrated in Sprint 2.
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
