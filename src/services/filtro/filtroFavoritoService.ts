import api from "../api"; // seu axios configurado
import { FiltroSugestaoDTO } from "../../dto/sugestao/FiltroSugestaoDTO";

export interface FiltroFavorito {
  id: number;
  nome: string;
  filtrosJson: string;
  createdAt: string;
}

const filtroFavoritoService = {
  salvar: (nome: string, filtros: FiltroSugestaoDTO, usuarioId?: number) =>
    api.post("/filtros-favoritos", filtros, {
      params: { nome, usuarioId },
    }),

  listar: (usuarioId?: number) =>
    api.get<FiltroFavorito[]>("/filtros-favoritos", {
      params: { usuarioId },
    }),

  carregar: (id: number) =>
    api.get<FiltroSugestaoDTO>(`/filtros-favoritos/${id}`),

  excluir: (id: number) => api.delete(`/filtros-favoritos/${id}`),
};

export default filtroFavoritoService;
