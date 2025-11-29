// Dark Mode Context for Kiro Fitfin Agent
// Provides theme state and toggle functionality with localStorage persistence

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DarkModeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

const DARK_MODE_STORAGE_KEY = 'kiro-fitfin-dark-mode';

interface DarkModeProviderProps {
  children: ReactNode;
}

/**
 * Dark Mode Provider Component
 * Manages dark mode state and persists preference to localStorage
 */
export function DarkModeProvider({ children }: DarkModeProviderProps) {
  // Initialize from localStorage or default to false (light mode)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    
    const stored = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    
    // Check system preference as fallback
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Persist preference to localStorage
  useEffect(() => {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(isDark));
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

/**
 * Custom hook to access dark mode context
 * @throws Error if used outside DarkModeProvider
 */
export function useDarkMode(): DarkModeContextType {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
