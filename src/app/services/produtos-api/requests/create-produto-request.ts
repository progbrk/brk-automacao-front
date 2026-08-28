export interface CreateProdutoRequest {
  nome: string;
  descricao?: string | null;
  tipo: string;
  precoVenda?: number | null;
  custoBase?: number | null;
  ativo: boolean;
}
