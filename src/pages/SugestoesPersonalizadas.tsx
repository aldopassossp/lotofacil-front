import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Slider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Pagination
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FiltroSugestaoDTO } from '../dto/sugestao/FiltroSugestaoDTO';
import sugestaoService from '../services/sugestao/sugestaoService';
import { Todos } from '../entity/Todos';
import { Page } from '../dto/Page';

const SugestoesPersonalizadas: React.FC = () => {
    const [filtros, setFiltros] = useState<Partial<FiltroSugestaoDTO>>({ page: 0, size: 20 });
    const [sugestoes, setSugestoes] = useState<Todos[]>([]);
    const [totalPaginas, setTotalPaginas] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        // Handle numeric inputs, allowing empty string
        const numericFields = ['pontosMin', 'pontosMax', 'somaMin', 'somaMax', 'imparesMin', 'imparesMax', 
                               'seqDoisMin', 'seqDoisMax', 'seqTresMin', 'seqTresMax', 'seqQuatroMin', 'seqQuatroMax',
                               'seqCincoMin', 'seqCincoMax', 'seqSeisMin', 'seqSeisMax', 'seqSeteMin', 'seqSeteMax',
                               'seqOitoMin', 'seqOitoMax'];
        setFiltros(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? (value === '' ? undefined : Number(value)) : value
        }));
    };
    
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setFiltros(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setFiltros(prev => ({ ...prev, page: value - 1 })); // Pagination is 1-based, API is 0-based
        buscarSugestoes(value - 1);
    };

    const buscarSugestoes = async (page = 0) => {
        setLoading(true);
        setError(null);
        setSugestoes([]);
        setTotalPaginas(0);

        const filtrosParaApi: FiltroSugestaoDTO = {
            ...filtros,
            page: page,
            size: filtros.size || 20,
            // Ensure numeric fields are numbers or undefined
            pontosMin: filtros.pontosMin,
            pontosMax: filtros.pontosMax,
            somaMin: filtros.somaMin,
            somaMax: filtros.somaMax,
            paresMin: filtros.paresMin,
            paresMax: filtros.paresMax,
            seqDoisMin: filtros.seqDoisMin,
            seqDoisMax: filtros.seqDoisMax,
            seqTresMin: filtros.seqTresMin,
            seqTresMax: filtros.seqTresMax,
            seqQuatroMin: filtros.seqQuatroMin,
            seqQuatroMax: filtros.seqQuatroMax,
            seqCincoMin: filtros.seqCincoMin,
            seqCincoMax: filtros.seqCincoMax,
            seqSeisMin: filtros.seqSeisMin,
            seqSeisMax: filtros.seqSeisMax,
            seqSeteMin: filtros.seqSeteMin,
            seqSeteMax: filtros.seqSeteMax,
            seqOitoMin: filtros.seqOitoMin,
            seqOitoMax: filtros.seqOitoMax,
            // Handle lists later if needed
            linhas: filtros.linhas,
            colunas: filtros.colunas,
            naoIncluirSorteadosAnteriormente: filtros.naoIncluirSorteadosAnteriormente
        };

        try {
            const response = await sugestaoService.buscarSugestoesPersonalizadas(filtrosParaApi);
            setSugestoes(response.content);
            setTotalPaginas(response.totalPages);
        } catch (err: any) {
            console.error("Erro ao buscar sugestões:", err);
            setError(err.response?.data?.message || err.message || 'Erro ao buscar sugestões.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFiltros(prev => ({ ...prev, page: 0 })); // Reset page on new search
        buscarSugestoes(0);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom component="div" sx={{ mb: 3 }}>
                Sugestões Personalizadas
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Basic Filters */}
                        <Grid size={{xs:12, md:6}}>
                            <TextField label="Pontos Mín." name="pontosMin" type="number" value={filtros.pontosMin ?? ''} onChange={handleInputChange} fullWidth size="small" InputProps={{ inputProps: { min: 0, max: 15 } }}/>
                        </Grid>
                        <Grid size={{xs:12, md:6}}>
                            <TextField label="Pontos Máx." name="pontosMax" type="number" value={filtros.pontosMax ?? ''} onChange={handleInputChange} fullWidth size="small" InputProps={{ inputProps: { min: 0, max: 15 } }}/>
                        </Grid>
                        <Grid size={{xs:12, md:6}}>
                            <TextField label="Soma Mín." name="somaMin" type="number" value={filtros.somaMin ?? ''} onChange={handleInputChange} fullWidth size="small" />
                        </Grid>
                        <Grid size={{xs:12, md:6}}>
                            <TextField label="Soma Máx." name="somaMax" type="number" value={filtros.somaMax ?? ''} onChange={handleInputChange} fullWidth size="small" />
                        </Grid>
                        <Grid size={{xs:12, md:6}}>
                            <TextField label="Ímpares Mín." name="imparesMin" type="number" value={filtros.paresMin ?? ''} onChange={handleInputChange} fullWidth size="small" InputProps={{ inputProps: { min: 0, max: 15 } }}/>
                        </Grid>
                        <Grid size={{xs:12, md:6}}>
                            <TextField label="Ímpares Máx." name="imparesMax" type="number" value={filtros.paresMax ?? ''} onChange={handleInputChange} fullWidth size="small" InputProps={{ inputProps: { min: 0, max: 15 } }}/>
                        </Grid>

                        {/* Advanced Filters in Accordion */}
                        <Grid size={{xs:12}}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Filtros Avançados (Sequências, Linha/Coluna)</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        {/* Add inputs for seq_dois, seq_tres, etc. */}
                                        <Grid size={{xs:6, sm:3}}><TextField label="Seq 2 Mín" name="seqDoisMin" type="number" value={filtros.seqDoisMin ?? ''} onChange={handleInputChange} fullWidth size="small" /></Grid>
                                        <Grid size={{xs:6, sm:3}}><TextField label="Seq 2 Máx" name="seqDoisMax" type="number" value={filtros.seqDoisMax ?? ''} onChange={handleInputChange} fullWidth size="small" /></Grid>
                                        <Grid size={{xs:6, sm:3}}><TextField label="Seq 3 Mín" name="seqTresMin" type="number" value={filtros.seqTresMin ?? ''} onChange={handleInputChange} fullWidth size="small" /></Grid>
                                        <Grid size={{xs:6, sm:3}}><TextField label="Seq 3 Máx" name="seqTresMax" type="number" value={filtros.seqTresMax ?? ''} onChange={handleInputChange} fullWidth size="small" /></Grid>
                                        {/* ... add other sequence inputs ... */}
                                        <Grid size={{xs:12, sm:6}}><TextField label="Linhas (separadas por vírgula)" name="linhas" value={filtros.linhas?.join(',') ?? ''} onChange={(e) => setFiltros(prev => ({...prev, linhas: e.target.value ? e.target.value.split(',') : undefined}))} fullWidth size="small" /></Grid>
                                        <Grid size={{xs:12, sm:6}}><TextField label="Colunas (separadas por vírgula)" name="colunas" value={filtros.colunas?.join(',') ?? ''} onChange={(e) => setFiltros(prev => ({...prev, colunas: e.target.value ? e.target.value.split(',') : undefined}))} fullWidth size="small" /></Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        
                        <Grid size={{xs:12}}>
                             <FormControlLabel
                                control={<Checkbox checked={filtros.naoIncluirSorteadosAnteriormente ?? false} onChange={handleCheckboxChange} name="naoIncluirSorteadosAnteriormente" />}
                                label="Excluir combinações já sorteadas"
                            />
                        </Grid>

                        <Grid size={{xs:12}}>
                            <Button type="submit" variant="contained" disabled={loading} fullWidth>
                                {loading ? <CircularProgress size={24} /> : 'Buscar Sugestões'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Results Area */}
            {!loading && sugestoes.length > 0 && (
                <Paper sx={{ p: 2, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Resultados ({sugestoes.length} nesta página)</Typography>
                    {/* Display suggestions - improve formatting later */}
                    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {sugestoes.map(sug => (
                            <Typography key={sug.idTodos} variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                                {sug.sequencia} (Soma: {sug.soma}, Pares: {sug.pares}, Pts: {sug.pontos ?? 'N/A'})
                            </Typography>
                        ))}
                    </Box>
                    {totalPaginas > 1 && (
                        <Pagination 
                            count={totalPaginas} 
                            page={filtros.page ? filtros.page + 1 : 1} 
                            onChange={handlePageChange} 
                            color="primary" 
                            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }} 
                        />
                    )}
                </Paper>
            )}
            {!loading && sugestoes.length === 0 && !error && (
                 <Typography sx={{ mt: 2 }}>Nenhuma sugestão encontrada com os filtros aplicados.</Typography>
            )}
        </Box>
    );
};

// Removido os mocks e placeholders, pois agora estamos usando os arquivos reais

export default SugestoesPersonalizadas;

