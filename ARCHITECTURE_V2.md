# AUDIT ALP - Version 2 Architecture Blueprint

**AI Audit Planning & Scoping Platform**

## 1. Software Architecture
The system follows a standard Enterprise Client-Server Architecture designed for high security, data locality, and scalability. 
*   **Frontend**: React 19 (TypeScript, Vite) implementing a Single Page Application (SPA). Styled with Tailwind CSS adhering strictly to an enterprise, high-contrast, minimalist design language (Microsoft Fluent / SAP Fiori inspiration).
*   **Backend**: Node.js with Express.js acting as a RESTful API layer and orchestrator for AI pipelines. 
*   **Persistence (Future-Proofed)**: PostgreSQL for structured relational data (RBAC, Audit Projects, Metadata) and a Vector Database (e.g., pgvector) for unstructured document embeddings.
*   **Authentication**: Simple Enterprise JWT Authentication with RBAC. Firebase Authentication has been removed.
*   **Infrastructure**: Containerized deployments (Docker/Cloud Run) with stateless compute nodes to allow horizontal scaling during heavy document processing workloads.

## 2. Complete User Flow
1.  **Authentication & RBAC**: User logs in via Enterprise JWT Authentication with RBAC (Roles: Administrator, Head of Internal Audit, Audit Manager, Senior Auditor, Auditor, Reviewer). Role is determined.
2.  **Global Dashboard**: User views active planning projects, recent AI processing statuses, and organizational risk heatmaps.
3.  **Project Initiation (Workspace Creation)**: User creates a new "Audit Engagement Workspace" (e.g., "Q3 Financial Controls Audit").
4.  **Knowledge Ingestion**: User uploads historical audit reports, SOPs, policies, and regulatory frameworks into the workspace.
5.  **AI Pipeline Execution (Asynchronous)**: 
    *   System ingests, parses, chunks, and vectorizes the documents.
    *   User sees a real-time progress indicator.
6.  **Process Understanding & Review**: AI generates an interactive "Process Flow" and "SOP Summary". Auditor reviews, edits, and approves this baseline understanding.
7.  **Risk & Control Matrix (RCM) Generation**: AI proposes a Risk Assessment based on historical findings and SOP gaps. Auditor accepts/rejects risks.
8.  **Scoping & Planning Generation**: Based on approved risks and processes, AI drafts the "Audit Scoping Document" and "Audit Planning Document".
9.  **Workflow Approval**: Drafts are routed to the Head of Internal Audit for digital sign-off.

## 3. Screen List
*   `AUTH_01`: Enterprise Login Gateway (JWT)
*   `DASH_01`: Global Audit Portfolio Dashboard (White background, standard data tables, metric cards)
*   `PROJ_01`: Engagement Workspace Overview
*   `DOC_01`: Document Management Center (Drag & drop upload, parsing status, document metadata)
*   `INT_01`: Process Intelligence View (AI-generated SOP summaries, process flow narratives)
*   `RSK_01`: Risk Assessment Matrix (Editable data grid mapping risks to processes)
*   `PLN_01`: Scoping & Planning Output (WYSIWYG document editor with AI side-by-side citations)
*   `SET_01`: Governance & Access Control Settings

## 4. Backend Architecture
The Node.js/Express backend follows a strict **N-Tier Layered Architecture**:
*   **Controller Layer**: Handles HTTP requests, input validation, and response formatting.
*   **Service Layer**: Contains core business logic (e.g., EngagementService, DocumentService).
*   **AI Orchestration Layer**: Manages the interaction with Google Gemini, prompt assembly, and rate-limiting.
*   **Data Access Layer (Repository)**: Abstracts database interactions (PostgreSQL queries).
*   **Worker/Event Layer**: Background job processing for heavy document parsing (using BullMQ or similar).

## 5. AI Pipeline
A robust Retrieval-Augmented Generation (RAG) and extraction pipeline:
1.  **Ingestion & OCR**: Convert PDF/Word/Excel into raw text.
2.  **Semantic Chunking**: Split text into overlapping, semantically meaningful chunks (e.g., grouped by SOP section).
3.  **Embedding Generation**: Use Gemini Embedding models to vectorize chunks.
4.  **Vector Storage**: Store chunks + metadata in the Vector DB.
5.  **Contextual Retrieval**: When generating a Scoping Document, retrieve top-K relevant chunks regarding "historical failures" and "key controls".
6.  **Prompt Assembly & Generation**: Feed structured enterprise prompts + retrieved context into Gemini to synthesize the final documents.

