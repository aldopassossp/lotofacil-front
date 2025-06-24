import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import Importacao from './pages/Importacao';
import Sugestoes from './pages/Sugestoes';
import EntradaManual from './pages/EntradaManual';
import SugestoesPersonalizadas from './pages/SugestoesPersonalizadas';
import Layout from './components/Layout';
import HealthCheck from './components/HealthCheck';
import { CustomThemeProvider } from './contexts/ThemeContext'; // Import the custom theme provider

function App() {
  return (
    // Wrap the entire application with the CustomThemeProvider
    <CustomThemeProvider>
      <CssBaseline /> {/* Ensures baseline styles are applied based on theme */}
      <Router>
        <Layout> {/* Layout now has access to theme context via useThemeContext */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/importacao" element={<Importacao />} />
            <Route path="/sugestoes" element={<Sugestoes />} />
            <Route path="/entrada-manual" element={<EntradaManual />} />
            <Route path="/sugestoes-personalizadas" element={<SugestoesPersonalizadas />} />
          </Routes>
          <HealthCheck />
        </Layout>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
