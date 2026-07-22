import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend } from 'recharts';

const riskData = [
  { name: 'High Risk', value: 3, color: '#A80000' },
  { name: 'Medium Risk', value: 8, color: '#FFC107' },
  { name: 'Low Risk', value: 12, color: '#198754' },
];

const effectivenessData = [
  { name: 'Effective', value: 60, fill: '#198754' },
  { name: 'Needs Imp.', value: 25, fill: '#FFC107' },
  { name: 'Ineffective', value: 15, fill: '#A80000' },
];

export function EnterpriseAnalytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#212529] border-b border-[#DEE2E6] pb-3">Enterprise AI Analytics Dashboard</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold">Inherent Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[250px] flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                   {riskData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <PieTooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #DEE2E6' }} />
               </PieChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold">Control Effectiveness Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={effectivenessData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E9ECEF" />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6C757D' }} width={80} />
                 <BarTooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #DEE2E6' }} />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold">Planning Readiness Gauge</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-[#005A9E] mb-2">92%</div>
            <p className="text-sm text-[#6C757D]">Ready for Fieldwork</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold">AI Confidence Score</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-[#198754] mb-2">94%</div>
            <p className="text-sm text-[#6C757D]">Extraction Accuracy</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
            <CardTitle className="text-sm font-semibold">Regulatory Compliance</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-[#A80000] mb-2">Issue Found</div>
            <p className="text-sm text-[#6C757D]">Notice dated 15-May</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
