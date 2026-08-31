export interface CreateComissaoRequest {
  parceiroId: string;
  vendaId: string;
  valor: number;
  status: string;
  dataPagamento?: string | null;
}
