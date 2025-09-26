// src/services/sugestao/historicoService.ts
import axios from "axios";

const API_BASE = "http://localhost:8080/api/historico";

export interface HistoricoSugestao {
  id: number;
  numeros: string;
  tipo: string;
  acertos: number;
  dataCriacao: string;
}

/**
 * Retorna Page<HistoricoSugestao> (Spring Data Page)
 * Ex.: GET /api/historico?page=0&size=5&sort=dataCriacao,desc
 */
const listarHistorico = (page = 0, size = 5) => {
  return axios.get(`${API_BASE}`, {
    params: { page, size, sort: "dataCriacao,desc" },
  });
};

/**
 * Retorna List<HistoricoSugestao> (todos os registros) - usado para exportar tudo
 * GET /api/historico/todos
 */
const listarTudo = () => {
  return axios.get<HistoricoSugestao[]>(`${API_BASE}/todos`);
};

const limparHistorico = () => {
  return axios.delete(`${API_BASE}/limpar`);
};

const excluirRegistro = (id: number) => {
  return axios.delete(`${API_BASE}/${id}`);
};

export default {
  listarHistorico,
  listarTudo,
  limparHistorico,
  excluirRegistro,
};
