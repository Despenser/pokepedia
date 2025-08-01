import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Определяем начальную тему на основе системных предпочтений
const getInitialTheme = () => {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  return prefersDarkScheme.matches ? 'dark' : 'light';
};

export const useThemeStore = create(
  persist(
    (set) => ({
      // Используем светлую или темную тему
      theme: getInitialTheme(),

      // Действие для переключения темы
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
    }),
    {
      name: 'theme-storage'
    }
  )
);