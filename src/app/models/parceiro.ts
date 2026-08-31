export interface Parceiro {
  id: string;
  nome: string;
  tipo: string;
  telefone: string | null;
  email: string | null;
  percentualComissao: number;
  criadoEm: string;
  atualizadoEm: string;
}
