export interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  precoVenda: number | null;
  custoBase: number | null;
  ativo: boolean;
  fotoUrl: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
