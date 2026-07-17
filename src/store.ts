import { create } from 'zustand';
import { Audit } from '@/src/types';

interface AppState {
  audits: Audit[];
  activeAuditId: string | null;
  setAudits: (audits: Audit[]) => void;
  addAudit: (audit: Audit) => void;
  updateAudit: (id: string, updates: Partial<Audit>) => void;
  setActiveAudit: (id: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  audits: [],
  activeAuditId: null,
  setAudits: (audits) => set({ audits }),
  addAudit: (audit) => set((state) => ({ audits: [...state.audits, audit] })),
  updateAudit: (id, updates) => set((state) => ({
    audits: state.audits.map((a) => (a.id === id ? { ...a, ...updates } : a)),
  })),
  setActiveAudit: (id) => set({ activeAuditId: id }),
}));
