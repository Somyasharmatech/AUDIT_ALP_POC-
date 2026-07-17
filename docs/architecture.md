# AUDIT ALP Architecture

## Overview

AUDIT ALP is designed as a single-node, full-stack application. It leverages a modern React frontend and an Express backend, bundled together for seamless deployment as a containerized service.

## Frontend Architecture

- **Framework**: React 18 with Vite for fast HMR and optimized builds.
- **Routing**: `react-router-dom` for client-side navigation.
- **State Management**: `zustand` for lightweight, scalable global state (handling active audits, navigation states, and UI preferences).
- **Styling**: Tailwind CSS combined with `shadcn/ui` components for rapid, accessible, and enterprise-grade UI development.
- **Animations**: `motion/react` (Framer Motion) for orchestrating complex, sequential animations during the AI execution phase.
- **Data Visualization**: `recharts` for rendering complex business intelligence dashboards (e.g., vendor concentration, monthly trends).

## Backend Architecture

- **Server**: Node.js with Express.
- **Role**: Serves the static React build in production, proxies API requests, and orchestrates the mocked AI workflow.
- **Workflow Simulation**: The server maintains an in-memory state of running audits. When an audit is triggered, a state machine simulates the progressive execution of 8 distinct "AI Departments", emitting logs and updating progress metrics over time.
- **Build Process**: The TypeScript backend is transpiled and bundled into a single CommonJS file (`dist/server.cjs`) using `esbuild`.

## Data Flow

1. **Upload**: User submits audit context and business documents.
2. **Initialization**: The frontend calls the backend API to create a new Audit session.
3. **Execution**: The backend begins the asynchronous simulation. The frontend polls or listens to the backend (via REST or simulated SSE) for real-time progress and log streams.
4. **Completion**: Once the workflow reaches 100%, the backend finalizes the findings and populates the analytics object.
5. **Review**: The human auditor uses the Review Center to approve/reject findings, updating the backend state.
