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
  primaryGreen: '#4A6352',
  mediumGreen: '#8DAA91',
  lightGreen: '#B5C9B8',
  freshGreen: '#CDE0D2',
  paleGreen: '#DEE8E0',
  gold: '#D4B483',
  paleGold: '#F2E8DA',
  cream: '#F9FBF9',
  darkText: '#333333',
  mediumText: '#555555',
  mutedText: '#888888',
  white: '#FFFFFF',
  border: '#E8EDE9',
  surface: '#FDFDFD',
  error: '#E07A5F',
  success: '#8DAA91',
  cardBackground: '#FFFFFF',
  inputBackground: '#FDFDFD',
  shadowColor: 'rgba(74, 99, 82, 0.1)',
};

export const darkTheme: ThemeColors = {
  primaryGreen: '#8DAA91',
  mediumGreen: '#B5C9B8',
  lightGreen: '#CDE0D2',
  freshGreen: '#DEE8E0',
  paleGreen: '#2D3B31',
  gold: '#D4B483',
  paleGold: '#3D3528',
  cream: '#1A211C',
  darkText: '#F9FBF9',
  mediumText: '#D1D1D1',
  mutedText: '#A1A1A1',
  white: '#1A211C',
  border: '#2D3B31',
  surface: '#1F2922',
  error: '#E07A5F',
  success: '#8DAA91',
  cardBackground: '#263029',
  inputBackground: '#1F2922',
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
