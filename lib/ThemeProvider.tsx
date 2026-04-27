import { useState, useEffect, useCallback } from 'react';
import { ThemeContext, lightTheme, darkTheme, ThemeMode } from './theme';
import { appStorage } from './storage';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    (async () => {
      const saved = await appStorage.getThemeMode();
      if (saved) setMode(saved);
    })();
  }, []);

  const toggleTheme = useCallback(async () => {
    const newMode: ThemeMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    await appStorage.setThemeMode(newMode);
  }, [mode]);

  const colors = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ colors, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
