import api from '../api';
import { AxiosResponse } from 'axios';

export interface ResultadoImportacao {
  totalProcessados: number;
  importados: number;
  existentes: number;
  concursosImportados: number[];
  concursosExistentes: number[];
}

const importacaoService = {
  importarPlanilha: (file: File): Promise<AxiosResponse<ResultadoImportacao>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/importador/planilha', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default importacaoService;
