export interface Servico {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}
