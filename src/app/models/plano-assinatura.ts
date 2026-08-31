export interface PlanoAssinatura {
  id: string;
  nome: string;
  descricao: string | null;
  valorMensal: number | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}
