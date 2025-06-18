import api from '../api';
import { FiltroSugestaoDTO } from '../../dto/sugestao/FiltroSugestaoDTO';
import { Page } from '../../dto/Page';
import { Todos } from '../../entity/Todos';

const sugestaoService = {
    buscarSugestoesPersonalizadas: async (filtros: FiltroSugestaoDTO): Promise<Page<Todos>> => {
        const response = await api.post('/sugestoes/personalizadas', filtros);
        return response.data;
    }
};

export default sugestaoService;
