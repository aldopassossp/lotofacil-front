import React, { createContext, useState, useMemo, useContext, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, PaletteMode } from '@mui/material';
import getDesignTokens from '../theme'; // Import the theme definition

// Define the shape of the context
interface ThemeContextType {
  toggleTheme: () => void;
  mode: PaletteMode;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create the provider component
interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  // State to hold the current theme mode (light or dark)
  const [mode, setMode] = useState<PaletteMode>('dark'); // Default to dark based on user image

  // Function to toggle the theme mode
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Create the theme object based on the current mode
  // useMemo ensures the theme is only recreated when the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  // Value provided by the context
  const contextValue = useMemo(() => ({ toggleTheme, mode }), [toggleTheme, mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context easily
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a CustomThemeProvider');
  }
  return context;
};

