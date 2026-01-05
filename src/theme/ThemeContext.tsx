import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AppTheme, THEMES } from './themes';

type ThemeContextType = {
  theme: typeof THEMES[AppTheme];
  themeMode: AppTheme;
  setTheme: (mode: AppTheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<AppTheme>('light');

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'orange') {
        setThemeMode(stored);
      }
    });
  }, []);

  const setTheme = (mode: AppTheme) => {
    setThemeMode(mode);
    AsyncStorage.setItem('themeMode', mode).catch(() => {});
  };

  const value: ThemeContextType = {
    theme: THEMES[themeMode],
    themeMode,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used inside ThemeProvider');
  }
  return context;
}