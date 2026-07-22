import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft, Building2, Calendar, Layers } from 'lucide-react';
import { toast } from 'sonner';

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
  ])
});

type FormData = z.infer<typeof schema>;

export default function CreateAudit() {
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      financialYear: '2025-26',
      auditType: 'Operational Audit',
      department: 'Finance & Treasury'
    }
  });

  const onSubmit = async (data: FormData) => {
    // Navigate straight to the workspace where they will upload documents
    // and generate planning. We use a mock ID for demo purposes.
    const mockId = Math.random().toString(36).substring(7);
    toast.success("Planning started. Please upload required documents.");
    navigate(`/audit/${mockId}/workspace`);
  };

  return (
    <PageLayout>
      <div className="p-6 max-w-[800px] mx-auto h-full flex flex-col">
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="h-8 w-8 text-[#005A9E] hover:bg-[#E5F0FA]">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#212529] mb-1">Create Planning</h1>
            <p className="text-sm text-[#6C757D]">Select the foundational details for the upcoming engagement.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1 overflow-y-auto pb-20">
          <Card className="rounded-sm shadow-sm border-[#DEE2E6] bg-white">
            <CardHeader className="border-b border-[#DEE2E6] bg-[#F8F9FA]/50 p-4">
              <CardTitle className="text-[14px] font-semibold text-[#212529] flex items-center gap-2">
                 Engagement Context
              </CardTitle>
              <CardDescription className="text-xs text-[#6C757D]">
                 The audit name will be auto-extracted by AI from the uploaded Previous Audit Report.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#212529] flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#005A9E]" /> Financial Year
                  </label>
                  <Controller
                    name="financialYear"
                    control={control}
                    render={({ field }) => (
                      <select 
                        {...field}
                        className="w-full h-9 text-[13px] border border-[#DEE2E6] rounded-sm px-3 focus:outline-none focus:border-[#005A9E] bg-white"
                      >
                        <option value="2025-26">2025-26</option>
                        <option value="2026-27">2026-27</option>
                        <option value="2027-28">2027-28</option>
                        <option value="2028-29">2028-29</option>
                      </select>
                    )}
                  />
                  {errors.financialYear && <p className="text-xs text-red-500">{errors.financialYear.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#212529] flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-[#005A9E]" /> Audit Type
                  </label>
                  <Controller
                    name="auditType"
                    control={control}
                    render={({ field }) => (
                      <select 
                        {...field}
                        className="w-full h-9 text-[13px] border border-[#DEE2E6] rounded-sm px-3 focus:outline-none focus:border-[#005A9E] bg-white"
                      >
                        <option value="Operational Audit">Operational Audit</option>
                        <option value="Financial Audit">Financial Audit</option>
                        <option value="Compliance Audit">Compliance Audit</option>
                        <option value="Information Technology Audit">Information Technology Audit</option>
                        <option value="Strategic Audit">Strategic Audit</option>
                      </select>
                    )}
                  />
                  {errors.auditType && <p className="text-xs text-red-500">{errors.auditType.message}</p>}
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-[#212529] flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-[#005A9E]" /> Department
                  </label>
                  <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                      <select 
                        {...field}
                        className="w-full h-9 text-[13px] border border-[#DEE2E6] rounded-sm px-3 focus:outline-none focus:border-[#005A9E] bg-white"
                      >
                        <option value="Finance & Treasury">Finance & Treasury</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Operations">Operations</option>
                        <option value="Legal & Compliance">Legal & Compliance</option>
                      </select>
                    )}
                  />
                  {errors.department && <p className="text-xs text-red-500">{errors.department.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4 border-t border-[#DEE2E6]">
             <Button type="submit" className="bg-[#005A9E] hover:bg-[#004578] rounded-sm h-9 px-6 font-medium">
               Continue to Required Documents
             </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
