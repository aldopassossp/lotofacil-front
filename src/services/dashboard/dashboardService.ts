import api from '../api';
import { ConcursoSomaDTO } from '../../dto/dashboard/ConcursoSomaDTO';
import { ConcursoParesDTO } from '../../dto/dashboard/ConcursoParesDTO';
import { ValorContagemDTO } from '../../dto/dashboard/ValorContagemDTO';

const dashboardService = {
    getSomaUltimosN: async (n: number): Promise<ConcursoSomaDTO[]> => {
        const response = await api.get(`/dashboard/soma?n=${n}`);
        return response.data;
    },
    
    getParesUltimosN: async (n: number): Promise<ConcursoParesDTO[]> => {
        const response = await api.get(`/dashboard/pares?n=${n}`);
        return response.data;
    },
    
    getFrequenciaNumerosUltimosN: async (n: number): Promise<ValorContagemDTO[]> => {
        const response = await api.get(`/dashboard/frequencia-numeros?n=${n}`);
        return response.data;
    },
    
    getContagemSequenciaUltimosN: async (tipo: string, n: number): Promise<ValorContagemDTO[]> => {
        const response = await api.get(`/dashboard/contagem-sequencia/${tipo}?n=${n}`);
        return response.data;
    },
    
    getOcorrenciaLinhaColunaUltimosN: async (tipo: string, n: number): Promise<ValorContagemDTO[]> => {
        const response = await api.get(`/dashboard/ocorrencia-linha-coluna/${tipo}?n=${n}`);
        return response.data;
    },
};

export default dashboardService;
