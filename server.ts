import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock Database for PoC
  const db = {
    audits: [] as any[],
  };

  app.post("/api/audits", (req, res) => {
    const newAudit = {
      id: Math.random().toString(36).substring(7),
      name: req.body.name,
      department: req.body.department,
      status: "running",
      createdAt: new Date().toISOString(),
      findings: [],
      analytics: null,
      progress: 0,
      currentStep: "Audit Orchestrator",
      logs: []
    };
    db.audits.push(newAudit);
    res.json(newAudit);
  });

  app.get("/api/audits", (req, res) => {
    res.json(db.audits);
  });

  app.get("/api/audits/:id", (req, res) => {
    const audit = db.audits.find(a => a.id === req.params.id);
    if (!audit) return res.status(404).json({ error: "Not found" });
    res.json(audit);
  });

  // Start workflow for a specific audit
  app.post("/api/audits/:id/start", (req, res) => {
    const audit = db.audits.find(a => a.id === req.params.id);
    if (!audit) return res.status(404).json({ error: "Not found" });
    
    // Asynchronous processing (simulating the AI departments)
    processAuditWorkflow(audit);
    
    res.json({ message: "Started" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Background worker simulation
async function processAuditWorkflow(audit: any) {
  const steps = [
    { name: "Document Intelligence", duration: 4000, log: "Extracting transactions and metadata from Treasury Report..." },
    { name: "Business Understanding", duration: 3500, log: "Identifying Treasury processes and applicable controls..." },
    { name: "Audit Planning", duration: 3000, log: "Defining audit scope and required evidence..." },
    { name: "Business Intelligence", duration: 4500, log: "Generating KPIs, variance analysis, and risk heatmaps..." },
    { name: "Risk & Controls", duration: 4000, log: "Comparing evidence against RCM to detect failures..." },
    { name: "Compliance", duration: 3500, log: "Validating against Company SOPs and Regulations..." },
    { name: "Exception & Insight Engine", duration: 5000, log: "Detecting missing approvals, budget overruns, and deviations..." },
    { name: "Executive Reporting", duration: 4000, log: "Preparing executive summary and management actions..." },
  ];

  audit.logs.push({ timestamp: new Date().toISOString(), message: "Audit session created. Documents classified." });

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    audit.currentStep = step.name;
    audit.logs.push({ timestamp: new Date().toISOString(), message: step.log });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, step.duration));
    
    audit.progress = Math.round(((i + 1) / steps.length) * 100);
  }

  // Populate representative data
  audit.status = "completed";
  audit.currentStep = "Completed";
  audit.logs.push({ timestamp: new Date().toISOString(), message: "Ready for Human Review." });
  
  audit.analytics = {
    healthScore: 78,
    aiConfidence: "94%",
    timeSaved: "14 Days",
    controlsTested: 42,
    exceptionsFound: 14,
    kpis: [
      { label: "Total Transactions", value: "$4.2M", trend: "+12%", explanation: "Transaction volume increased compared to last quarter." },
      { label: "Exceptions Found", value: "14", trend: "-2%", explanation: "Slight decrease in exceptions, but high severity." },
      { label: "Control Effectiveness", value: "82%", trend: "+5%", explanation: "Improved compliance in expense approvals." },
      { label: "Budget Variance", value: "$120K", trend: "over", explanation: "IT software expenditure exceeded projections." }
    ],
    monthlyTrend: [
      { name: 'Jan', exceptions: 4, amount: 12000 },
      { name: 'Feb', exceptions: 3, amount: 9000 },
      { name: 'Mar', exceptions: 6, amount: 18000 },
      { name: 'Apr', exceptions: 8, amount: 24000 },
      { name: 'May', exceptions: 2, amount: 5000 },
      { name: 'Jun', exceptions: 14, amount: 45000 },
    ],
    vendorDistribution: [
      { name: 'TechCorp', value: 45 },
      { name: 'OfficeSup', value: 20 },
      { name: 'ConsultInc', value: 15 },
      { name: 'Others', value: 20 },
    ],
    budgetVsActual: [
      { category: 'Software', budget: 100, actual: 140 },
      { category: 'Hardware', budget: 50, actual: 45 },
      { category: 'Consulting', budget: 80, actual: 80 },
      { category: 'Travel', budget: 20, actual: 35 },
    ],
    riskHeatmap: [
      { category: "Vendor Payouts", risk: "High", score: 85 },
      { category: "Payroll", risk: "Low", score: 20 },
      { category: "Treasury Limits", risk: "Medium", score: 60 },
      { category: "Expense Approvals", risk: "High", score: 90 },
    ]
  };

  audit.findings = [
    {
      id: "f1",
      title: "Duplicate Vendor Identified",
      priority: "High",
      confidence: "96%",
      evidence: "GST Number, PAN Number, and Bank Account (ending 4432) match for vendors 'AlphaTech' and 'Alpha Technology'.",
      reasoning: "Three vendors share identical banking information and tax identifiers, indicating duplicate records or potential fraud.",
      impact: "High risk of duplicate payments and reporting inaccuracies.",
      recommendation: "Merge duplicate vendor records and institute automated master data validation.",
      status: "pending"
    },
    {
      id: "f2",
      title: "Weak Approval Control in Treasury Transfers",
      priority: "High",
      confidence: "94%",
      evidence: "Transfer TR-9021 for $250,000 bypassed secondary authorization.",
      reasoning: "The RCM requires dual approval for transactions > $100K. The provided general ledger shows single approval timestamp.",
      impact: "High risk of unauthorized capital outflow and financial loss.",
      recommendation: "Implement hard stop in ERP for single-approval transfers above threshold.",
      status: "pending"
    },
    {
      id: "f3",
      title: "Vendor Concentration Risk",
      priority: "Medium",
      confidence: "88%",
      evidence: "Vendor 'TechCorp Solutions' accounts for 45% of Q3 IT expenditure.",
      reasoning: "Dependency analysis indicates high concentration. Policy threshold is 30% per vendor.",
      impact: "Supply chain vulnerability if vendor operations cease.",
      recommendation: "Diversify IT procurement. Initiate RFP for secondary suppliers.",
      status: "pending"
    }
  ];
}

startServer();
