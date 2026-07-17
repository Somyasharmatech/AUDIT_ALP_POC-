import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CreateAudit from './pages/CreateAudit';
import AuditExecution from './pages/AuditExecution';
import ReviewCenter from './pages/ReviewCenter';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/audit/new" element={<CreateAudit />} />
        <Route path="/audit/:id/execute" element={<AuditExecution />} />
        <Route path="/audit/:id/review" element={<ReviewCenter />} />
        {/* Placeholders for sidebar links */}
        <Route path="/audits/running" element={<Navigate to="/dashboard" replace />} />
        <Route path="/reports" element={<Navigate to="/dashboard" replace />} />
        <Route path="/memory" element={<Navigate to="/dashboard" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
