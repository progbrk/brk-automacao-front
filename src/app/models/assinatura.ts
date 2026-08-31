export interface Assinatura {
  id: string;
  clienteId: string;
  vendaId: string | null;
  planoId: string;
  valorMensal: number;
  diaCobranca: number;
  status: string;
  dataInicio: string;
  dataFim: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
