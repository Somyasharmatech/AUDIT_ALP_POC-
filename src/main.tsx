import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Dashboard from './pages/Dashboard';
import CreateAudit from './pages/CreateAudit';
import DocumentReviewWorkspace from './pages/DocumentReviewWorkspace';
import ProcessingOrchestrator from './pages/ProcessingOrchestrator';
import ReviewCenter from './pages/ReviewCenter';
import Login from './pages/Login';
import AuditUniverse from './pages/AuditUniverse';
import AuditCalendar from './pages/AuditCalendar';
import AuditWorkspace from './pages/AuditWorkspace';
import EmptyFeature from './pages/EmptyFeature';
import { useStore } from './store';
import { ApiClient } from './lib/api';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, authInitialized } = useStore();
  if (!authInitialized) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-[#6C757D]">Loading workspace...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const { setUser, setAuthInitialized } = useStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await ApiClient.get('/auth/me');
          setUser(user);
        } catch (e) {
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthInitialized(true);
    };
    
    initializeAuth();
  }, [setUser, setAuthInitialized]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/audit/new" element={<ProtectedRoute><CreateAudit /></ProtectedRoute>} />
          <Route path="/audit/:id/workspace" element={<ProtectedRoute><AuditWorkspace /></ProtectedRoute>} />
          <Route path="/audit/:id/review" element={<ProtectedRoute><DocumentReviewWorkspace /></ProtectedRoute>} />
          <Route path="/audit/:id/document-review" element={<ProtectedRoute><DocumentReviewWorkspace /></ProtectedRoute>} />
          <Route path="/audit/:id/processing" element={<ProtectedRoute><ProcessingOrchestrator /></ProtectedRoute>} />
          <Route path="/audit/:id/recommendation" element={<ProtectedRoute><Navigate to="/audit/:id/workspace" replace /></ProtectedRoute>} />
          <Route path="/audits/universe" element={<ProtectedRoute><AuditUniverse /></ProtectedRoute>} />
          <Route path="/audits/calendar" element={<ProtectedRoute><AuditCalendar /></ProtectedRoute>} />
          
          {/* Foundation feature placeholders */}
          <Route path="/reports" element={<ProtectedRoute><EmptyFeature title="Findings & Review" description="Review exceptions, draft reports, and track remediation." /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><EmptyFeature title="Analytics" description="Advanced metrics, heatmaps, and enterprise risk reporting." /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><EmptyFeature title="Settings" description="Manage users, integrations, and global workspace configuration." /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
