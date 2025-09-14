import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isDark, setIsDark] = useState(false);
  const systemColorScheme = useSystemColorScheme();

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update isDark when themeMode changes
  useEffect(() => {
    setIsDark(themeMode === 'dark');
  }, [themeMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      } else {
        // Default to system theme if no saved preference
        setThemeModeState(systemColorScheme === 'dark' ? 'dark' : 'light');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
      // Fallback to system theme
      setThemeModeState(systemColorScheme === 'dark' ? 'dark' : 'light');
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = themeMode === 'light' ? 'dark' : 'light';
      console.log('ThemeContext: Toggling theme from', themeMode, 'to', newTheme);
      setThemeModeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      console.log('ThemeContext: Theme saved to storage:', newTheme);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const value: ThemeContextType = {
    themeMode,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
