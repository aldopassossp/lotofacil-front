import React, { useState } from 'react';
import { Typography, Box, Button, Paper, CircularProgress, Alert, AlertTitle, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import importacaoService, { ResultadoImportacao } from '../services/importacao/importacaoService';

const Importacao: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoImportacao | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo para importar.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await importacaoService.importarPlanilha(file);
      setResultado(response.data);
    } catch (err: any) {
      setError(err.response?.data?.erro || 'Erro ao importar planilha. Verifique se o backend está em execução.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Importação de Resultados
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Selecione a planilha com os resultados da Lotofácil
        </Typography>
        
        <Typography variant="body1" paragraph>
          Importe uma planilha Excel (.xlsx) contendo os resultados dos sorteios da Lotofácil.
          O sistema irá processar os dados e evitar duplicações de concursos já existentes.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
          <input
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            id="upload-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-file">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Selecionar Arquivo
            </Button>
          </label>
          
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Arquivo selecionado: {file.name}
            </Typography>
          )}
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Importando...' : 'Importar Resultados'}
          </Button>
          
          {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>Erro</AlertTitle>
            {error}
          </Alert>
        )}

        {resultado && (
          <Box sx={{ mt: 3 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Importação concluída com sucesso!</AlertTitle>
              <Typography variant="body2">
                Total de concursos processados: {resultado.totalProcessados}
              </Typography>
              <Typography variant="body2">
                Concursos importados: {resultado.importados}
              </Typography>
              <Typography variant="body2">
                Concursos já existentes: {resultado.existentes}
              </Typography>
            </Alert>

            {resultado.concursosImportados.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Concursos importados:
                </Typography>
                <Grid container spacing={1}>
                  {resultado.concursosImportados.map((concurso) => (
                    <Grid key={concurso}>
                      <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                        {concurso}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {resultado.concursosExistentes.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Concursos já existentes (não importados):
                </Typography>
                <Grid container spacing={1}>
                  {resultado.concursosExistentes.map((concurso) => (
                    <Grid key={concurso}>
                      <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#fff3e0' }}>
                        {concurso}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Importacao;
