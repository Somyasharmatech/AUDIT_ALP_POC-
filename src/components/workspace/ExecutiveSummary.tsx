import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { 
  AlertCircle, ShieldAlert, Target, Info, CheckCircle2, AlertTriangle, 
  ChevronDown, ChevronUp, FileText, Calendar, Building2, Layers, BrainCircuit,
  TrendingUp, History, DollarSign, ListChecks, ArrowRight, Clock
} from 'lucide-react';

const CircularGauge = ({ value, label, color }: { value: number, label: string, color: string }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} stroke="#E9ECEF" strokeWidth="8" fill="transparent" />
          <circle 
            cx="50" cy="50" r={radius} 
            stroke={color} strokeWidth="8" fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-[#212529]">{value}%</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-[#6C757D] uppercase tracking-wider mt-2">{label}</span>
    </div>
  );
};

export function ExecutiveSummary() {
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-[#DEE2E6] pb-3">
        <h2 className="text-2xl font-bold text-[#212529]">Board-Level Executive Summary</h2>
        <Badge variant="outline" className="border-[#005A9E] text-[#005A9E] bg-[#E5F0FA]">AI Generated Briefing</Badge>
      </div>

      {/* 1. Engagement Overview */}
      <Card className="shadow-sm border-[#DEE2E6]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-2xl font-bold text-[#005A9E]">Procure to Pay Automation Audit</h3>
                <p className="text-sm text-[#6C757D]">Auto-Extracted from Previous Audit Report (FY 2024-25)</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-[#6C757D]"/> <strong className="text-[#212529]">Department:</strong> <span className="text-[#495057]">Finance & Treasury</span></div>
                <div className="flex items-center gap-2"><Layers className="h-4 w-4 text-[#6C757D]"/> <strong className="text-[#212529]">Audit Type:</strong> <span className="text-[#495057]">Operational Audit</span></div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#6C757D]"/> <strong className="text-[#212529]">Financial Year:</strong> <span className="text-[#495057]">2025-26</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#6C757D]"/> <strong className="text-[#212529]">Generated:</strong> <span className="text-[#495057]">{new Date().toLocaleDateString()}</span></div>
              </div>
            </div>
            <div className="flex gap-8 px-8 border-l border-[#DEE2E6]">
               <CircularGauge value={94} label="AI Confidence" color="#198754" />
               <CircularGauge value={92} label="Readiness" color="#005A9E" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. AI Executive Overview */}
      <Card className="shadow-sm border-[#DEE2E6] bg-gradient-to-br from-[#F8F9FA] to-white">
        <CardHeader className="p-4 border-b border-[#DEE2E6]">
           <CardTitle className="text-[14px] font-bold text-[#212529] uppercase tracking-wider flex items-center gap-2">
             <BrainCircuit className="h-5 w-5 text-[#005A9E]" /> AI Executive Overview
           </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-2 gap-x-8 gap-y-6 text-sm text-[#495057]">
          <div>
            <h4 className="font-bold text-[#212529] mb-1">Business Context</h4>
            <p>The P2P cycle processes $120M annually. Recent ERP upgrades aimed to automate 3-way matching and vendor onboarding, altering the control environment significantly.</p>
          </div>
          <div>
            <h4 className="font-bold text-[#212529] mb-1">Overall Assessment</h4>
            <p>While automation has improved processing speed, manual overrides in Vendor Master creation pose a severe segregation of duties conflict.</p>
          </div>
          <div>
            <h4 className="font-bold text-[#A80000] mb-1">Key Concerns</h4>
            <p>A 15% override rate of automated KYC checks during vendor onboarding. Potential duplicate payments escaping the ERP duplicate-check logic.</p>
          </div>
          <div>
            <h4 className="font-bold text-[#212529] mb-1">Business Impact</h4>
            <p>High exposure to fictitious vendor fraud and delayed regulatory filings (already resulted in a Tax Authority Notice on May 15).</p>
          </div>
          <div className="col-span-2 bg-[#E5F0FA] p-4 rounded-sm border border-[#005A9E]/20">
             <h4 className="font-bold text-[#005A9E] mb-1">Planning Recommendation & Next Action</h4>
             <p>Proceed with fieldwork immediately. Focus 80% of substantive testing on Vendor Master Data changes and Q1/Q2 tax filings. Scoping document and Audit Program have been generated to target these specific vulnerabilities.</p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Why This Audit Was Selected */}
      <Card className="shadow-sm border-[#DEE2E6]">
        <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
           <CardTitle className="text-sm font-semibold">Why AI Selected This Audit</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
             <thead className="bg-[#F8F9FA] text-[#6C757D] text-[11px] uppercase tracking-wider border-b border-[#DEE2E6]">
               <tr>
                 <th className="px-4 py-3 font-semibold">Reason</th>
                 <th className="px-4 py-3 font-semibold">Supporting Evidence</th>
                 <th className="px-4 py-3 font-semibold">Business Impact</th>
                 <th className="px-4 py-3 font-semibold">Confidence</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-[#DEE2E6]">
               <tr className="hover:bg-[#F8F9FA]">
                 <td className="px-4 py-4 font-medium text-[#212529]">Increase in treasury transactions</td>
                 <td className="px-4 py-4"><Badge variant="outline" className="border-[#005A9E] text-[#005A9E] bg-white">Trial Balance Variance (+12.4%)</Badge></td>
                 <td className="px-4 py-4 text-[#495057]">Higher cash outflow exposure</td>
                 <td className="px-4 py-4 text-[#198754] font-bold">98%</td>
               </tr>
               <tr className="hover:bg-[#F8F9FA]">
                 <td className="px-4 py-4 font-medium text-[#212529]">Previous repeat findings</td>
                 <td className="px-4 py-4"><Badge variant="outline" className="border-[#005A9E] text-[#005A9E] bg-white">Previous Audit Report (Obs #4)</Badge></td>
                 <td className="px-4 py-4 text-[#495057]">Unmitigated control failures</td>
                 <td className="px-4 py-4 text-[#198754] font-bold">95%</td>
               </tr>
               <tr className="hover:bg-[#F8F9FA]">
                 <td className="px-4 py-4 font-medium text-[#212529]">Recent regulatory updates</td>
                 <td className="px-4 py-4"><Badge variant="outline" className="border-[#005A9E] text-[#005A9E] bg-white">Govt Notifications (Section 44AB)</Badge></td>
                 <td className="px-4 py-4 text-[#495057]">Compliance penalties</td>
                 <td className="px-4 py-4 text-[#198754] font-bold">92%</td>
               </tr>
             </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 4. AI Decision Panel (The Three Questions) */}
      <div className="space-y-4">
         <h3 className="text-lg font-bold text-[#212529] border-b border-[#DEE2E6] pb-2">AI Decision Panel</h3>
         <div className="grid grid-cols-3 gap-6">
            <Card className="shadow-sm border-[#A80000] border-t-4">
              <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#A80000]">
                  <AlertCircle className="h-4 w-4" /> Penalties / Regulatory Fines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Badge className="bg-[#A80000] hover:bg-[#A80000]">YES DETECTED</Badge>
                  <span className="text-xs font-bold text-[#198754]">94% Confidence</span>
                </div>
                <div className="text-sm text-[#495057] space-y-2">
                  <p><strong className="text-[#212529]">Reason:</strong> Delayed filing of statutory returns under Section 44AB.</p>
                  <p><strong className="text-[#212529]">Evidence:</strong> Notice dated 15-May from Tax Authority.</p>
                  <p><strong className="text-[#212529]">Impact:</strong> Financial liability of $45,000.</p>
                  <div className="pt-2 border-t border-[#DEE2E6]">
                    <span className="text-[10px] font-bold text-[#6C757D] uppercase">Ref: Govt Notifications, pg 4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-[#198754] border-t-4">
              <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#198754]">
                  <ShieldAlert className="h-4 w-4" /> Fraud Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Badge className="bg-[#198754] hover:bg-[#198754]">NO DETECTED</Badge>
                  <span className="text-xs font-bold text-[#198754]">98% Confidence</span>
                </div>
                <div className="text-sm text-[#495057] space-y-2">
                  <p><strong className="text-[#212529]">Reason:</strong> No whistleblower reports or discrepancies identified.</p>
                  <p><strong className="text-[#212529]">Evidence:</strong> Clean Fraud Register and matched TB.</p>
                  <p><strong className="text-[#212529]">Impact:</strong> Safe operational environment.</p>
                  <div className="pt-2 border-t border-[#DEE2E6]">
                    <span className="text-[10px] font-bold text-[#6C757D] uppercase">Ref: Fraud Register, Trial Balance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-[#A80000] border-t-4">
              <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#A80000]">
                  <Target className="h-4 w-4" /> High Risk Observations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Badge className="bg-[#A80000] hover:bg-[#A80000]">YES DETECTED</Badge>
                  <span className="text-xs font-bold text-[#198754]">89% Confidence</span>
                </div>
                <div className="text-sm text-[#495057] space-y-2">
                  <p><strong className="text-[#212529]">Reason:</strong> Lack of segregation of duties in Vendor Master.</p>
                  <p><strong className="text-[#212529]">Evidence:</strong> Previous Audit Report repeat finding.</p>
                  <p><strong className="text-[#212529]">Impact:</strong> Unauthorized vendor payments.</p>
                  <div className="pt-2 border-t border-[#DEE2E6]">
                    <span className="text-[10px] font-bold text-[#6C757D] uppercase">Ref: Previous Audit Report, Obs #4</span>
                  </div>
                </div>
              </CardContent>
            </Card>
         </div>
      </div>

      {/* 5. Key Business Risks */}
      <Card className="shadow-sm border-[#DEE2E6]">
        <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
           <CardTitle className="text-sm font-semibold">Key Business Risks Extracted</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
             <thead className="bg-[#F8F9FA] text-[#6C757D] text-[11px] uppercase tracking-wider border-b border-[#DEE2E6]">
               <tr>
                 <th className="px-4 py-3 font-semibold">Risk & Category</th>
                 <th className="px-4 py-3 font-semibold">Reason & Impact</th>
                 <th className="px-4 py-3 font-semibold">Likelihood</th>
                 <th className="px-4 py-3 font-semibold">Recommendation</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-[#DEE2E6]">
               <tr className="bg-[#FDF2F2]">
                 <td className="px-4 py-4">
                   <div className="font-bold text-[#A80000]">Fictitious Vendor Creation</div>
                   <Badge variant="outline" className="mt-1 border-[#A80000] text-[#A80000] text-[10px] bg-white">Operational / Fraud</Badge>
                 </td>
                 <td className="px-4 py-4 text-[#495057]">
                   <p>Manual overrides in KYC checks.</p>
                   <p className="text-xs mt-1"><strong className="text-[#212529]">Impact:</strong> Financial Loss</p>
                 </td>
                 <td className="px-4 py-4"><Badge className="bg-[#A80000]">High</Badge></td>
                 <td className="px-4 py-4 text-[#495057] text-xs">Verify segregation of duties and review audit logs for vendor creation.</td>
               </tr>
               <tr className="hover:bg-[#F8F9FA]">
                 <td className="px-4 py-4">
                   <div className="font-bold text-[#212529]">Duplicate Invoice Processing</div>
                   <Badge variant="outline" className="mt-1 border-[#FFC107] text-[#856404] text-[10px] bg-white">Financial</Badge>
                 </td>
                 <td className="px-4 py-4 text-[#495057]">
                   <p>System mismatch during 3-way match.</p>
                   <p className="text-xs mt-1"><strong className="text-[#212529]">Impact:</strong> Overpayment</p>
                 </td>
                 <td className="px-4 py-4"><Badge className="bg-[#FFC107] text-[#856404]">Medium</Badge></td>
                 <td className="px-4 py-4 text-[#495057] text-xs">Test ERP built-in duplicate check feature parameters.</td>
               </tr>
             </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 6 & 7. Historical and Financial Summary */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
             <CardTitle className="text-sm font-semibold flex items-center gap-2"><History className="h-4 w-4 text-[#005A9E]"/> Historical Summary (5 Years)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-sm text-[#495057]">
            <div className="flex justify-between items-center border-b border-[#DEE2E6] pb-3">
              <span className="font-semibold text-[#212529]">Average Audit Rating</span>
              <Badge className="bg-[#FFC107] text-[#856404] hover:bg-[#FFC107]">Needs Improvement</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center border-b border-[#DEE2E6] pb-3">
              <div><div className="text-xl font-bold text-[#A80000]">3</div><div className="text-[10px] uppercase font-bold text-[#6C757D] tracking-wider mt-1">Repeat</div></div>
              <div><div className="text-xl font-bold text-[#FFC107]">8</div><div className="text-[10px] uppercase font-bold text-[#6C757D] tracking-wider mt-1">Open</div></div>
              <div><div className="text-xl font-bold text-[#198754]">42</div><div className="text-[10px] uppercase font-bold text-[#6C757D] tracking-wider mt-1">Closed</div></div>
            </div>
            <div>
              <p><strong className="text-[#212529]">Trend:</strong> Finding volume increased in 2025 due to ERP migration.</p>
              <p className="mt-2"><strong className="text-[#212529]">AI Commentary:</strong> Management responsiveness is adequate (78% action rate), but systemic IT limitations prevent closure of repeat findings.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
             <CardTitle className="text-sm font-semibold flex items-center gap-2"><DollarSign className="h-4 w-4 text-[#005A9E]"/> Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-sm text-[#495057]">
            <div className="flex justify-between items-center border-b border-[#DEE2E6] pb-3">
              <span className="font-semibold text-[#212529]">Financial Risk Score</span>
              <Badge className="bg-[#A80000]">HIGH (8.5/10)</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-[#DEE2E6] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6C757D] font-bold">Planning Materiality</span>
                <div className="text-lg font-bold text-[#212529]">$1,500,000</div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6C757D] font-bold">Performance Materiality</span>
                <div className="text-lg font-bold text-[#212529]">$1,125,000</div>
              </div>
            </div>
            <div>
              <p><strong className="text-[#212529]">Abnormal Variance:</strong> IT Software Expenses up 45.2% YoY.</p>
              <p className="mt-2"><strong className="text-[#212529]">Top Material Accounts:</strong> Accounts Payable ($18.4M), COGS ($45.2M).</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 8. Missing Documents & 9. Management Attention */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
             <CardTitle className="text-sm font-semibold flex items-center gap-2">Missing Documents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <table className="w-full text-sm text-left">
                <thead className="bg-[#F8F9FA] text-[#6C757D] text-[11px] uppercase tracking-wider border-b border-[#DEE2E6]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Document</th>
                    <th className="px-4 py-3 font-semibold">Impact</th>
                    <th className="px-4 py-3 font-semibold">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEE2E6]">
                  <tr className="hover:bg-[#F8F9FA]">
                    <td className="px-4 py-4 font-medium text-[#212529]">IT General Controls Report</td>
                    <td className="px-4 py-4 text-[#495057] text-xs">Cannot verify automated 3-way match controls.</td>
                    <td className="px-4 py-4"><Badge className="bg-[#A80000]">High</Badge></td>
                  </tr>
                </tbody>
             </table>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#DEE2E6]">
          <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
             <CardTitle className="text-sm font-semibold flex items-center gap-2">Management Attention Required</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <ul className="divide-y divide-[#DEE2E6] text-sm text-[#495057]">
               <li className="p-4 flex items-start gap-3 hover:bg-[#F8F9FA] transition-colors">
                 <AlertTriangle className="h-4 w-4 text-[#A80000] shrink-0 mt-0.5" />
                 <div><strong className="text-[#212529]">Critical:</strong> Vendor KYC automated checks bypassed 15% of the time.</div>
               </li>
               <li className="p-4 flex items-start gap-3 hover:bg-[#F8F9FA] transition-colors">
                 <AlertTriangle className="h-4 w-4 text-[#FFC107] shrink-0 mt-0.5" />
                 <div><strong className="text-[#212529]">Medium:</strong> Tax notice received for delayed Section 44AB filing.</div>
               </li>
               <li className="p-4 flex items-start gap-3 hover:bg-[#F8F9FA] transition-colors">
                 <Info className="h-4 w-4 text-[#005A9E] shrink-0 mt-0.5" />
                 <div><strong className="text-[#212529]">Low:</strong> SOP document has not been updated since ERP migration.</div>
               </li>
             </ul>
          </CardContent>
        </Card>
      </div>

      {/* 10. AI Recommendations */}
      <Card className="shadow-sm border-[#DEE2E6]">
        <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
           <CardTitle className="text-sm font-semibold">AI Audit Strategy Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
             <thead className="bg-[#F8F9FA] text-[#6C757D] text-[11px] uppercase tracking-wider border-b border-[#DEE2E6]">
               <tr>
                 <th className="px-4 py-3 font-semibold w-1/3">Recommendation</th>
                 <th className="px-4 py-3 font-semibold">Reason & Evidence</th>
                 <th className="px-4 py-3 font-semibold">Expected Benefit</th>
                 <th className="px-4 py-3 font-semibold">Confidence</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-[#DEE2E6]">
               <tr className="hover:bg-[#F8F9FA]">
                 <td className="px-4 py-4 font-medium text-[#212529]">Expand sample size for Vendor Master changes.</td>
                 <td className="px-4 py-4 text-[#495057] text-xs">
                   <p className="mb-1"><strong>Reason:</strong> High override rate of KYC checks.</p>
                   <p><strong>Evidence:</strong> Operations Manual logic gaps.</p>
                 </td>
                 <td className="px-4 py-4 text-[#495057] text-xs">Identify potential fictitious vendors.</td>
                 <td className="px-4 py-4 text-[#198754] font-bold">96%</td>
               </tr>
               <tr className="hover:bg-[#F8F9FA]">
                 <td className="px-4 py-4 font-medium text-[#212529]">Perform substantive analytical procedures on IT Expenses.</td>
                 <td className="px-4 py-4 text-[#495057] text-xs">
                   <p className="mb-1"><strong>Reason:</strong> +45.2% YoY variance.</p>
                   <p><strong>Evidence:</strong> Trial Balance mapping.</p>
                 </td>
                 <td className="px-4 py-4 text-[#495057] text-xs">Detect uncapitalized software assets.</td>
                 <td className="px-4 py-4 text-[#198754] font-bold">92%</td>
               </tr>
             </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 11. Next Steps */}
      <Card className="shadow-sm border-[#DEE2E6]">
        <CardHeader className="p-4 border-b border-[#DEE2E6] bg-[#F8F9FA]/50">
           <CardTitle className="text-sm font-semibold">Suggested Workflow Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
           <div className="flex items-center justify-between text-[11px] font-semibold text-[#6C757D] uppercase tracking-wider">
              <div className="flex flex-col items-center gap-2 text-[#005A9E]"><CheckCircle2 className="h-6 w-6"/> Business Understanding</div>
              <div className="h-px bg-[#DEE2E6] flex-1 mx-4"></div>
              <div className="flex flex-col items-center gap-2"><FileText className="h-6 w-6"/> SOP Review</div>
              <div className="h-px bg-[#DEE2E6] flex-1 mx-4"></div>
              <div className="flex flex-col items-center gap-2"><ArrowRight className="h-6 w-6"/> Process Flow</div>
              <div className="h-px bg-[#DEE2E6] flex-1 mx-4"></div>
              <div className="flex flex-col items-center gap-2"><ShieldAlert className="h-6 w-6"/> Risk Assessment</div>
              <div className="h-px bg-[#DEE2E6] flex-1 mx-4"></div>
              <div className="flex flex-col items-center gap-2"><ListChecks className="h-6 w-6"/> Audit Program</div>
           </div>
        </CardContent>
      </Card>

      {/* 12. AI Evidence Panel */}
      <Card className="shadow-sm border-[#DEE2E6] bg-[#F8F9FA]">
        <CardHeader 
          className="p-4 border-b border-[#DEE2E6] cursor-pointer hover:bg-[#E9ECEF] transition-colors flex flex-row items-center justify-between"
          onClick={() => setEvidenceOpen(!evidenceOpen)}
        >
           <CardTitle className="text-sm font-semibold flex items-center gap-2">
             <FileText className="h-4 w-4 text-[#6C757D]"/> AI Document Evidence Panel
           </CardTitle>
           {evidenceOpen ? <ChevronUp className="h-5 w-5 text-[#6C757D]"/> : <ChevronDown className="h-5 w-5 text-[#6C757D]"/>}
        </CardHeader>
        {evidenceOpen && (
          <CardContent className="p-0 bg-white">
            <table className="w-full text-sm text-left">
               <thead className="bg-[#F8F9FA] text-[#6C757D] text-[11px] uppercase tracking-wider border-b border-[#DEE2E6]">
                 <tr>
                   <th className="px-4 py-3 font-semibold">Document Name</th>
                   <th className="px-4 py-3 font-semibold">Version</th>
                   <th className="px-4 py-3 font-semibold">Pages Referenced</th>
                   <th className="px-4 py-3 font-semibold">Extraction Confidence</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#DEE2E6] text-[#495057]">
                 <tr className="hover:bg-[#F8F9FA]">
                   <td className="px-4 py-3 font-medium text-[#212529]">Previous Audit Report</td>
                   <td className="px-4 py-3">v1.0</td>
                   <td className="px-4 py-3 font-mono text-xs">Pg 4, 12, 15</td>
                   <td className="px-4 py-3 text-[#198754] font-bold">99%</td>
                 </tr>
                 <tr className="hover:bg-[#F8F9FA]">
                   <td className="px-4 py-3 font-medium text-[#212529]">Trial Balance</td>
                   <td className="px-4 py-3">v1.0 (Excel)</td>
                   <td className="px-4 py-3 font-mono text-xs">Sheet 1</td>
                   <td className="px-4 py-3 text-[#198754] font-bold">100%</td>
                 </tr>
                 <tr className="hover:bg-[#F8F9FA]">
                   <td className="px-4 py-3 font-medium text-[#212529]">Govt Notifications</td>
                   <td className="px-4 py-3">v1.0</td>
                   <td className="px-4 py-3 font-mono text-xs">Pg 4</td>
                   <td className="px-4 py-3 text-[#198754] font-bold">96%</td>
                 </tr>
                 <tr className="hover:bg-[#F8F9FA]">
                   <td className="px-4 py-3 font-medium text-[#212529]">Fraud Register</td>
                   <td className="px-4 py-3">v1.0 (Excel)</td>
                   <td className="px-4 py-3 font-mono text-xs">All</td>
                   <td className="px-4 py-3 text-[#198754] font-bold">100%</td>
                 </tr>
                 <tr className="hover:bg-[#F8F9FA]">
                   <td className="px-4 py-3 font-medium text-[#212529]">Operations Manual</td>
                   <td className="px-4 py-3">v2.4</td>
                   <td className="px-4 py-3 font-mono text-xs">Pg 45-48</td>
                   <td className="px-4 py-3 text-[#198754] font-bold">89%</td>
                 </tr>
               </tbody>
            </table>
          </CardContent>
        )}
      </Card>
      
    </div>
  );
}
