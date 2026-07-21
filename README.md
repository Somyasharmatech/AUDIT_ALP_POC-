# AUDIT ALP - Agentic Intelligence Engine

AUDIT ALP is an enterprise-grade Proof of Concept (PoC) demonstrating an autonomous AI workforce for internal auditing. It simulates a team of specialized AI agents working sequentially to process documents, understand business context, identify risks, and generate executive reports.

## Key Features

- **Audit Orchestrator**: Simulates multiple AI departments (Document Intelligence, Business Understanding, Risk & Controls, etc.).
- **Business Intelligence**: Generates executive KPIs, risk heatmaps, and budget variance analytics.
- **Review Center**: Human-in-the-loop interface for approving, rejecting, or requesting revisions on AI findings.
- **Executive Reporting**: Automated generation of boardroom-ready audit reports.
- **Demo Mode**: One-click population of sample data for instant demonstrations.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Radix UI (shadcn/ui).
- **Backend**: Node.js, Express (compiled via esbuild).
- **Architecture**: Full-stack modular monolith ready for containerized deployment.

## Repository Structure

- `/src`: Frontend React application.
  - `/components`: Reusable UI components.
  - `/pages`: Main application views (Dashboard, AuditExecution, ReviewCenter, etc.).
- `server.ts`: Express backend handling API routes and simulating the AI workforce.
- `/docs`: Architecture, installation, and demo instructions.
- `/data`: Sample datasets for the demo mode.

For more details, please see the documentation in the `/docs` directory.

## Roadmap
Please refer to `ROADMAP.md` for the current engineering roadmap, which prioritizes business workflow completion (Sprint 2-4) before AI capabilities (Sprint 5-6). Firebase has been removed in favor of simple JWT Enterprise Auth.
