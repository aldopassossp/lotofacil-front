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
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Slider,
  Switch,
  OutlinedInput
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { FiltroSugestaoDTO } from '../dto/sugestao/FiltroSugestaoDTO';
import dashboardService from '../services/dashboard/dashboardService';
import sugestaoService from '../services/sugestao/sugestaoService';
import { Todos } from '../entity/Todos';

const SugestoesPersonalizadas: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltroSugestaoDTO>({
    pontosMinimo: undefined,
    pontosMaximo: undefined,
    somaMinima: undefined,
    somaMaxima: undefined,
    paresMinimo: undefined,
    paresMaximo: undefined,
    seqDoisMinimo: undefined,
    seqDoisMaximo: undefined,
    seqTresMinimo: undefined,
    seqTresMaximo: undefined,
    jaFoiSorteado: undefined,
    numerosObrigatorios: [],
    numerosProibidos: [],
    linhas: [],
    colunas: [],
    linhasSelecionadas: [],
    colunasSelecionadas: []
  });

  const [linhasDisponiveis, setLinhasDisponiveis] = useState<string[]>([]);
  const [colunasDisponiveis, setColunasDisponiveis] = useState<string[]>([]);
  const [resultados, setResultados] = useState<Todos[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["basicos"]);

  useEffect(() => {
  const carregarDados = async () => {
    try {
      const [linhasResp, colunasResp] = await Promise.all([
        dashboardService.getOcorrenciaTodasLinhas(),
        dashboardService.getOcorrenciaTodasColunas(),
      ]);

      // Normaliza: transforma qualquer formato em string[]
      const extrairRotulos = (resp: any): string[] => {
        const data = resp?.data ?? resp;          // depende do seu service/axios
        if (!Array.isArray(data)) return [];
        return data.map((item: any) => {
          if (typeof item === 'string') return item;
          if (typeof item === 'number') return String(item);
          if (item?.valor != null) return String(item.valor);
          if (item?.linha != null) return String(item.linha);
          if (item?.coluna != null) return String(item.coluna);
          return String(item); // fallback
        });
      };

      setLinhasDisponiveis(extrairRotulos(linhasResp));
      setColunasDisponiveis(extrairRotulos(colunasResp));
    } catch (error) {
      console.error("Erro ao carregar linhas/colunas", error);
    }
    };

    carregarDados();
  }, []);


  // Estados para controle de filtros avançados
  const [usarSoma, setUsarSoma] = useState(false);
  const [usarPares, setUsarPares] = useState(false);
  const [usarSequencias, setUsarSequencias] = useState(false);
  const [usarPontos, setUsarPontos] = useState(false);
  const [usarLinhaColuna, setUsarLinhaColuna] = useState(false);
  const [usarSorteado, setUsarSorteado] = useState(false);
  const [usarNumerosEspecificos, setUsarNumerosEspecificos] = useState(false);
  const [naoUsarNumerosEspecificos, setNaoUsarNumerosEspecificos] = useState(false);

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
      seqDoisMinimo: undefined,
      seqDoisMaximo: undefined,
      seqTresMinimo: undefined,
      seqTresMaximo: undefined,
      pontosMinimo: undefined,
      pontosMaximo: undefined,
      jaFoiSorteado: undefined,
      numerosObrigatorios: [],
      numerosProibidos: [],
      linhasSelecionadas: [],
      colunasSelecionadas: []
    });
    
    setUsarSoma(false);
    setUsarPares(false);
    setUsarSequencias(false);
    setUsarPontos(false);
    setUsarLinhaColuna(false);
    setUsarSorteado(false);
    setUsarNumerosEspecificos(false);
    setNaoUsarNumerosEspecificos(false);
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

