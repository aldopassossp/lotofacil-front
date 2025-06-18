import { PaletteMode } from '@mui/material';
import { amber, deepOrange, grey } from '@mui/material/colors';

// Function to get design tokens based on mode (light/dark)
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Palette values for light mode
          primary: {
            main: '#1976d2', // Default blue
          },
          secondary: {
            main: '#dc004e', // Default pink/red
          },
          divider: grey[300],
          background: {
            default: grey[100], // Lighter grey background
            paper: '#ffffff', // White paper
          },
          text: {
            primary: grey[900],
            secondary: grey[700],
          },
        }
      : {
          // Palette values for dark mode (inspired by user image)
          primary: {
            main: '#64b5f6', // Lighter blue for dark mode
          },
          secondary: {
            main: '#f06292', // Lighter pink/red for dark mode
          },
          divider: grey[700],
          background: {
            default: '#1f2937', // Dark grey/blue background
            paper: '#2d3748', // Slightly lighter dark paper
          },
          text: {
            primary: '#ffffff',
            secondary: grey[400],
          },
        }),
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
  },
  // Optional: Customize components styles based on theme
  // components: { ... }
});

export default getDesignTokens;

