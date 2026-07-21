# AUDIT ALP - V2 Business Workflow Architecture
**AI-Powered Enterprise Audit Planning & Scoping Platform**
*Designed according to Big Four (Deloitte, EY, PwC, KPMG) Internal Audit Methodologies*

---

## 1. Executive Context & Methodology
This platform operationalizes the **Risk-Based Internal Auditing (RBIA)** framework. It focuses strictly on Phase 1 (Annual Planning) and Phase 2 (Engagement Planning & Scoping) of the audit lifecycle, occurring *before* any fieldwork begins. 

The primary objective is to automate the digestion of historical context, regulatory frameworks, and standard operating procedures (SOPs) to rapidly generate robust, defendable Planning and Scoping deliverables.

---

## 2. Global Executive Dashboard
The entry point for the Head of Internal Audit and Audit Directors. It provides a macro-level view of the annual audit plan and systemic organizational risks.

**Visual Theme:** Pure White Enterprise Theme. Minimalist, high-contrast, data-dense.

**Executive Widgets:**
*   **Total Planned Audits:** Count of engagements in the current Annual Audit Plan.
*   **Planning Status:** Breakdown (Completed Planning vs. Pending Planning).
*   **Risk Profile:** Count of High, Medium, and Low Risk Audits currently scheduled.
*   **Systemic Issues:** Aggregate Open Observations and Repeat Findings across the enterprise.

**Analytical Charts:**
*   **Risk Distribution (Pie/Donut):** High/Medium/Low spread across the audit universe.
*   **Departmental Risk Heatmap (Grid/Matrix):** Departments plotted against Risk Likelihood/Impact.
*   **Audit Calendar (Gantt):** Timeline of planned engagements.
*   **Penalty & Fraud Trends (Line/Bar):** Historical tracking of financial impacts and regulatory breaches over the last 5 years.
*   **Historical Findings Trend (Bar):** Volume of findings year-over-year categorized by severity.

**Call to Action:** Prominent ability to `Initiate New Audit Planning Engagement`.

---

## 3. Audit Initiation & The Audit Universe
When an Audit Manager clicks "Initiate New Audit Planning Engagement", they define the foundational parameters of the audit.

**Engagement Metadata Fields:**
*   **Audit Name:** (e.g., "Q3 Treasury Cash Management Audit")
*   **Department:** Selected from the predefined Audit Universe (see below).
*   **Business Unit / Geography:** (e.g., "North America", "APAC")
*   **Financial Year:** Dropdown restricting selection to (2027-28, 2026-27, 2025-26, 2024-25, 2023-24, 2022-23, 2021-22, 2020-21, 2019-20, 2018-19).
*   **Audit Type:** (Operational, Financial, Compliance, IT, Strategic, Fraud Investigation).
*   **Audit Owner / Lead:** User assignment.
*   **Planning Start Date:** Date picker.
*   **Planning Status:** (Not Started, In Progress, Awaiting Review, Approved).

**The Audit Universe (Departments):**
The core auditable entities of the organization:
*   Treasury
*   Operations
*   Payroll
*   Human Resources (HR)
*   Credit
*   Customer Relationship Management (CRM)
*   Administration
*   Risk Management
*   Finance
*   Compliance
*   Information Technology (IT)
*   Procurement
*   Legal
*   Branches / Retail Network
*   Asset Management

---

## 4. Document Ingestion (The AI Knowledge Base)
Audit planning relies heavily on documentation. Instead of a generic upload bucket, the system uses a highly structured ingestion matrix.

**Document Categories (Multiple specialized upload zones):**
1.  Previous Audit Reports
2.  Current Year Audit Report
3.  Balance Sheet
4.  Profit & Loss Statement
5.  General Ledger Extracts
6.  Vendor Master Data
7.  Risk & Control Matrices (RCM)
8.  Corporate Policies
9.  Standard Operating Procedures (SOP)
10. Risk Register
11. Fraud Register
12. Regulatory Review / Inspection Reports
13. Compliance Reports
14. Management Responses / Action Plans
15. Previous Planning Document
16. Previous Scoping Document

**Document Tracking Metadata (Per file):**
*   **Upload Status:** (Pending, Completed, Failed).
*   **Processing Status:** (Queued for Parsing, OCR in Progress, Chunking).
*   **AI Status:** (Vectorized & Ready, Analysis Failed).
*   **Version:** Version control for iterative uploads.
*   **Document Type:** Auto-classified or manually tagged.

---

## 5. Previous Audit History (Contextual Intelligence)
Once the Department and Financial Year are selected, the platform automatically retrieves and synthesizes the previous 5 years of audit history for that specific department/unit.

**Historical View (Example: 2025-26 down to 2021-22):**
For each historical year, the dashboard displays:
*   **Risk Rating:** What was the overall rating? (e.g., Needs Improvement, Satisfactory).
*   **Audit Status:** (Closed, Follow-up Pending).
*   **Major Findings:** Bulleted summary of high-risk observations.
*   **Management Response:** Summary of management's tone and corrective action plans.
*   **Open Observations:** Count of issues still not remediated.
*   **Closed Observations:** Count of successfully closed issues.
*   **Repeat Findings:** Count of identical issues recurring year-over-year.
*   **Regulatory Issues:** Any breaches of law or regulation.
*   **Penalties:** Financial fines incurred.
*   **Frauds:** Detected internal/external fraud events.

**AI Output:** The AI automatically generates a "Historical Trend Summary" highlighting deteriorating control environments, chronic unaddressed issues, or improving operational maturity.

---

## 6. Planning Questionnaire (Risk Triage)
Before the AI proposes the scope, the Audit Manager must complete a dynamic, AI-guided questionnaire to capture "soft" intelligence and recent business changes.

