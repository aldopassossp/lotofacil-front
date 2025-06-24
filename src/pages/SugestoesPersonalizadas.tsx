import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Slider,
  Switch
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { FiltroSugestaoDTO } from '../dto/sugestao/FiltroSugestaoDTO';
import sugestaoService from '../services/sugestao/sugestaoService';
import { Todos } from '../entity/Todos';

const SugestoesPersonalizadas: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltroSugestaoDTO>({
    somaMinima: undefined,
    somaMaxima: undefined,
    paresMinimo: undefined,
    paresMaximo: undefined,
    seqDoisMinimo: undefined,
    seqDoisMaximo: undefined,
    seqTresMinimo: undefined,
    seqTresMaximo: undefined,
    seqQuatroMinimo: undefined,
    seqQuatroMaximo: undefined,
    seqCincoMinimo: undefined,
    seqCincoMaximo: undefined,
    seqSeisMinimo: undefined,
    seqSeisMaximo: undefined,
    seqSeteMinimo: undefined,
    seqSeteMaximo: undefined,
    seqOitoMinimo: undefined,
    seqOitoMaximo: undefined,
    pontosMinimo: undefined,
    pontosMaximo: undefined,
    linhaMinimo: undefined,
    linhaMaximo: undefined,
    colunaMinimo: undefined,
    colunaMaximo: undefined,
    jaFoiSorteado: undefined,
    numerosObrigatorios: [],
    numerosProibidos: []
  });

  const [resultados, setResultados] = useState<Todos[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["basicos"]);

  // Estados para controle de filtros avançados
  const [usarSoma, setUsarSoma] = useState(false);
  const [usarPares, setUsarPares] = useState(false);
  const [usarSequencias, setUsarSequencias] = useState(false);
  const [usarPontos, setUsarPontos] = useState(false);
  const [usarLinhaColuna, setUsarLinhaColuna] = useState(false);
  const [usarSorteado, setUsarSorteado] = useState(false);
  const [usarNumerosEspecificos, setUsarNumerosEspecificos] = useState(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFilters(prev => 
      isExpanded 
        ? [...prev, panel]
        : prev.filter(p => p !== panel)
    );
  };

  const handleFiltroChange = (campo: keyof FiltroSugestaoDTO, valor: any) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSliderChange = (campo: keyof FiltroSugestaoDTO, valor: number | number[]) => {
    if (Array.isArray(valor)) {
      const [min, max] = valor;
      const campoMinimo = campo.replace('Range', 'Minimo') as keyof FiltroSugestaoDTO;
      const campoMaximo = campo.replace('Range', 'Maximo') as keyof FiltroSugestaoDTO;
      setFiltros(prev => ({
        ...prev,
        [campoMinimo]: min,
        [campoMaximo]: max
      }));
    }
  };

