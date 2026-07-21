import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ApiClient } from '@/src/lib/api';

const schema = z.object({
  name: z.string().min(1, "Audit name is required"),
  financialYear: z.string().min(1, "Financial year is required"),
  department: z.string().min(1, "Department is required"),
  businessUnit: z.string().optional(),
  auditType: z.string().min(1, "Audit type is required"),
  planningLeadId: z.string().optional(),
  auditManagerId: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  expectedEndDate: z.string().min(1, "End date is required"),
  priority: z.string().default("Medium"),
  status: z.string().default("Planning"),
  description: z.string().optional()
});

type FormData = z.infer<typeof schema>;

export default function CreateAudit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => ApiClient.get('/users')
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'Medium', status: 'Planning' }
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => ApiClient.post('/audits', data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      toast.success("Audit engagement created successfully");
      navigate(`/dashboard`);
    },
    onError: (err: any) => toast.error(err.message)
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <PageLayout>
      <div className="p-6 max-w-[1000px] mx-auto h-full flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="h-8 w-8 text-[#6C757D]">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#212529] mb-1">Create Audit Planning</h1>
            <p className="text-sm text-[#6C757D]">Initialize a new engagement workspace.</p>
          </div>
        </div>

        <Card className="rounded-sm shadow-sm border-[#DEE2E6] bg-white flex-1 overflow-y-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Section 1: Core Details */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#212529] border-b border-[#DEE2E6] pb-2 mb-4">Core Identification</h3>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1 col-span-2">
                      <label className="text-[13px] font-semibold text-[#212529]">Audit Name <span className="text-[#DC3545]">*</span></label>
                      <input 
                        {...register("name")}
                        type="text" 
                        className={`w-full h-9 px-3 rounded-sm border ${errors.name ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                        placeholder="e.g., Q3 Operational Review of EMEA Data Centers"
                      />
                      {errors.name && <p className="text-[11px] text-[#DC3545]">{errors.name.message}</p>}
                   </div>

                   <div className="space-y-1">
                      <label className="text-[13px] font-semibold text-[#212529]">Financial Year <span className="text-[#DC3545]">*</span></label>
                      <select 
                        {...register("financialYear")}
                        className={`w-full h-9 px-3 rounded-sm border ${errors.financialYear ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                      >
                        <option value="">Select Year...</option>
                        <option value="2025-26">2025-26</option>
                        <option value="2026-27">2026-27</option>
                        <option value="2027-28">2027-28</option>
                      </select>
                      {errors.financialYear && <p className="text-[11px] text-[#DC3545]">{errors.financialYear.message}</p>}
                   </div>

                   <div className="space-y-1">
                      <label className="text-[13px] font-semibold text-[#212529]">Audit Type <span className="text-[#DC3545]">*</span></label>
                      <select 
                        {...register("auditType")}
                        className={`w-full h-9 px-3 rounded-sm border ${errors.auditType ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                      >
                        <option value="">Select Type...</option>
                        <option value="Operational">Operational</option>
                        <option value="Financial">Financial</option>
                        <option value="Compliance">Compliance</option>
                        <option value="IT">Information Technology</option>
                        <option value="Strategic">Strategic</option>
                      </select>
                      {errors.auditType && <p className="text-[11px] text-[#DC3545]">{errors.auditType.message}</p>}
                   </div>
                   
                   <div className="space-y-1">
                      <label className="text-[13px] font-semibold text-[#212529]">Department <span className="text-[#DC3545]">*</span></label>
                      <select 
                        {...register("department")}
                        className={`w-full h-9 px-3 rounded-sm border ${errors.department ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                      >
                        <option value="">Select Department...</option>
                        <option value="Finance">Finance & Treasury</option>
                        <option value="IT">Information Technology</option>
                        <option value="HR">Human Resources</option>
                        <option value="Operations">Operations</option>
                        <option value="Legal">Legal & Compliance</option>
                      </select>
                      {errors.department && <p className="text-[11px] text-[#DC3545]">{errors.department.message}</p>}
                   </div>

                   <div className="space-y-1">
                      <label className="text-[13px] font-semibold text-[#212529]">Business Unit</label>
                      <input 
                        {...register("businessUnit")}
                        type="text" 
                        className={`w-full h-9 px-3 rounded-sm border ${errors.businessUnit ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                        placeholder="e.g., EMEA Retail"
                      />
                   </div>
                </div>
              </div>

              {/* Section 2: Planning & Resources */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#212529] border-b border-[#DEE2E6] pb-2 mb-4">Planning & Resources</h3>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-[13px] font-semibold text-[#212529]">Planning Lead</label>
                      <select 
                        {...register("planningLeadId")}
                        className={`w-full h-9 px-3 rounded-sm border ${errors.planningLeadId ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                      >
                        <option value="">Unassigned</option>
                        {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                   </div>
                   
                   <div className="space-y-1">
                      <label className="text-[13px] font-semibold text-[#212529]">Audit Manager</label>
                      <select 
                        {...register("auditManagerId")}
                        className={`w-full h-9 px-3 rounded-sm border ${errors.auditManagerId ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                      >
                        <option value="">Unassigned</option>
                        {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[13px] font-semibold text-[#212529]">Start Date <span className="text-[#DC3545]">*</span></label>
                      <input 
                        {...register("startDate")}
                        type="date" 
                        className={`w-full h-9 px-3 rounded-sm border ${errors.startDate ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                      />
                      {errors.startDate && <p className="text-[11px] text-[#DC3545]">{errors.startDate.message}</p>}
                   </div>

                   <div className="space-y-1">
                      <label className="text-[13px] font-semibold text-[#212529]">Expected End Date <span className="text-[#DC3545]">*</span></label>
                      <input 
                        {...register("expectedEndDate")}
                        type="date" 
                        className={`w-full h-9 px-3 rounded-sm border ${errors.expectedEndDate ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                      />
                      {errors.expectedEndDate && <p className="text-[11px] text-[#DC3545]">{errors.expectedEndDate.message}</p>}
                   </div>
                </div>
              </div>

              {/* Section 3: Priority & Status */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#212529] border-b border-[#DEE2E6] pb-2 mb-4">Metadata & Description</h3>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-[13px] font-semibold text-[#212529]">Priority</label>
                      <select 
                        {...register("priority")}
                        className={`w-full h-9 px-3 rounded-sm border border-[#DEE2E6] bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                   </div>
                   
                   <div className="space-y-1">
                      <label className="text-[13px] font-semibold text-[#212529]">Planning Status</label>
                      <select 
                        {...register("status")}
                        className={`w-full h-9 px-3 rounded-sm border border-[#DEE2E6] bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="Planning">Planning</option>
                        <option value="Fieldwork">Fieldwork</option>
                        <option value="Reporting">Reporting</option>
                        <option value="Closed">Closed</option>
                      </select>
                   </div>
                   
                   <div className="space-y-1 col-span-2">
                      <label className="text-[13px] font-semibold text-[#212529]">High-Level Description</label>
                      <textarea 
                        {...register("description")}
                        rows={4}
                        className={`w-full p-3 rounded-sm border border-[#DEE2E6] bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E] resize-none`}
                        placeholder="Brief overview of the audit objectives..."
                      />
                   </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-[#DEE2E6]">
                 <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="h-9 rounded-sm text-[13px]">
                   Cancel
                 </Button>
                 <Button type="submit" disabled={mutation.isPending} className="h-9 rounded-sm bg-[#005A9E] hover:bg-[#004578] text-white text-[13px]">
                   {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   Create Audit Engagement
                 </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
