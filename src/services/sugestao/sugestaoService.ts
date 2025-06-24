
import api from '../api';
import { FiltroSugestaoDTO } from '../../dto/sugestao/FiltroSugestaoDTO';

const sugestaoService = {
  buscarSugestoesPersonalizadas: async (filtros: FiltroSugestaoDTO) => {
    return await api.post('/sugestoes/personalizadas', filtros);
  }
};

export default sugestaoService;

