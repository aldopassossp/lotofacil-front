import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'up' | 'down'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/health');
        if (response.data.status === 'UP') {
          setStatus('up');
          setMessage(response.data.message);
        } else {
          setStatus('down');
          setMessage('Backend está respondendo, mas com status inesperado');
        }
      } catch (error) {
        setStatus('down');
        setMessage('Não foi possível conectar ao backend. Verifique se o servidor está em execução.');
      }
    };

    checkBackendHealth();
  }, []);

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {status === 'loading' && <CircularProgress size={20} />}
      {status === 'up' && (
        <Alert severity="success" variant="outlined" sx={{ py: 0 }}>
          <Typography variant="caption">Backend conectado</Typography>
        </Alert>
      )}
      {status === 'down' && (
        <Alert severity="error" variant="outlined" sx={{ py: 0 }}>
          <Typography variant="caption">{message}</Typography>
        </Alert>
      )}
    </Box>
  );
};

export default HealthCheck;
