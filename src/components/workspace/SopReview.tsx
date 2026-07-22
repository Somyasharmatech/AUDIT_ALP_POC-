import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Edit2, CheckCircle2, Save } from 'lucide-react';
import { toast } from 'sonner';

export function SopReview() {
  const [isEditing, setIsEditing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [content, setContent] = useState(`STANDARD OPERATING PROCEDURE: PROCURE TO PAY (AI EXTRACTED)

1. PURPOSE
The purpose of this procedure is to outline the steps required for the procurement of goods and services, ensuring compliance with organizational policies, budgetary controls, and segregation of duties.

2. SCOPE
This procedure applies to all employees involved in the requisition, purchasing, receiving, and payment processes across all departments.

3. PROCEDURE
3.1. Purchase Requisition (PR)
- Department heads must initiate a PR in the ERP system.
- PRs exceeding $5,000 require secondary approval from the Finance Controller.

3.2. Vendor Selection & Purchase Order (PO)
- Procurement selects vendors from the Approved Vendor List (AVL).
- For purchases >$20,000, three competitive quotes must be attached to the PO.
- System automatically generates a PO upon final approval.

3.3. Goods Receipt (GRN)
- Warehouse receives goods and verifies against the PO.
- A Goods Receipt Note (GRN) is entered into the system within 24 hours of receipt.

3.4. Invoice Processing & Payment
- Accounts Payable receives the vendor invoice.
- System performs an automated 3-way match (PO, GRN, Invoice).
- Variances >2% require manual intervention and approval from the Purchasing Manager.
- Approved invoices are scheduled for payment based on vendor terms (e.g., Net 30).`);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("SOP updated successfully");
  };

  const handleApprove = () => {
    setIsApproved(true);
    toast.success("SOP Approved for Audit Baseline");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-3">
        <h2 className="text-2xl font-bold text-[#212529]">SOP Review & Approval</h2>
        <div className="flex items-center gap-3">
          {isApproved ? (
            <Badge className="bg-[#198754] px-3 py-1 gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Approved Baseline</Badge>
          ) : (
            <>
              {isEditing ? (
                <Button onClick={handleSave} className="bg-[#005A9E] hover:bg-[#004578] h-8 text-xs">
                  <Save className="h-3.5 w-3.5 mr-2" /> Save Changes
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="h-8 text-xs">
                  <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit AI Draft
                </Button>
              )}
              <Button onClick={handleApprove} className="bg-[#198754] hover:bg-[#146c43] h-8 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Approve SOP
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Card className="shadow-sm border-[#DEE2E6]">
        <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">AI Extracted Standard Operating Procedure</CardTitle>
          <Badge variant="outline" className="border-[#005A9E] text-[#005A9E] bg-[#E5F0FA]">AI Generated from Uploaded Documents</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {isEditing ? (
            <textarea
              className="w-full h-[500px] p-6 text-sm text-[#495057] font-mono focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#005A9E] border-none resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div className="w-full h-[500px] p-6 overflow-y-auto bg-white text-sm text-[#495057] whitespace-pre-wrap font-mono">
              {content}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
