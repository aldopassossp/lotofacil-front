import api from '../api';
import { ConcursoSomaDTO } from '../../dto/dashboard/ConcursoSomaDTO';
import { ConcursoParesDTO } from '../../dto/dashboard/ConcursoParesDTO';
import { ValorContagemDTO } from '../../dto/dashboard/ValorContagemDTO';
import { ContagemLinhaDTO } from '../../dto/dashboard/ContagemLinhaDTO';
import { AtrasoNumeroDTO } from '../../dto/dashboard/AtrasoNumeroDTO';

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
    
    getContagemSequenciaDoisUltimosN: async (n: number): Promise<ValorContagemDTO[]> => {
        const response = await api.get(`/dashboard/contagem-sequencia-dois/${n}`);
        return response.data;
    },

    getContagemSequenciaTresUltimosN: async (n: number): Promise<ValorContagemDTO[]> => {
        const response = await api.get(`/dashboard/contagem-sequencia-tres/${n}`);
        return response.data;
    },

    getContagemSequenciaQuatroUltimosN: async (n: number): Promise<ValorContagemDTO[]> => {
        const response = await api.get(`/dashboard/contagem-sequencia-quatro/${n}`);
        return response.data;
    },
    
    getOcorrenciaLinhaUltimosN: async (n: number): Promise<ContagemLinhaDTO[]> => {
        const response = await api.get(`/dashboard/ocorrencias-linha/${n}`);
        return response.data;
    },

    getOcorrenciaColunaUltimosN: async (n: number): Promise<ContagemLinhaDTO[]> => {
        const response = await api.get(`/dashboard/ocorrencias-coluna/${n}`);
        return response.data;
    },

    getUltimosAtrasos: async (n: number): Promise<AtrasoNumeroDTO[]> => {
        const response = await api.get(`/dashboard/atraso/`);
        return response.data;
    },
};

export default dashboardService;
