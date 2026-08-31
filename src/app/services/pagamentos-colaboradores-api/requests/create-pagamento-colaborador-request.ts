export interface CreatePagamentoColaboradorRequest {
  colaboradorId: string;
  vendaServicoId: string;
  valor: number;
  status: string;
  dataPagamento?: string | null;
}
