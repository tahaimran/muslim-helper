import { createContext, useContext } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primaryGreen: string;
  mediumGreen: string;
  lightGreen: string;
  freshGreen: string;
  paleGreen: string;
  gold: string;
  paleGold: string;
  cream: string;
  darkText: string;
  mediumText: string;
  mutedText: string;
  white: string;
  border: string;
  surface: string;
  error: string;
  success: string;
  cardBackground: string;
  inputBackground: string;
  shadowColor: string;
}

export const lightTheme: ThemeColors = {
  primaryGreen: '#1B4332',
  mediumGreen: '#2D6A4F',
  lightGreen: '#40916C',
  freshGreen: '#52B788',
  paleGreen: '#D8F3DC',
  gold: '#C9A84C',
  paleGold: '#FFF9E6',
  cream: '#FAF8F3',
  darkText: '#1A1A1A',
  mediumText: '#4A4A4A',
  mutedText: '#8A8A8A',
  white: '#FFFFFF',
  border: '#E0D8CC',
  surface: '#FFFDF9',
  error: '#C0392B',
  success: '#27AE60',
  cardBackground: '#FFFFFF',
  inputBackground: '#FFFDF9',
  shadowColor: '#000000',
};

export const darkTheme: ThemeColors = {
  primaryGreen: '#52B788',
  mediumGreen: '#40916C',
  lightGreen: '#2D6A4F',
  freshGreen: '#74C69D',
  paleGreen: '#1B4332',
  gold: '#D4AF37',
  paleGold: '#2A2510',
  cream: '#0F1A14',
  darkText: '#E8E8E8',
  mediumText: '#B0B0B0',
  mutedText: '#808080',
  white: '#1A1A1A',
  border: '#2A3A30',
  surface: '#162018',
  error: '#E74C3C',
  success: '#2ECC71',
  cardBackground: '#1E2D24',
  inputBackground: '#162018',
  shadowColor: '#000000',
};

export interface ThemeContextType {
  colors: ThemeColors;
  mode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  colors: lightTheme,
  mode: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);