## 6. Folder Structure
```text
/
├── src/
│   ├── client/                  # React Frontend
│   │   ├── components/          # Reusable enterprise UI components (Buttons, DataGrids)
│   │   ├── features/            # Feature-based modules (Workspace, Risk, Planning)
│   │   ├── pages/               # Page-level route components
│   │   ├── services/            # API client wrappers
│   │   ├── styles/              # Tailwind configuration & global CSS
│   │   └── utils/               # Frontend helpers
│   ├── server/                  # Node.js Express Backend
│   │   ├── api/                 # Express Routes & Controllers
│   │   ├── config/              # Environment & App Configuration
│   │   ├── middleware/          # Auth, Error Handling, File Upload (Multer)
│   │   ├── models/              # Database Schemas & Types
│   │   ├── services/            # Business Logic & Core Services
│   │   └── ai/                  # AI Pipeline, Agents, and Prompts
│   └── shared/                  # Shared TypeScript Interfaces & Types
├── docs/                        # Architectural Diagrams & API Specs
├── package.json
└── tsconfig.json
```

## 7. Database Schema (Logical PostgreSQL Design)
*   **users** (id, email, password_hash, role, name, created_at)
*   **engagements** (id, name, department, financial_year, audit_type, status, start_date, end_date, owner_id)
*   **documents** (id, engagement_id, file_name, file_type, storage_url, parsing_status)
*   **document_chunks** (id, document_id, content, embedding_vector)
*   **risks** (id, engagement_id, description, impact, likelihood, ai_generated_flag)
*   **planning_docs** (id, engagement_id, scope_text, methodology_text, status)

## 8. API Design
RESTful and versioned, strictly returning JSON.
*   `POST /api/v1/auth/login` - Authenticate user
*   `POST /api/v1/auth/register` - Register user (or provisioned by admin)
*   `GET /api/v1/auth/me` - Get current user profile and role
*   `GET /api/v1/engagements` - List audit projects
*   `POST /api/v1/engagements` - Create a new audit project
*   `POST /api/v1/engagements/:id/documents` - Upload historical files (multipart/form-data)
*   `GET /api/v1/engagements/:id/processing-status` - Poll AI ingestion status
*   `POST /api/v1/ai/generate-sop-summary` - Trigger AI SOP summarization
*   `POST /api/v1/ai/generate-risk-matrix` - Trigger AI risk extraction
*   `GET /api/v1/engagements/:id/planning-document` - Retrieve generated planning text

## 9. AI Agent Architecture
Utilizes a **Multi-Agent Collaborative Approach** using Gemini capabilities:
*   **Supervisor Agent**: Receives the user request (e.g., "Draft Scoping Document") and delegates tasks.
*   **SOP Analyst Agent**: Specialized prompt instructed to read SOPs and extract standard operating procedures, roles, and process steps.
*   **Risk Assessor Agent**: Instructed to compare SOPs against historical audit findings to identify control gaps.
*   **Audit Director Agent (Critic)**: Reviews the output of the Scoping Document against Big Four standards (clarity, precision, tone) and refines the text before returning it to the user.

## 10. Functional Modules
1.  **Identity & Access Management (IAM)**: Secure login, JWT management, strict RBAC enforcement based on enterprise roles (Administrator, Head of Internal Audit, Audit Manager, Senior Auditor, Auditor, Reviewer).
2.  **Workspace Management**: CRUD operations for Audit Engagements.
3.  **Data Ingestion Engine**: Safe handling of enterprise documents, parsing, and cloud storage integration.
4.  **AI Orchestrator**: The RAG pipeline, embedding management, and prompt engineering center.
5.  **Interactive Editor**: A robust rich-text interface allowing auditors to modify, accept, or reject AI-generated paragraphs and risk items.
6.  **Export & Reporting**: Generation of final Word/PDF documents strictly adhering to corporate templates.
