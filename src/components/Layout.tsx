import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FilterAltIcon from '@mui/icons-material/FilterAlt'; // Icon for personalized suggestions
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Icon for light mode
import { useThemeContext } from '../contexts/ThemeContext'; // Import the theme context hook

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { mode, toggleTheme } = useThemeContext(); // Get theme mode and toggle function

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme: Theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Lotofácil Analyzer
          </Typography>
          {/* Theme toggle button */}
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItemButton component={RouterLink} to="/">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/importacao">
              <ListItemIcon>
                <CloudUploadIcon />
              </ListItemIcon>
              <ListItemText primary="Importação" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/entrada-manual">
              <ListItemIcon>
                <EditNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Entrada Manual" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/sugestoes"> {/* Keep old suggestions for now? */}
              <ListItemIcon>
                <LightbulbIcon />
              </ListItemIcon>
              <ListItemText primary="Sugestões (Fech.)" />
            </ListItemButton>
            {/* Add link for Personalized Suggestions */}
            <ListItemButton component={RouterLink} to="/sugestoes-personalizadas">
              <ListItemIcon>
                <FilterAltIcon />
              </ListItemIcon>
              <ListItemText primary="Sugestões (Filtros)" />
            </ListItemButton>
            {/* Add link for Histórico de Sugestões */}
            <ListItemButton component={RouterLink} to="/historico">
              <ListItemIcon>
                <FilterAltIcon />
              </ListItemIcon>
              <ListItemText primary="Histórico de Sugestões" />
            </ListItemButton>

          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}> {/* Use theme background */}
        <Toolbar />
        <Container maxWidth="xl"> {/* Use xl for wider content area like the example */}
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
