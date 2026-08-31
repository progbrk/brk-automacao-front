export interface PagamentoColaborador {
  id: string;
  colaboradorId: string;
  vendaServicoId: string;
  valor: number;
  status: string;
  dataPagamento: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
