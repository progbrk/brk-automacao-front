export interface CreatePagamentoRequest {
  clienteId: string;
  vendaId?: string | null;
  assinaturaId?: string | null;
  valor: number;
  formaPagamento?: string | null;
  status: string;
  dataPagamento?: string | null;
}
