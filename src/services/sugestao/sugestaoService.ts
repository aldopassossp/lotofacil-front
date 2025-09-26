
import api from '../api'; // ajuste o caminho se necessário
import { FiltroSugestaoDTO } from '../../dto/sugestao/FiltroSugestaoDTO';

interface HistoricoItem {
  id: number;
  numeros: string;
  tipo: string;
  dataCriacao: string;
}

const sugestaoService = {
  buscarSugestoesPersonalizadas: (filtros: FiltroSugestaoDTO) =>
    api.post('/sugestoes/personalizadas', filtros),

  // 🔹 Novo método para gerar combinações
  gerarCombinacoes: (payload: { filtros: FiltroSugestaoDTO; quantidade: number; tipo: string }) =>
    api.post('/sugestoes/gerar-combinacoes', payload),

  salvarSugestoes(sugestoes: { numeros: string; tipo: string }[]) {
    return api.post('/sugestoes/salvar-sugestoes', sugestoes);
  },

  // 🔹 Métodos para histórico de sugestões
  getHistorico: async (): Promise<HistoricoItem[]> => {
    const response = await api.get('/sugestoes/historico');
    return response.data;
  },

  excluirHistorico: async (id: number): Promise<void> => {
    await api.delete(`/sugestoes/historico/${id}`);
  },

  limparHistorico: async (): Promise<void> => {
    await api.delete('/sugestoes/historico');
  },

  exportarHistorico: async (): Promise<Blob> => {
    const response = await api.get('/sugestoes/historico/exportar', {
      responseType: 'blob'
    });
    return response.data;
  }

};

export default sugestaoService;


