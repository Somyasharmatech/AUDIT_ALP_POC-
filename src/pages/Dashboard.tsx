import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/src/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Plus, Search, Filter, Briefcase, AlertTriangle, CheckCircle, Clock, BarChart3, ChevronRight } from 'lucide-react';
import { ApiClient } from '@/src/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [financialYear, setFinancialYear] = useState('');
  const [department, setDepartment] = useState('');

  const { data: rawAudits, isLoading } = useQuery({
    queryKey: ['audits', search, financialYear, department],
    queryFn: () => {
      const params: any = {};
      if (search) params.search = search;
      if (financialYear) params.financialYear = financialYear;
      if (department) params.department = department;
      return ApiClient.get('/audits', params);
    }
  });

  const audits = Array.isArray(rawAudits) ? rawAudits : (rawAudits as any)?.items || [];

  const totalAudits = (rawAudits as any)?.total ?? audits.length;
  const completedPlanning = audits.filter((a: any) => a.status === 'Fieldwork' || a.status === 'Reporting' || a.status === 'Closed').length;
  const pendingPlanning = audits.filter((a: any) => a.status === 'Planning' || a.status === 'Not Started').length;
  const highRisk = audits.filter((a: any) => a.priority === 'High').length;
  const mediumRisk = audits.filter((a: any) => a.priority === 'Medium').length;
  const lowRisk = audits.filter((a: any) => a.priority === 'Low').length;

  // Aggregate departments for chart
  const deptCounts = audits.reduce((acc: any, audit: any) => {
    acc[audit.department] = (acc[audit.department] || 0) + 1;
    return acc;
  }, {});
  
  const chartData = Object.keys(deptCounts).map(dept => ({
    name: dept,
    count: deptCounts[dept]
  }));

  const COLORS = ['#005A9E', '#198754', '#FFC107', '#DC3545', '#6F42C1', '#17A2B8'];

  return (
    <PageLayout>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#212529] mb-1">Annual Audit Dashboard</h1>
            <p className="text-sm text-[#6C757D]">Overview of organizational audit planning and execution.</p>
          </div>
          <Button onClick={() => navigate('/audit/new')} className="bg-[#005A9E] hover:bg-[#004578] rounded-sm h-9 gap-2">
            <Plus className="h-4 w-4" /> Create Audit Planning
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="rounded-sm shadow-sm border-[#DEE2E6] bg-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#6C757D] uppercase tracking-wider mb-1">Total Audits</p>
                <p className="text-2xl font-bold text-[#212529]">{totalAudits}</p>
              </div>
              <div className="h-10 w-10 bg-[#F8F9FA] rounded flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-[#005A9E]" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-sm shadow-sm border-[#DEE2E6] bg-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#6C757D] uppercase tracking-wider mb-1">Completed Planning</p>
                <p className="text-2xl font-bold text-[#198754]">{completedPlanning}</p>
              </div>
              <div className="h-10 w-10 bg-[#F8F9FA] rounded flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-[#198754]" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm shadow-sm border-[#DEE2E6] bg-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#6C757D] uppercase tracking-wider mb-1">Pending Planning</p>
                <p className="text-2xl font-bold text-[#FFC107]">{pendingPlanning}</p>
              </div>
              <div className="h-10 w-10 bg-[#F8F9FA] rounded flex items-center justify-center">
                <Clock className="h-5 w-5 text-[#FFC107]" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm shadow-sm border-[#DEE2E6] bg-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#6C757D] uppercase tracking-wider mb-1">Risk Profile</p>
                <div className="flex gap-2 items-end">
                   <span className="text-xl font-bold text-[#DC3545]" title="High Risk">{highRisk}</span>
                   <span className="text-sm font-bold text-[#DEE2E6] mb-1">/</span>
                   <span className="text-lg font-bold text-[#FFC107]" title="Medium Risk">{mediumRisk}</span>
                   <span className="text-sm font-bold text-[#DEE2E6] mb-1">/</span>
                   <span className="text-md font-bold text-[#198754]" title="Low Risk">{lowRisk}</span>
                </div>
              </div>
              <div className="h-10 w-10 bg-[#F8F9FA] rounded flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-[#DC3545]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
           {/* Chart */}
           <Card className="rounded-sm shadow-sm border-[#DEE2E6] bg-white col-span-1">
             <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
               <CardTitle className="text-[14px] font-semibold text-[#212529] flex items-center gap-2">
                 <BarChart3 className="h-4 w-4 text-[#005A9E]" /> Department Distribution
               </CardTitle>
             </CardHeader>
             <CardContent className="p-4 h-[250px]">
               {chartData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#495057' }} width={100} />
                     <Tooltip cursor={{fill: '#F8F9FA'}} contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #DEE2E6' }} />
                     <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="h-full flex items-center justify-center text-[12px] text-[#6C757D]">No data available</div>
               )}
             </CardContent>
           </Card>

           {/* Table */}
           <Card className="rounded-sm shadow-sm border-[#DEE2E6] bg-white col-span-2 flex flex-col">
              <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50 flex flex-row items-center justify-between shrink-0">
                 <div className="flex items-center gap-3">
                   <div className="relative">
                     <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
                     <input 
                       type="text" 
                       placeholder="Search audits..." 
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       className="h-8 pl-8 pr-3 text-[13px] border border-[#DEE2E6] rounded-sm focus:outline-none focus:border-[#005A9E] w-64 bg-white" 
                     />
                   </div>
                   <select
                     value={financialYear}
                     onChange={(e) => setFinancialYear(e.target.value)}
                     className="h-8 text-[13px] border border-[#DEE2E6] rounded-sm px-3 focus:outline-none focus:border-[#005A9E] bg-white"
                   >
                     <option value="">All Years</option>
                     <option value="2025-26">2025-26</option>
                     <option value="2026-27">2026-27</option>
                   </select>
                   <select
                     value={department}
                     onChange={(e) => setDepartment(e.target.value)}
                     className="h-8 text-[13px] border border-[#DEE2E6] rounded-sm px-3 focus:outline-none focus:border-[#005A9E] bg-white"
                   >
                     <option value="">All Depts</option>
                     <option value="Finance">Finance & Treasury</option>
                     <option value="IT">IT</option>
                     <option value="HR">HR</option>
                     <option value="Operations">Operations</option>
                   </select>
                 </div>
              </CardHeader>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-[13px] text-left">
                  <thead className="text-[11px] uppercase tracking-wider bg-[#FFFFFF] text-[#6C757D] border-b border-[#DEE2E6] sticky top-0">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Engagement Name</th>
                      <th className="px-4 py-2 font-semibold">Department</th>
                      <th className="px-4 py-2 font-semibold">Year</th>
                      <th className="px-4 py-2 font-semibold">Status</th>
                      <th className="px-4 py-2 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DEE2E6]">
                    {isLoading ? (
                      <tr><td colSpan={5} className="p-4 text-center text-[#6C757D]">Loading...</td></tr>
                    ) : audits.length === 0 ? (
                      <tr><td colSpan={5} className="p-4 text-center text-[#6C757D]">No audits found.</td></tr>
                    ) : (
                      audits.map((audit: any) => (
                        <tr key={audit.id} className="hover:bg-[#F8F9FA] transition-colors">
                          <td className="px-4 py-2.5 font-medium text-[#005A9E] cursor-pointer hover:underline" onClick={() => navigate(`/audit/${audit.id}/workspace`)}>
                            {audit.name}
                          </td>
                          <td className="px-4 py-2.5 text-[#495057]">{audit.department}</td>
                          <td className="px-4 py-2.5 text-[#495057]">{audit.financialYear}</td>
                          <td className="px-4 py-2.5">
                            <Badge variant="outline" className={`rounded-sm text-[10px] font-semibold tracking-wide ${
                              audit.status === 'Planning' ? 'border-[#FFC107] text-[#FFC107]' :
                              audit.status === 'Fieldwork' ? 'border-[#005A9E] text-[#005A9E]' :
                              audit.status === 'Closed' ? 'border-[#198754] text-[#198754]' :
                              'border-[#6C757D] text-[#6C757D]'
                            }`}>
                              {audit.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                             <Button variant="ghost" size="sm" onClick={() => navigate(`/audit/${audit.id}/workspace`)} className="h-7 text-xs text-[#005A9E] hover:bg-[#E5F0FA] font-medium gap-1 px-2">
                               Workspace <ChevronRight className="h-3.5 w-3.5" />
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
      </div>
    </PageLayout>
  );
}