{/* Escolha de números obrigatórios */}
<Accordion expanded={expandedFilters.includes('numerosObrigatorios')} onChange={handleAccordionChange('numerosObrigatorios')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <FormControlLabel
      control={
        <Switch
          checked={usarNumerosEspecificos}
          onChange={(e) => setUsarNumerosEspecificos(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      }
      label="Números Obrigatórios"
      sx={{ mr: 2 }}
    />
  </AccordionSummary>
  <AccordionDetails>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: 1 }}>
      {Array.from({ length: 25 }, (_, i) => i + 1).map(numero => (
        <Chip
          key={numero}
          label={numero}
          color={filtros.numerosObrigatorios.includes(numero) ? "primary" : "default"}
          onClick={() => {
            setFiltros(prev => {
              const selecionados = prev.numerosObrigatorios;
              return {
                ...prev,
                numerosObrigatorios: selecionados.includes(numero)
                  ? selecionados.filter(n => n !== numero)
                  : [...selecionados, numero]
              };
            });
          }}
          sx={{
            borderRadius: '50%',
            width: 38,
            height: 38,
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}
        />
      ))}
    </Box>
  </AccordionDetails>
</Accordion>

{/* Escolha de números proibidos */}
<Accordion expanded={expandedFilters.includes('numerosProibidos')} onChange={handleAccordionChange('numerosProibidos')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <FormControlLabel
      control={
        <Switch
          checked={naoUsarNumerosEspecificos}
          onChange={(e) => setNaoUsarNumerosEspecificos(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      }
      label="Números Proibidos"
      sx={{ mr: 2 }}
    />
  </AccordionSummary>
  <AccordionDetails>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: 1 }}>
      {Array.from({ length: 25 }, (_, i) => i + 1).map(numero => (
        <Chip
          key={numero}
          label={numero}
          color={filtros.numerosProibidos.includes(numero) ? "primary" : "default"}
          onClick={() => {
            setFiltros(prev => {
              const selecionados = prev.numerosProibidos;
              return {
                ...prev,
                numerosProibidos: selecionados.includes(numero)
                  ? selecionados.filter(n => n !== numero)
                  : [...selecionados, numero]
              };
            });
          }}
          sx={{
            borderRadius: '50%',
            width: 38,
            height: 38,
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}
        />
      ))}
    </Box>
  </AccordionDetails>
</Accordion>

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
<Accordion
  expanded={expandedFilters.includes("linhacoluna")}
  onChange={handleAccordionChange("linhacoluna")}
>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <FormControlLabel
      control={
        <Switch
          checked={usarLinhaColuna}
          onChange={(e) => setUsarLinhaColuna(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      }
      label="Linhas e Colunas que não devem existir"
      sx={{ mr: 2 }}
    />
  </AccordionSummary>
  <AccordionDetails>
    <Grid container spacing={2}>
      {/* Select de Linhas */}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth disabled={!usarLinhaColuna}>
          <Select
            multiple
            displayEmpty
            value={filtros.linhasSelecionadas ?? []}
            onChange={(e) =>
              setFiltros((prev) => ({
                ...prev,
                linhasSelecionadas:
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value,
              }))
            }
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if ((selected as string[]).length === 0) {
                return <em>Selecione linhas</em>;
              }
              return (selected as string[]).join(", ");
            }}
          >
            <MenuItem disabled value="">
              <em>Selecione linhas</em>
            </MenuItem>
            {linhasDisponiveis.map((linha) => (
              <MenuItem key={linha} value={linha}>
                {linha}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Select de Colunas */}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth disabled={!usarLinhaColuna}>
          <Select
            multiple
            displayEmpty
            value={filtros.colunasSelecionadas ?? []}
            onChange={(e) =>
              setFiltros((prev) => ({
                ...prev,
                colunasSelecionadas:
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value,
              }))
            }
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if ((selected as string[]).length === 0) {
                return <em>Selecione colunas</em>;
              }
              return (selected as string[]).join(", ");
            }}
          >
            <MenuItem disabled value="">
              <em>Selecione colunas</em>
            </MenuItem>
            {colunasDisponiveis.map((coluna) => (
              <MenuItem key={coluna} value={coluna}>
                {coluna}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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