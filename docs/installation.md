# Installation Instructions

This guide explains how to run AUDIT ALP locally on your machine.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Somyasharmatech/AUDIT_ALP.git
   cd AUDIT_ALP
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and adjust if necessary.
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Production Build

To build the application for production deployment (e.g., to a Docker container or Cloud Run):

1. **Build the project**:
   ```bash
   npm run build
   ```
   This command compiles the React frontend into static assets in `dist/` and bundles the Express backend into `dist/server.cjs`.

2. **Start the Production Server**:
   ```bash
   npm start
   ```
