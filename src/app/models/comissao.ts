export interface Comissao {
  id: string;
  parceiroId: string;
  vendaId: string;
  valor: number;
  status: string;
  dataPagamento: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
