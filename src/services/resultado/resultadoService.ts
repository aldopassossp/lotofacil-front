import api from '../api';
import { AxiosResponse } from 'axios';
import { ResultadoManualDTO } from '../../dto/ResultadoManualDTO'; // Adjust path as needed

// Define the expected response type if the backend returns the saved entity
interface SorteadosResponse { 
    // Define fields based on Sorteados entity if needed, e.g.:
    id: number;
    concurso: number;
    sorteio: string;
    // ... other fields
}

const resultadoService = {
    adicionarResultadoManual: (dto: ResultadoManualDTO): Promise<AxiosResponse<SorteadosResponse>> => {
        return api.post<SorteadosResponse>('/resultados/manual', dto);
    }
};

export default resultadoService;

