export interface FiltroSugestaoDTO {
    // Faixas numéricas (min/max)
    pontosMin?: number;
    pontosMax?: number;

    somaMin?: number;
    somaMax?: number;

    paresMin?: number;
    paresMax?: number;

    seqDoisMin?: number;
    seqDoisMax?: number;

    seqTresMin?: number;
    seqTresMax?: number;

    seqQuatroMin?: number;
    seqQuatroMax?: number;
    
    seqCincoMin?: number;
    seqCincoMax?: number;
    
    seqSeisMin?: number;
    seqSeisMax?: number;
    
    seqSeteMin?: number;
    seqSeteMax?: number;
    
    seqOitoMin?: number;
    seqOitoMax?: number;

    // Listas de valores exatos
    linhas?: string[]; // Lista de padrões de linha (ex: "55500")
    colunas?: string[]; // Lista de padrões de coluna (ex: "33333")

    // Outros filtros possíveis
    naoIncluirSorteadosAnteriormente?: boolean; // Flag para excluir combinações já sorteadas (todos.sorteado = 0)

    // Paginação e Limite
    page?: number; // Número da página (default 0)
    size?: number; // Tamanho da página (default 20)
}