**Key Assessment Questions:**
*   Were there regulatory penalties since the last audit? (Yes/No + Details)
*   Were there reported fraud cases?
*   Are there significant open or repeat observations?
*   Any high-risk observations previously identified?
*   Have there been significant management or leadership changes?
*   Any major process or operational model changes?
*   Any recent IT system implementations or migrations (e.g., new ERP)?
*   Have there been recent regulatory inspections?
*   Any whistleblower complaints or ethics hotline reports?
*   Has there been rapid business expansion or M&A activity in this unit?

*These answers directly influence the weighting of the AI Risk Engine.*

---

## 7. The Risk Engine
The core analytical brain. It synthesizes uploaded documents, historical findings, and the planning questionnaire to evaluate risk. 

**Strict Rule:** The AI must NEVER output just a rating (e.g., "High Risk"). It must provide the complete audit trail of reasoning.

**Generated Risk Output (Per identified risk):**
*   **Risk Rating:** High / Medium / Low.
*   **Likelihood:** Probability of occurrence (1-5 scale or qualitative).
*   **Impact:** Financial, reputational, or regulatory impact.
*   **Business Justification:** WHY this is a risk (e.g., "Due to the implementation of the new ERP system and recent turnover in the CFO role...").
*   **Evidence:** Explicit citations to uploaded documents (e.g., "Referencing Q3 Fraud Register, page 4").
*   **Historical Trend:** Is this risk increasing, stable, or decreasing?
*   **Recommendation:** Proposed focus area for the upcoming audit.
*   **Residual Risk:** Estimated risk remaining after assuming current controls are effective.

---

## 8. Process Understanding & SOP Summary
To audit a process, the auditor must understand it. The AI analyzes uploaded SOPs and Policies to build a comprehensive process profile.

**SOP Summary Generation:**
*   **Purpose:** The objective of the process.
*   **Scope:** What is covered by the SOP.
*   **Roles & Responsibilities:** Who does what (Makers vs. Checkers).
*   **Approvals:** Hierarchy of authorization limits.
*   **Exceptions:** Documented deviation procedures.
*   **Key Controls:** The critical mitigants within the SOP.
*   **Dependencies:** Upstream and downstream processes.

**Process Execution Summary:**
*   **Input:** What triggers the process?
*   **Process:** The transformation steps.
*   **Output:** The final deliverable or state.
*   **Control Frequency:** (Daily, Weekly, Monthly, Ad-hoc).
*   **Control Owners:** Specific designations responsible.

---

## 9. Flowchart Generation
Visualizing the process is mandatory in Big Four planning. The AI translates the SOP text into a logical sequence.

**Automated Flowchart Output (Editable):**
The system generates a standard business process flow:
`Input Event` → `Data Entry / Maker` → `System Validation` → `Manager Approval / Checker` → `Financial Authorization` → `General Ledger Update` → `Output / Reporting`.

*The auditor can visually edit this diagram to add missing manual workarounds.*

---

## 10. Audit Scoping Document (The Boundary)
This document defines exactly what will and will NOT be audited. It is generated by the AI based on the accepted Risk Matrix.

**Document Sections:**
*   **In Scope:** Specific processes, products, or units to be tested.
*   **Out of Scope:** Explicitly stating what is excluded (to prevent scope creep).
*   **Departments:** Units involved.
*   **Business Processes:** The exact workflows under review.
*   **Applications / IT Systems:** Systems utilized by the in-scope processes.
*   **Financial Period:** The exact date range under review (e.g., April 1, 2025 to March 31, 2026).
*   **Locations:** Physical or virtual branches/geographies.
*   **Stakeholders:** Key auditee contacts.
*   **Testing Strategy:** (e.g., Sample testing, full population data analytics, walkthroughs).

---

## 11. Audit Planning Document (The Deliverable)
The formal Planning Memo presented to the Audit Committee or Chief Audit Executive (CAE) for approval. 

**Document Sections:**
*   **Audit Objective:** What the audit aims to achieve.
*   **Business Background:** Context of the department.
*   **Reason for Selection:** Why this audit is on the annual plan (e.g., Regulatory mandate, high risk score).
*   **Historical Summary:** Recap of previous performance.
*   **Applicable Regulations:** Laws governing the process.
*   **Applicable SOPs & Policies:** Internal governance framework.
*   **Key Risks:** Summarized from the Risk Engine.
*   **Control Environment:** High-level assessment of design adequacy.
*   **Resources:** Number of auditors, specialized skills required (e.g., IT Auditor, SME).
*   **Timeline:** Planning, Fieldwork, Reporting dates.
*   **Required Documents:** The Initial Document Request List (DRL) for the auditee.
*   **Audit Strategy:** Approach to executing the audit.
*   **Expected Deliverables:** Draft Report, Final Report, Management Letter.

---

## 12. Audit Program (The Execution Blueprint)
The final step of planning is drafting the test steps for the fieldwork team.

**AI-Suggested Audit Procedures (Linked to Risks):**
*Example procedures generated based on the SOPs and Risks:*
*   *Verify Bank Reconciliation:* Obtain monthly bank reconciliations for the period and verify Maker/Checker signatures.
*   *Review Approval Matrix:* Select a sample of 25 capital expenditures and trace approvals against the Board-approved Delegation of Authority matrix.
*   *Verify Segregation of Duties:* Extract system access logs to ensure no single user has both vendor creation and payment authorization rights.
*   *Review Vendor Creation Controls:* Test 15 newly created vendors for valid tax IDs, business licenses, and background checks.
*   *Review Payment Authorization:* Verify that all payments exceeding $50k contain secondary tokenized authorization from the Treasury Director.

---
*End of Workflow Architecture.*
