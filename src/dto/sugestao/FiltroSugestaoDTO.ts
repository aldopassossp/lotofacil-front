export interface FiltroSugestaoDTO {
    // Faixas numéricas (min/max)
    pontosMinimo?: number;
    pontosMaximo?: number;

    somaMinima?: number;
    somaMaxima?: number;

    paresMinimo?: number;
    paresMaximo?: number;
    
    imparesMinimo?: number;
    imparesMaximo?: number;

    seqDoisMinimo?: number;
    seqDoisMaximo?: number;

    seqTresMinimo?: number;
    seqTresMaximo?: number;

    seqQuatroMinimo?: number;
    seqQuatroMaximo?: number;
    
    seqCincoMinimo?: number;
    seqCincoMaximo?: number;
    
    seqSeisMinimo?: number;
    seqSeisMaximo?: number;
    
    seqSeteMinimo?: number;
    seqSeteMaximo?: number;
    
    seqOitoMinimo?: number;
    seqOitoMaximo?: number;

    linhaMinimo?: number;
    linhaMaximo?: number;

    colunaMinimo?: number;
    colunaMaximo?: number;

    jaFoiSorteado?: number;

    numerosObrigatorios: [];
    numerosProibidos: [];

    // Listas de valores exatos
    linhas?: string[]; // Lista de padrões de linha (ex: "55500")
    colunas?: string[]; // Lista de padrões de coluna (ex: "33333")

    // Outros filtros possíveis
    naoIncluirSorteadosAnteriormente?: boolean; // Flag para excluir combinações já sorteadas (todos.sorteado = 0)

    // Paginação e Limite
    page?: number; // Número da página (default 0)
    size?: number; // Tamanho da página (default 20)
}
