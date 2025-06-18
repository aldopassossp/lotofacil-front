import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import dashboardService from '../services/dashboard/dashboardService';
import { ConcursoSomaDTO } from '../dto/dashboard/ConcursoSomaDTO';
import { ConcursoParesDTO } from '../dto/dashboard/ConcursoParesDTO';
import { ValorContagemDTO } from '../dto/dashboard/ValorContagemDTO';

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [numResultados, setNumResultados] = useState<number>(20); // Default N = 20

    // State for dashboard data
    const [somaData, setSomaData] = useState<ConcursoSomaDTO[]>([]);
    const [paresData, setParesData] = useState<ConcursoParesDTO[]>([]);
    const [frequenciaNumeros, setFrequenciaNumeros] = useState<ValorContagemDTO[]>([]);
    const [contagemSeqDois, setContagemSeqDois] = useState<ValorContagemDTO[]>([]);
    const [contagemSeqTres, setContagemSeqTres] = useState<ValorContagemDTO[]>([]);
    const [contagemSeqQuatro, setContagemSeqQuatro] = useState<ValorContagemDTO[]>([]);
    const [ocorrenciaLinha, setOcorrenciaLinha] = useState<ValorContagemDTO[]>([]);
    const [ocorrenciaColuna, setOcorrenciaColuna] = useState<ValorContagemDTO[]>([]);

    const fetchData = useCallback(async (n: number) => {
        setLoading(true);
        setError(null);
        try {
            const [somaRes, paresRes, freqNumRes, seqDoisRes, seqTresRes, seqQuatroRes, linhaRes, colunaRes] = await Promise.all([
                dashboardService.getSomaUltimosN(n),
                dashboardService.getParesUltimosN(n),
                dashboardService.getFrequenciaNumerosUltimosN(n > 50 ? n : 100), // Use larger N for frequency
                dashboardService.getContagemSequenciaUltimosN('seq_dois', n),
                dashboardService.getContagemSequenciaUltimosN('seq_tres', n),
                dashboardService.getContagemSequenciaUltimosN('seq_quatro', n),
                dashboardService.getOcorrenciaLinhaColunaUltimosN('linha', n),
                dashboardService.getOcorrenciaLinhaColunaUltimosN('coluna', n),
            ]);

            setSomaData(somaRes.sort((a, b) => (a.idSorteados ?? 0) - (b.idSorteados ?? 0))); // Sort for chart
            setParesData(paresRes.sort((a, b) => (a.idSorteados ?? 0) - (b.idSorteados ?? 0))); // Sort for chart
            setFrequenciaNumeros(freqNumRes);
            setContagemSeqDois(seqDoisRes);
            setContagemSeqTres(seqTresRes);
            setContagemSeqQuatro(seqQuatroRes);
            setOcorrenciaLinha(linhaRes);
            setOcorrenciaColuna(colunaRes);

        } catch (err: any) {
            console.error("Erro ao buscar dados do dashboard:", err);
            setError(err.message || 'Erro ao carregar dados do dashboard.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(numResultados);
    }, [fetchData, numResultados]);

    const handleNumResultadosChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value as number;
        setNumResultados(value);
    };

    // Helper to format data for frequency chart
    const formatFrequenciaData = (data: ValorContagemDTO[]) => {
        return data.sort((a, b) => parseInt(a.valor, 10) - parseInt(b.valor, 10)); // Sort by number
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom component="div" sx={{ mb: 3 }}>
                Dashboard de Estatísticas
            </Typography>

            <FormControl sx={{ mb: 3, minWidth: 120 }}>
                <InputLabel id="num-resultados-label">Últimos Resultados</InputLabel>
                <Select
                    labelId="num-resultados-label"
                    id="num-resultados-select"
                    value={numResultados}
                    label="Últimos Resultados"
                    onChange={handleNumResultadosChange}
                    disabled={loading}
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={200}>200</MenuItem>
                </Select>
            </FormControl>

            {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
                <Grid container spacing={3}>
                    {/* Soma Chart */}
                    <Grid size={{xs:12, md:6}}>
                        <Paper sx={{ p: 2, height: 300 }}>
                            <Typography variant="h6" gutterBottom>Soma das Dezenas (Últimos {numResultados})</Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={somaData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <Line type="monotone" dataKey="soma" stroke="#8884d8" strokeWidth={2} dot={false} />
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                    <XAxis dataKey="concurso" fontSize={10} />
                                    <YAxis fontSize={10} />
                                    <Tooltip />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Pares Chart */}
                    <Grid size={{xs:12, md:6}}>
                        <Paper sx={{ p: 2, height: 300 }}>
                            <Typography variant="h6" gutterBottom>Números Pares (Últimos {numResultados})</Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={paresData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <Line type="monotone" dataKey="pares" stroke="#82ca9d" strokeWidth={2} dot={false} />
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                    <XAxis dataKey="concurso" fontSize={10} />
                                    <YAxis fontSize={10} domain={[0, 15]} />
                                    <Tooltip />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Frequencia Numeros Chart */}
                    <Grid size={{xs:12}}>
                        <Paper sx={{ p: 2, height: 400 }}>
                             <Typography variant="h6" gutterBottom>Frequência dos Números (Últimos {numResultados > 50 ? numResultados : 100})</Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={formatFrequenciaData(frequenciaNumeros)} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="valor" angle={-45} textAnchor="end" interval={0} fontSize={10} />
                                    <YAxis fontSize={10} />
                                    <Tooltip />
                                    <Bar dataKey="contagem" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Outras Estatísticas (Sequências, Linha/Coluna) - Exemplo com listas */}
                    <Grid size={{xs:12, md:4}}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Contagem Seq. 2 (Últimos {numResultados})</Typography>
                            {contagemSeqDois.slice(0, 5).map(item => (
                                <Typography key={item.valor} variant="body2">{item.valor}: {item.contagem}</Typography>
                            ))}
                        </Paper>
                    </Grid>
                     <Grid size={{xs:12, md:4}}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Contagem Seq. 3 (Últimos {numResultados})</Typography>
                            {contagemSeqTres.slice(0, 5).map(item => (
                                <Typography key={item.valor} variant="body2">{item.valor}: {item.contagem}</Typography>
                            ))}
                        </Paper>
                    </Grid>
                     <Grid size={{xs:12, md:4}}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Contagem Seq. 4 (Últimos {numResultados})</Typography>
                            {contagemSeqQuatro.slice(0, 5).map(item => (
                                <Typography key={item.valor} variant="body2">{item.valor}: {item.contagem}</Typography>
                            ))}
                        </Paper>
                    </Grid>
                     <Grid size={{xs:12, md:6}}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Top 10 Linhas (Últimos {numResultados})</Typography>
                            {ocorrenciaLinha.slice(0, 10).map(item => (
                                <Typography key={item.valor} variant="body2">{item.valor}: {item.contagem}</Typography>
                            ))}
                        </Paper>
                    </Grid>
                     <Grid size={{xs:12, md:6}}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Top 10 Colunas (Últimos {numResultados})</Typography>
                            {ocorrenciaColuna.slice(0, 10).map(item => (
                                <Typography key={item.valor} variant="body2">{item.valor}: {item.contagem}</Typography>
                            ))}
                        </Paper>
                    </Grid>

                </Grid>
            )}
        </Box>
    );
};

// Removido o mock do dashboardService e as interfaces de placeholder, pois agora estamos usando os arquivos reais


export default Dashboard;

