import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Tabs, Tab, Card, CardContent, Chip, CircularProgress, Alert, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import estatisticaService, { Sugestao } from '../services/estatistica/estatisticaService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sugestoes-tabpanel-${index}`}
      aria-labelledby={`sugestoes-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Sugestoes: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [sugestoes17, setSugestoes17] = useState<Sugestao[]>([]);
  const [sugestoes16, setSugestoes16] = useState<Sugestao[]>([]);
  const [sugestoes15, setSugestoes15] = useState<Sugestao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSugestoes = async () => {
      try {
        setLoading(true);
        
        const [response17, response16, response15] = await Promise.all([
          estatisticaService.obterSugestoesFechamento17(),
          estatisticaService.obterSugestoesFechamento16(),
          estatisticaService.obterSugestoesFechamento15()
        ]);
        
        setSugestoes17(response17.data);
        setSugestoes16(response16.data);
        setSugestoes15(response15.data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar sugestões. Verifique se o backend está em execução.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSugestoes();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderSugestoes = (sugestoes: Sugestao[]) => {
    if (sugestoes.length === 0) {
      return (
        <Alert severity="info">
          Nenhuma sugestão disponível. Importe resultados para gerar sugestões.
        </Alert>
      );
    }

    return (
      <Grid container spacing={3}>
        {sugestoes.map((sugestao, index) => (
          <Grid size={12}>
             
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sugestão {index + 1}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {sugestao.garantia}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                  {sugestao.numeros.map((numero) => (
                    <Chip 
                      key={numero} 
                      label={numero} 
                      color="primary" 
                      variant="outlined" 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%',
                        fontWeight: 'bold'
                      }} 
                    />
                  ))}
                </Box>
                <Typography variant="body2">
                  Probabilidade: {(sugestao.probabilidade * 100).toFixed(6)}%
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 2 }}
                  onClick={() => {
                    navigator.clipboard.writeText(sugestao.numeros.join(', '));
                  }}
                >
                  Copiar números
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sugestões de Jogos
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Fechamento 17 números" />
          <Tab label="Fechamento 16 números" />
          <Tab label="Jogo com 15 números" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Fechamento com 17 números (Garantia mínimo 14 acertos)
          </Typography>
          <Typography variant="body1" paragraph>
            Este fechamento utiliza 17 números selecionados estatisticamente para criar múltiplos jogos que garantem pelo menos 14 acertos caso os 15 números sorteados estejam entre os 17 escolhidos.
          </Typography>
          {renderSugestoes(sugestoes17)}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Fechamento com 16 números (Garantia mínimo 14 acertos)
          </Typography>
          <Typography variant="body1" paragraph>
            Este fechamento utiliza 16 números selecionados estatisticamente para criar múltiplos jogos que garantem pelo menos 14 acertos caso os 15 números sorteados estejam entre os 16 escolhidos.
          </Typography>
          {renderSugestoes(sugestoes16)}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Jogo com 15 números
          </Typography>
          <Typography variant="body1" paragraph>
            Sugestão de jogo simples com 15 números selecionados com base nas estatísticas de frequência, atraso e padrões identificados.
          </Typography>
          {renderSugestoes(sugestoes15)}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Sugestoes;
