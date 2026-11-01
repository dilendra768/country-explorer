import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'guest' | 'admin';
export type Theme = 'light' | 'dark';

interface AppState {
  role: Role;
  theme: Theme;
  favorites: string[];
  history: string[];
  setRole: (role: Role) => void;
  toggleTheme: () => void;
  toggleFavorite: (code: string) => void;
  addHistory: (term: string) => void;
  clearHistory: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      role: 'guest',
      theme: 'light',
      favorites: [],
      history: [],
      setRole: (role) => set({ role }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleFavorite: (code) => {
        if (get().role !== 'admin') return; // guests cannot save favorites
        set((s) => ({
          favorites: s.favorites.includes(code)
            ? s.favorites.filter((c) => c !== code)
            : [...s.favorites, code],
        }));
      },
      addHistory: (term) =>
        set((s) => ({
          history: [term, ...s.history.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 8),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'country-explorer-store',
      // role is intentionally not persisted: every session starts as Guest
      partialize: (s) => ({ theme: s.theme, favorites: s.favorites, history: s.history }),
    },
  ),
);
