import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, shared, ThemeColors, ThemeMode } from '../constants/colors';

interface ThemeContextValue {
  colors: ThemeColors;
  shared: typeof shared;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = '@theme_preference';

const ThemeContext = createContext<ThemeContextValue>({
  colors: themes.dark,
  shared,
  mode: 'dark',
  isDark: true,
  setMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setModeState(stored);
      }
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode).catch(() => {});
  };

  const resolvedDark =
    mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  const colors = resolvedDark ? themes.dark : themes.light;

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ colors, shared, mode, isDark: resolvedDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
