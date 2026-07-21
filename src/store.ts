import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  authInitialized: boolean;
  setUser: (user: User | null) => void;
  setAuthInitialized: (initialized: boolean) => void;
}

export const useStore = create<AuthState>((set) => ({
  user: null,
  authInitialized: false,
  setUser: (user) => set({ user }),
  setAuthInitialized: (initialized) => set({ authInitialized: initialized }),
}));
