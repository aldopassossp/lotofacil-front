import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Alert, CircularProgress, Checkbox, FormControlLabel, FormGroup, Container } from '@mui/material';

const EntradaManual: React.FC = () => {
    const [concurso, setConcurso] = useState<string>('');
    const [dataSorteio, setDataSorteio] = useState<string>(''); // Use appropriate date format/picker later
    const [numerosSelecionados, setNumerosSelecionados] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleNumeroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numero = parseInt(event.target.value, 10);
        const isChecked = event.target.checked;
        const novosNumeros = new Set(numerosSelecionados);

        if (isChecked) {
            if (novosNumeros.size < 15) {
                novosNumeros.add(numero);
            } else {
                // Optionally provide feedback that max numbers reached
                event.target.checked = false; // Prevent checking more than 15
                return;
            }
        } else {
            novosNumeros.delete(numero);
        }
        setNumerosSelecionados(novosNumeros);
        setError(null); // Clear error on interaction
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (numerosSelecionados.size !== 15) {
            setError('Selecione exatamente 15 números.');
            return;
        }
        if (!concurso || isNaN(parseInt(concurso, 10))) {
            setError('Número do concurso inválido.');
            return;
        }
        if (!dataSorteio) { // Add more robust date validation later
            setError('Data do sorteio é obrigatória.');
            return;
        }

        const dto: ResultadoManualDTO = {
            concurso: parseInt(concurso, 10),
            dataSorteio: dataSorteio, // Ensure format matches backend expectation (e.g., dd/MM/yyyy)
            numeros: Array.from(numerosSelecionados).sort((a, b) => a - b)
        };

        setLoading(true);
        try {
            await resultadoService.adicionarResultadoManual(dto);
            setSuccess(`Resultado do concurso ${concurso} adicionado com sucesso!`);
            // Clear form
            setConcurso('');
            setDataSorteio('');
            setNumerosSelecionados(new Set());
        } catch (err: any) {
            logError(err);
        } finally {
            setLoading(false);
        }
    };

    const logError = (err: any) => {
         if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
        } else if (err.message) {
            setError(err.message);
        } else {
            setError('Erro ao adicionar resultado. Verifique a conexão com o backend.');
        }
        console.error("Erro ao adicionar resultado manual:", err);
    }

    const renderCheckboxes = () => {
        const checkboxes = [];
        for (let i = 1; i <= 25; i++) {
            checkboxes.push(
                <Grid size={2.4} key={i}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                value={i}
                                checked={numerosSelecionados.has(i)}
                                onChange={handleNumeroChange}
                                disabled={numerosSelecionados.size >= 15 && !numerosSelecionados.has(i)}
                            />
                        }
                        label={String(i).padStart(2, '0')}
                    />
                </Grid>
            );
        }
        return checkboxes;
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Entrada Manual de Resultado
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{xs:12, sm:6}}>
                            <TextField
                                label="Número do Concurso"
                                type="number"
                                value={concurso}
                                onChange={(e) => setConcurso(e.target.value)}
                                fullWidth
                                required
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                        </Grid>
                        <Grid size={{xs:12, sm:6}}>
                            <TextField
                                label="Data do Sorteio (dd/MM/yyyy)"
                                type="text" // Consider using a DatePicker component
                                value={dataSorteio}
                                onChange={(e) => setDataSorteio(e.target.value)}
                                fullWidth
                                required
                                placeholder="dd/MM/yyyy"
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant="h6" gutterBottom>
                                Selecione os 15 números sorteados:
                            </Typography>
                            <FormGroup>
                                <Grid container spacing={1}>
                                    {renderCheckboxes()}
                                </Grid>
                            </FormGroup>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Selecionados: {numerosSelecionados.size} / 15
                            </Typography>
                        </Grid>
                        <Grid size={{xs:12, sm:6}}>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading || numerosSelecionados.size !== 15}
                                fullWidth
                            >
                                {loading ? <CircularProgress size={24} /> : 'Adicionar Resultado'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

// Need to define the DTO type or import it
interface ResultadoManualDTO {
    concurso: number;
    dataSorteio: string;
    numeros: number[];
}

// Need to define the service or import it
const resultadoService = {
    adicionarResultadoManual: async (dto: ResultadoManualDTO): Promise<any> => {
        // Replace with actual API call using axios
        console.log("Chamando API para adicionar resultado:", dto);
        const api = (await import('../services/api')).default; // Lazy import api
        return api.post('/resultados/manual', dto);
    }
};

export default EntradaManual;

