import React from 'react';
import { Badge } from '@/src/components/ui/badge';

export function ProcessFlow() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#212529] border-b border-[#DEE2E6] pb-3">AI Generated Process Flow</h2>
      
      <div className="flex flex-col items-center py-10 bg-[#F8F9FA] border border-[#DEE2E6] rounded-sm shadow-sm relative overflow-hidden">
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge variant="outline" className="border-[#005A9E] text-[#005A9E] bg-[#E5F0FA]">Auto-Extracted BPMN</Badge>
        </div>
        
        <div className="absolute top-4 left-4 flex flex-col gap-2 bg-white p-3 border border-[#DEE2E6] rounded-sm shadow-sm text-[10px] uppercase font-bold text-[#6C757D]">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#E5F0FA] border border-[#005A9E]"></div> INPUT / OUTPUT</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border border-[#DEE2E6]"></div> PROCESS / ACTIVITY</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FFF3CD] border border-[#FFC107] rounded-full"></div> DECISION POINT</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FDF2F2] border border-[#A80000]"></div> MANUAL CONTROL</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#E6F4EA] border border-[#198754]"></div> AUTO CONTROL</div>
        </div>
        
        {/* BPMN Nodes */}
        <div className="w-72 text-center p-3 bg-[#E5F0FA] border-2 border-[#005A9E] rounded-sm font-semibold text-[#005A9E] shadow-sm">
          <div className="text-[10px] text-[#6C757D] uppercase tracking-wider mb-1">Input</div>
          Purchase Requisition
        </div>
        
        <div className="h-10 w-px bg-[#495057] relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-[#495057] rotate-45"></div>
        </div>
        
        <div className="w-72 text-center p-3 bg-white border-2 border-[#DEE2E6] rounded-sm text-[#212529] shadow-sm">
           <div className="text-[10px] text-[#6C757D] uppercase tracking-wider mb-1">Activity</div>
           Vendor Selection & Bidding
           <div className="mt-2 flex justify-center"><Badge className="bg-[#FDF2F2] text-[#A80000] border-[#A80000] text-[9px] hover:bg-[#FDF2F2]">Manual Control: 3 Quotes Req.</Badge></div>
        </div>

        <div className="h-10 w-px bg-[#495057] relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-[#495057] rotate-45"></div>
        </div>

        <div className="w-72 text-center p-4 bg-[#FFF3CD] border-2 border-[#FFC107] rounded-full font-semibold text-[#856404] shadow-sm">
          <div className="text-[10px] text-[#856404] uppercase tracking-wider mb-1">Decision</div>
          PO Value {'>'} $50k?
        </div>

        <div className="h-10 w-px bg-[#495057] relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-[#495057] rotate-45"></div>
        </div>

        <div className="w-72 text-center p-3 bg-white border-2 border-[#DEE2E6] rounded-sm text-[#212529] shadow-sm relative">
           <div className="text-[10px] text-[#6C757D] uppercase tracking-wider mb-1">Activity</div>
           VP Approval & PO Generation
           <div className="absolute -right-28 top-1/2 -translate-y-1/2"><Badge className="bg-[#FDF2F2] text-[#A80000] border-[#A80000] text-[9px] hover:bg-[#FDF2F2]">Risk: Unauthorized Approval</Badge></div>
        </div>

        <div className="h-10 w-px bg-[#495057] relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-[#495057] rotate-45"></div>
        </div>

        <div className="w-72 text-center p-3 bg-white border-2 border-[#DEE2E6] rounded-sm text-[#212529] shadow-sm">
           <div className="text-[10px] text-[#6C757D] uppercase tracking-wider mb-1">Activity</div>
           Goods Receipt (GRN)
        </div>

        <div className="h-10 w-px bg-[#495057] relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-[#495057] rotate-45"></div>
        </div>

        <div className="w-72 text-center p-4 bg-[#FFF3CD] border-2 border-[#FFC107] rounded-full font-semibold text-[#856404] shadow-sm">
          <div className="text-[10px] text-[#856404] uppercase tracking-wider mb-1">Decision</div>
          3-Way Match Successful?
          <div className="mt-2 flex justify-center"><Badge className="bg-[#E6F4EA] text-[#198754] border-[#198754] text-[9px] hover:bg-[#E6F4EA]">Auto Control: ERP Match</Badge></div>
        </div>

        <div className="h-10 w-px bg-[#495057] relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-[#495057] rotate-45"></div>
        </div>

        <div className="w-72 text-center p-3 bg-[#E5F0FA] border-2 border-[#005A9E] rounded-sm font-semibold text-[#005A9E] shadow-sm">
          <div className="text-[10px] text-[#6C757D] uppercase tracking-wider mb-1">Output</div>
          Payment Execution
        </div>
      </div>
    </div>
  );
}
