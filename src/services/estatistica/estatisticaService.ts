import api from '../api';
import { AxiosResponse } from 'axios';

export interface FrequenciaNumero {
  numero: number;
  frequencia: number;
  percentual: number;
}

export interface AtrasoNumero {
  numero: number;
  concursosAtraso: number;
  ultimoSorteio: string;
}

export interface Distribuicao {
  pares: number;
  impares: number;
  primos: number;
  naoprimos: number;
  soma: number;
  distribuicaoLinhas: string;
  distribuicaoColunas: string;
}

export interface Padrao {
  tipo: string;
  valor: string;
  frequencia: number;
  percentual: number;
}

export interface Estatistica {
  frequenciaNumeros: FrequenciaNumero[];
  atrasoNumeros: AtrasoNumero[];
  distribuicao: Distribuicao;
  padroes: Padrao[];
}

export interface Sugestao {
  quantidadeNumeros: number;
  numeros: number[];
  garantia: string;
  probabilidade: number;
}

const estatisticaService = {
  obterEstatisticas: (): Promise<AxiosResponse<Estatistica>> => {
    return api.get('/estatisticas');
  },
  
  obterSugestoesFechamento17: (): Promise<AxiosResponse<Sugestao[]>> => {
    return api.get('/estatisticas/sugestoes/fechamento17');
  },
  
  obterSugestoesFechamento16: (): Promise<AxiosResponse<Sugestao[]>> => {
    return api.get('/estatisticas/sugestoes/fechamento16');
  },
  
  obterSugestoesFechamento15: (): Promise<AxiosResponse<Sugestao[]>> => {
    return api.get('/estatisticas/sugestoes/fechamento15');
  }
};

export default estatisticaService;
