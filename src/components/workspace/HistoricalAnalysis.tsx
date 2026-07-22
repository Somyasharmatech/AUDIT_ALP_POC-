import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const trendData = [
  { year: '2021', findings: 18, open: 2, rating: 'Needs Improvement' },
  { year: '2022', findings: 14, open: 0, rating: 'Satisfactory' },
  { year: '2023', findings: 22, open: 5, rating: 'Needs Improvement' },
  { year: '2024', findings: 12, open: 3, rating: 'Satisfactory' },
  { year: '2025', findings: 15, open: 8, rating: 'Unsatisfactory' },
];

export function HistoricalAnalysis() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#212529] border-b border-[#DEE2E6] pb-3">Historical Audit Analysis</h2>
      
      <div className="grid grid-cols-4 gap-4">
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold text-[#6C757D] uppercase tracking-wider mb-1">5-Year Average Rating</p>
            <p className="text-xl font-bold text-[#FFC107]">Satisfactory</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold text-[#6C757D] uppercase tracking-wider mb-1">Total Open Findings</p>
            <p className="text-xl font-bold text-[#A80000]">8</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold text-[#6C757D] uppercase tracking-wider mb-1">Repeat Findings</p>
            <p className="text-xl font-bold text-[#A80000]">3</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold text-[#6C757D] uppercase tracking-wider mb-1">Management Action Rate</p>
            <p className="text-xl font-bold text-[#198754]">78%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold">5-Year Findings Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECEF" />
                 <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6C757D' }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6C757D' }} />
                 <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #DEE2E6' }} />
                 <Legend wrapperStyle={{ fontSize: '12px' }} />
                 <Line type="monotone" dataKey="findings" name="Total Findings" stroke="#005A9E" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                 <Line type="monotone" dataKey="open" name="Open Findings" stroke="#A80000" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
               </LineChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold">AI Commentary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-sm text-[#495057] space-y-4">
            <p>
              The historical trend indicates a spike in findings during 2023 and 2025. The 2025 increase is heavily correlated with the ERP system migration, resulting in 8 open findings currently pending management action.
            </p>
            <p>
              <strong className="text-[#A80000]">High Risk Pattern:</strong> There are 3 repeat findings related to manual journal entries and lack of dual authorization for vendor onboarding.
            </p>
            <p>
              <strong>Recommendation:</strong> Audit planning for FY26 should aggressively target IT General Controls and Vendor Master Data updates.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-[#DEE2E6]">
        <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
          <CardTitle className="text-sm font-semibold">Historical Ratings Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F8F9FA] text-[#6C757D] text-xs uppercase border-b border-[#DEE2E6]">
              <tr>
                <th className="px-4 py-3 font-semibold">Audit Area</th>
                <th className="px-4 py-3 font-semibold">2021</th>
                <th className="px-4 py-3 font-semibold">2022</th>
                <th className="px-4 py-3 font-semibold">2023</th>
                <th className="px-4 py-3 font-semibold">2024</th>
                <th className="px-4 py-3 font-semibold">2025</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DEE2E6]">
              <tr>
                <td className="px-4 py-3 font-medium text-[#212529]">Vendor Selection</td>
                <td className="px-4 py-3"><Badge className="bg-[#198754]">Satisfactory</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#198754]">Satisfactory</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#FFC107] text-[#856404]">Needs Imp.</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#198754]">Satisfactory</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#198754]">Satisfactory</Badge></td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#212529]">Purchase Orders</td>
                <td className="px-4 py-3"><Badge className="bg-[#FFC107] text-[#856404]">Needs Imp.</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#198754]">Satisfactory</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#198754]">Satisfactory</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#198754]">Satisfactory</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#A80000]">Unsatisfactory</Badge></td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#212529]">Invoice Processing</td>
                <td className="px-4 py-3"><Badge className="bg-[#A80000]">Unsatisfactory</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#198754]">Satisfactory</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#A80000]">Unsatisfactory</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#FFC107] text-[#856404]">Needs Imp.</Badge></td>
                <td className="px-4 py-3"><Badge className="bg-[#A80000]">Unsatisfactory</Badge></td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
