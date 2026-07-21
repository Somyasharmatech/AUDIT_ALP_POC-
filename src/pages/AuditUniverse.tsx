import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/src/components/ui/dialog';
import { Plus, Search, Filter, Pencil, Trash2, Loader2, Download } from 'lucide-react';
import { ApiClient } from '@/src/lib/api';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  department: z.string().min(1, "Department is required"),
  auditEntity: z.string().min(1, "Audit entity is required"),
  businessCriticality: z.string().min(1, "Criticality is required"),
  auditFrequency: z.string().min(1, "Frequency is required"),
  status: z.string().min(1, "Status is required")
});

type FormData = z.infer<typeof schema>;

function SkeletonTable() {
  return (
    <div className="w-full animate-pulse">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="h-12 border-b border-[#DEE2E6] flex items-center px-4 gap-4">
          <div className="h-4 bg-[#E9ECEF] rounded w-1/4"></div>
          <div className="h-4 bg-[#E9ECEF] rounded w-1/5"></div>
          <div className="h-4 bg-[#E9ECEF] rounded w-1/6"></div>
          <div className="h-4 bg-[#E9ECEF] rounded w-1/6"></div>
        </div>
      ))}
    </div>
  );
}

export default function AuditUniverse() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const queryClient = useQueryClient();

  const { data: rawUniverse, isLoading } = useQuery({
    queryKey: ['universe', search, department],
    queryFn: async () => {
      const params: any = {};
      if (search) params.search = search;
      if (department) params.department = department;
      return ApiClient.get('/universe', params);
    }
  });

  const universe = Array.isArray(rawUniverse) ? rawUniverse : (rawUniverse as any)?.items || [];

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { businessCriticality: 'Medium', auditFrequency: 'Annual', status: 'Active' }
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => ApiClient.post('/universe', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universe'] });
      toast.success("Entity added successfully");
      setIsCreateOpen(false);
      reset();
    },
    onError: (err: any) => toast.error(err.message)
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: FormData }) => ApiClient.put(`/universe/${data.id}`, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universe'] });
      toast.success("Entity updated successfully");
      setEditingItem(null);
      reset();
    },
    onError: (err: any) => toast.error(err.message)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ApiClient.delete(`/universe/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universe'] });
      toast.success("Entity removed successfully");
    },
    onError: (err: any) => toast.error(err.message)
  });

  const onSubmit = (data: FormData) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, payload: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setValue('department', item.department);
    setValue('auditEntity', item.auditEntity);
    setValue('businessCriticality', item.businessCriticality);
    setValue('auditFrequency', item.auditFrequency);
    setValue('status', item.status);
    setIsCreateOpen(true);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <PageLayout>
      <div className="p-6 max-w-[1600px] mx-auto h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#212529] mb-1">Audit Universe</h1>
            <p className="text-sm text-[#6C757D]">Define the complete scope of organizational auditable entities.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-8 border-[#DEE2E6] text-[#212529]">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button 
              onClick={() => { reset(); setEditingItem(null); setIsCreateOpen(true); }} 
              className="h-8 gap-2 bg-[#005A9E] hover:bg-[#004578] text-white"
            >
              <Plus className="h-4 w-4" /> Add Entity
            </Button>
          </div>
        </div>

        <Card className="rounded-sm shadow-sm border-[#DEE2E6] bg-white flex-1 flex flex-col min-h-0">
          <CardHeader className="p-4 border-b border-[#DEE2E6] flex flex-row items-center justify-between bg-[#F8F9FA]/50 shrink-0">
            <div className="flex items-center gap-3">
               <div className="relative">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
                 <input 
                   type="text" 
                   placeholder="Search entities..." 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="h-8 pl-8 pr-3 text-[13px] border border-[#DEE2E6] rounded-sm focus:outline-none focus:border-[#005A9E] w-64" 
                 />
               </div>
               <select
                 value={department}
                 onChange={(e) => setDepartment(e.target.value)}
                 className="h-8 text-[13px] border border-[#DEE2E6] rounded-sm px-3 focus:outline-none focus:border-[#005A9E]"
               >
                 <option value="">All Departments</option>
                 <option value="Finance">Finance & Treasury</option>
                 <option value="IT">Information Technology</option>
                 <option value="HR">Human Resources</option>
                 <option value="Operations">Operations</option>
               </select>
            </div>
            <div className="text-[13px] text-[#6C757D]">
              {universe.length} Entities
            </div>
          </CardHeader>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-[13px] text-left">
              <thead className="text-[11px] uppercase tracking-wider bg-[#FFFFFF] text-[#6C757D] border-b border-[#DEE2E6] sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 font-semibold">Audit Entity</th>
                  <th className="px-6 py-3 font-semibold">Department</th>
                  <th className="px-6 py-3 font-semibold">Criticality</th>
                  <th className="px-6 py-3 font-semibold">Frequency</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE2E6]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <SkeletonTable />
                    </td>
                  </tr>
                ) : universe.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#6C757D] text-[13px]">
                      No audit entities found.
                    </td>
                  </tr>
                ) : (
                  universe.map((item: any) => (
                    <tr key={item.id} className="hover:bg-[#F8F9FA] transition-colors group">
                      <td className="px-6 py-3.5 font-medium text-[#212529]">
                        {item.auditEntity}
                      </td>
                      <td className="px-6 py-3.5 text-[#495057]">{item.department}</td>
                      <td className="px-6 py-3.5">
                        <Badge variant="outline" className={`rounded-sm text-[10px] font-semibold tracking-wide ${item.businessCriticality === 'High' ? 'border-[#DC3545] text-[#DC3545]' : item.businessCriticality === 'Medium' ? 'border-[#FFC107] text-[#FFC107]' : 'border-[#198754] text-[#198754]'}`}>
                          {item.businessCriticality.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-[#495057]">{item.auditFrequency}</td>
                      <td className="px-6 py-3.5">
                         <Badge variant="outline" className={`rounded-sm text-[10px] font-semibold tracking-wide ${item.status === 'Active' ? 'border-[#198754] text-[#198754] bg-[#198754]/10' : 'border-[#6C757D] text-[#6C757D] bg-[#F8F9FA]'}`}>
                          {item.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-7 w-7 text-[#005A9E] hover:bg-[#E5F0FA]">
                           <Pencil className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)} className="h-7 w-7 text-[#DC3545] hover:bg-[#DC3545]/10 ml-1">
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={(v) => { setIsCreateOpen(v); if (!v) setEditingItem(null); }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Audit Entity' : 'Add Audit Entity'}</DialogTitle>
            <DialogDescription>Define the attributes for this auditable entity in the universe.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
             <div className="space-y-1">
                <label className="text-[13px] font-semibold text-[#212529]">Audit Entity Name <span className="text-[#DC3545]">*</span></label>
                <input 
                  {...register("auditEntity")}
                  type="text" 
                  className={`w-full h-9 px-3 rounded-sm border ${errors.auditEntity ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                  placeholder="e.g., Global Payroll Processing"
                />
                {errors.auditEntity && <p className="text-[11px] text-[#DC3545]">{errors.auditEntity.message}</p>}
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

             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[13px] font-semibold text-[#212529]">Business Criticality <span className="text-[#DC3545]">*</span></label>
                  <select 
                    {...register("businessCriticality")}
                    className={`w-full h-9 px-3 rounded-sm border ${errors.businessCriticality ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
               </div>
               <div className="space-y-1">
                  <label className="text-[13px] font-semibold text-[#212529]">Audit Frequency <span className="text-[#DC3545]">*</span></label>
                  <select 
                    {...register("auditFrequency")}
                    className={`w-full h-9 px-3 rounded-sm border ${errors.auditFrequency ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                  >
                    <option value="Annual">Annual</option>
                    <option value="Biennial">Biennial (2 yrs)</option>
                    <option value="Triennial">Triennial (3 yrs)</option>
                    <option value="Ad-hoc">Ad-hoc</option>
                  </select>
               </div>
             </div>
             
             <div className="space-y-1">
                <label className="text-[13px] font-semibold text-[#212529]">Status <span className="text-[#DC3545]">*</span></label>
                <select 
                  {...register("status")}
                  className={`w-full h-9 px-3 rounded-sm border ${errors.status ? 'border-[#DC3545]' : 'border-[#DEE2E6]'} bg-[#FFFFFF] text-[13px] focus:outline-none focus:border-[#005A9E] focus:ring-1 focus:ring-[#005A9E]`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Retired">Retired</option>
                </select>
             </div>

             <div className="pt-4 flex justify-end gap-3 border-t border-[#DEE2E6]">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateOpen(false)} 
                  className="h-9 rounded-sm text-[13px]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting} 
                  className="h-9 rounded-sm bg-[#005A9E] hover:bg-[#004578] text-white text-[13px]"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    editingItem ? 'Update Entity' : 'Add Entity'
                  )}
                </Button>
              </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
