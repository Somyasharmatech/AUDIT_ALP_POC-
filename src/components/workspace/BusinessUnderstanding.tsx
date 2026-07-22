import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export function BusinessUnderstanding() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#212529] border-b border-[#DEE2E6] pb-3">Business Understanding</h2>
      
      <Card className="shadow-sm border-[#DEE2E6]">
        <CardContent className="p-6 space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-[#212529] mb-2 uppercase tracking-wider">Business Objective</h3>
            <p className="text-sm text-[#495057] leading-relaxed">
              Ensure efficient, cost-effective, and compliant procurement of goods and services necessary to support organizational operations, while mitigating third-party risks and optimizing working capital.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-[#212529] mb-2 uppercase tracking-wider">Business Process Summary</h3>
            <p className="text-sm text-[#495057] leading-relaxed">
              The Procure to Pay (P2P) process encompasses all activities from the initial identification of a requirement for goods or services to the final payment to the vendor. It includes vendor selection, purchase requisition, purchase order creation, goods receipt, invoice processing, and payment execution.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wider">Key Stakeholders</h3>
              <ul className="list-disc pl-5 text-sm text-[#495057] space-y-1.5">
                <li>Chief Procurement Officer (CPO)</li>
                <li>Accounts Payable Manager</li>
                <li>Head of Vendor Management</li>
                <li>Treasury Director</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wider">Control Owners</h3>
              <ul className="list-disc pl-5 text-sm text-[#495057] space-y-1.5">
                <li>Purchasing Manager (PO Creation)</li>
                <li>Warehouse Supervisor (Goods Receipt)</li>
                <li>Finance Manager (Invoice Approval)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wider">Critical Applications</h3>
              <ul className="list-disc pl-5 text-sm text-[#495057] space-y-1.5">
                <li>SAP S/4HANA (Core ERP)</li>
                <li>Ariba (Vendor Portal)</li>
                <li>Citibank Direct (Payment Gateway)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wider">Key Dependencies</h3>
              <ul className="list-disc pl-5 text-sm text-[#495057] space-y-1.5">
                <li>Automated 3-Way Match System Uptime</li>
                <li>Vendor Master Data Integrity</li>
                <li>Active Directory Integration for Approvals</li>
              </ul>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wider">Business Risks</h3>
             <ul className="list-disc pl-5 text-sm text-[#495057] space-y-1.5">
                <li>Payments made for fictitious or unreceived goods.</li>
                <li>Unauthorized vendors receiving competitive bid information.</li>
                <li>Duplicate invoice processing resulting in financial loss.</li>
                <li>Failure to claim available early payment discounts.</li>
             </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
