export interface CreateServicoRequest {
  nome: string;
  descricao?: string | null;
  preco?: number | null;
  ativo: boolean;
}
