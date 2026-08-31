export interface CreateVendaRequest {
  clienteId: string;
  parceiroId?: string | null;
  descricao?: string | null;
  status: string;
  dataVenda?: string | null;
}
