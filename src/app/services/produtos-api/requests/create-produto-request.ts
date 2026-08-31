export interface CreateProdutoRequest {
  nome: string;
  descricao?: string | null;
  precoVenda?: number | null;
  custoBase?: number | null;
  ativo: boolean;
}