const buscarSugestoes = async () => {
  try {
    setLoading(true);
    setError(null);

    const filtrosLimpos = { ...filtros };

    // (Seu código de limpeza dos filtros permanece igual)

    const response = await sugestaoService.buscarSugestoesPersonalizadas(filtrosLimpos);

    const resultadosAPI = response?.data?.content ?? [];

    setResultados(Array.isArray(resultadosAPI) ? resultadosAPI : []);
  } catch (err) {
    setError('Erro ao buscar sugestões. Verifique os filtros e tente novamente.');
    console.error('Erro na busca:', err);
  } finally {
    setLoading(false);
  }
};

  const limparFiltros = () => {
    setFiltros({
      somaMinima: undefined,
      somaMaxima: undefined,
      paresMinimo: undefined,
      paresMaximo: undefined,
      imparesMinimo: undefined,
      imparesMaximo: undefined,
      seqDoisMinimo: undefined,
      seqDoisMaximo: undefined,
      seqTresMinimo: undefined,
      seqTresMaximo: undefined,
      seqQuatroMinimo: undefined,
      seqQuatroMaximo: undefined,
      seqCincoMinimo: undefined,
      seqCincoMaximo: undefined,
      seqSeisMinimo: undefined,
      seqSeisMaximo: undefined,
      seqSeteMinimo: undefined,
      seqSeteMaximo: undefined,
      seqOitoMinimo: undefined,
      seqOitoMaximo: undefined,
      pontosMinimo: undefined,
      pontosMaximo: undefined,
      linhaMinimo: undefined,
      linhaMaximo: undefined,
      colunaMinimo: undefined,
      colunaMaximo: undefined,
      jaFoiSorteado: undefined,
      numerosObrigatorios: [],
      numerosProibidos: []
    });
    
    setUsarSoma(false);
    setUsarPares(false);
    setUsarSequencias(false);
    setUsarPontos(false);
    setUsarLinhaColuna(false);
    setUsarSorteado(false);
    setUsarNumerosEspecificos(false);
  };

  const renderNumeros = (todos: Todos) => {
    // Extrai os números da string 'sequencia', converte para número e ordena
    const numeros = todos.sequencia
      ? (todos.sequencia.match(/\d{2}/g)?.map(Number).sort((a, b) => a - b) || [])
      : [];

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
        {numeros.map((numero, index) => (
          <Chip 
            key={index} 
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
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sugestões Personalizadas
      </Typography>
      
      <Typography variant="body1" paragraph color="textSecondary">
        Configure os filtros estatísticos para encontrar combinações que atendam aos seus critérios específicos.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FilterListIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filtros de Busca</Typography>
        </Box>

        {/* Filtro de Soma */}
        <Accordion expanded={expandedFilters.includes('soma')} onChange={handleAccordionChange('soma')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormControlLabel
              control={
                <Switch
                  checked={usarSoma}
                  onChange={(e) => setUsarSoma(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label="Filtro por Soma dos Números"
              sx={{ mr: 2 }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Soma Mínima"
                  type="number"
                  value={filtros.somaMinima || ''}
                  onChange={(e) => handleFiltroChange('somaMinima', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarSoma}
                />
              </Grid>
              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Soma Máxima"
                  type="number"
                  value={filtros.somaMaxima || ''}
                  onChange={(e) => handleFiltroChange('somaMaxima', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarSoma}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Filtro de Pares/Ímpares */}
        <Accordion expanded={expandedFilters.includes('pares')} onChange={handleAccordionChange('pares')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormControlLabel
              control={
                <Switch
                  checked={usarPares}
                  onChange={(e) => setUsarPares(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label="Filtro por Quantidade de Pares/Ímpares"
              sx={{ mr: 2 }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{xs:12, md:3}}>
                <TextField
                  fullWidth
                  label="Pares Mínimo"
                  type="number"
                  value={filtros.paresMinimo || ''}
                  onChange={(e) => handleFiltroChange('paresMinimo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarPares}
                />
              </Grid>
              <Grid size={{xs:12, md:3}}>
                <TextField
                  fullWidth
                  label="Pares Máximo"
                  type="number"
                  value={filtros.paresMaximo || ''}
                  onChange={(e) => handleFiltroChange('paresMaximo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarPares}
                />
              </Grid>
              <Grid size={{xs:12, md:3}}>
                <TextField
                  fullWidth
                  label="Ímpares Mínimo"
                  type="number"
                  value={filtros.imparesMinimo || ''}
                  onChange={(e) => handleFiltroChange('imparesMinimo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarPares}
                />
              </Grid>
              <Grid size={{xs:12, md:3}}>
                <TextField
                  fullWidth
                  label="Ímpares Máximo"
                  type="number"
                  value={filtros.imparesMaximo || ''}
                  onChange={(e) => handleFiltroChange('imparesMaximo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarPares}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Filtro de Sequências */}
        <Accordion expanded={expandedFilters.includes('sequencias')} onChange={handleAccordionChange('sequencias')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormControlLabel
              control={
                <Switch
                  checked={usarSequencias}
                  onChange={(e) => setUsarSequencias(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label="Filtro por Sequências Consecutivas"
              sx={{ mr: 2 }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Sequência de 2 - Mínimo"
                  type="number"
                  value={filtros.seqDoisMinimo || ''}
                  onChange={(e) => handleFiltroChange('seqDoisMinimo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarSequencias}
                />
              </Grid>
              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Sequência de 2 - Máximo"
                  type="number"
                  value={filtros.seqDoisMaximo || ''}
                  onChange={(e) => handleFiltroChange('seqDoisMaximo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarSequencias}
                />
              </Grid>
              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Sequência de 3 - Mínimo"
                  type="number"
                  value={filtros.seqTresMinimo || ''}
                  onChange={(e) => handleFiltroChange('seqTresMinimo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarSequencias}
                />
              </Grid>
              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Sequência de 3 - Máximo"
                  type="number"
                  value={filtros.seqTresMaximo || ''}
                  onChange={(e) => handleFiltroChange('seqTresMaximo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarSequencias}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Filtro de Pontos */}
        <Accordion expanded={expandedFilters.includes('pontos')} onChange={handleAccordionChange('pontos')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormControlLabel
              control={
                <Switch
                  checked={usarPontos}
                  onChange={(e) => setUsarPontos(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label="Filtro por Pontos em Relação ao Último Sorteio"
              sx={{ mr: 2 }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Pontos Mínimo"
                  type="number"
                  value={filtros.pontosMinimo || ''}
                  onChange={(e) => handleFiltroChange('pontosMinimo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarPontos}
                />
              </Grid>
              <Grid size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Pontos Máximo"
                  type="number"
                  value={filtros.pontosMaximo || ''}
                  onChange={(e) => handleFiltroChange('pontosMaximo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarPontos}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Filtro de Linha/Coluna */}
        <Accordion expanded={expandedFilters.includes('linhacoluna')} onChange={handleAccordionChange('linhacoluna')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormControlLabel
              control={
                <Switch
                  checked={usarLinhaColuna}
                  onChange={(e) => setUsarLinhaColuna(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label="Filtro por Distribuição Linha/Coluna"
              sx={{ mr: 2 }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{xs:12, md:3}}>
                <TextField
                  fullWidth
                  label="Linha Mínimo"
                  type="number"
                  value={filtros.linhaMinimo || ''}
                  onChange={(e) => handleFiltroChange('linhaMinimo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarLinhaColuna}
                />
              </Grid>
              <Grid size={{xs:12, md:3}}>
                <TextField
                  fullWidth
                  label="Linha Máximo"
                  type="number"
                  value={filtros.linhaMaximo || ''}
                  onChange={(e) => handleFiltroChange('linhaMaximo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarLinhaColuna}
                />
              </Grid>
              <Grid size={{xs:12, md:3}}>
                <TextField
                  fullWidth
                  label="Coluna Mínimo"
                  type="number"
                  value={filtros.colunaMinimo || ''}
                  onChange={(e) => handleFiltroChange('colunaMinimo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarLinhaColuna}
                />
              </Grid>
              <Grid size={{xs:12, md:3}}>
                <TextField
                  fullWidth
                  label="Coluna Máximo"
                  type="number"
                  value={filtros.colunaMaximo || ''}
                  onChange={(e) => handleFiltroChange('colunaMaximo', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!usarLinhaColuna}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Filtro de Já Foi Sorteado */}
        <Accordion expanded={expandedFilters.includes('sorteado')} onChange={handleAccordionChange('sorteado')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormControlLabel
              control={
                <Switch
                  checked={usarSorteado}
                  onChange={(e) => setUsarSorteado(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label="Filtro por Resultado Já Sorteado"
              sx={{ mr: 2 }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth disabled={!usarSorteado}>
              <InputLabel>Já foi sorteado?</InputLabel>
              <Select
                value={filtros.jaFoiSorteado !== undefined ? (filtros.jaFoiSorteado ? 'sim' : 'nao') : ''}
                onChange={(e) => {
                  const valor = e.target.value;
                  handleFiltroChange('jaFoiSorteado', valor === 'sim' ? true : valor === 'nao' ? false : undefined);
                }}
              >
                <MenuItem value="">Qualquer</MenuItem>
                <MenuItem value="sim">Sim</MenuItem>
                <MenuItem value="nao">Não</MenuItem>
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Botões de Ação */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={buscarSugestoes}
            disabled={loading}
            size="large"
          >
            Buscar Sugestões
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ClearIcon />}
            onClick={limparFiltros}
            size="large"
          >
            Limpar Filtros
          </Button>
        </Box>
      </Paper>

      {/* Resultados */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && resultados.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resultados Encontrados ({resultados.length})
          </Typography>
          <Grid container spacing={3}>
            {resultados.map((resultado, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sugestão {index + 1}
                    </Typography>
                    {renderNumeros(resultado)}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Soma: {resultado.soma} | Pares: {resultado.pares ?? 0} | Ímpares: {15 - (resultado.pares ?? 0)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Seq2: {resultado.seq_dois} | Seq3: {resultado.seq_tres} | Pontos: {resultado.pontos}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Linha: {resultado.linha} | Coluna: {resultado.coluna} | Sorteado: {resultado.sorteado ? 'Sim' : 'Não'}
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small" 
                      sx={{ mt: 2 }}
                      onClick={() => {
                        const numeros = resultado.sequencia
                          ?.match(/\d{2}/g)
                          ?.map(Number)
                          .sort((a, b) => a - b) || [];
                        navigator.clipboard.writeText(numeros.join(', '));
                      }}
                    >
                      Copiar números
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {!loading && !error && resultados.length === 0 && filtros.somaMinima !== undefined && (
        <Alert severity="info">
          Nenhum resultado encontrado com os filtros aplicados. Tente ajustar os critérios de busca.
        </Alert>
      )}
    </Box>
  );
};

export default SugestoesPersonalizadas;

