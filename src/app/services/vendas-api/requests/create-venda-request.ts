export interface CreateVendaRequest {
  clienteId: string;
  parceiroId?: string | null;
  descricao?: string | null;
  desconto: number;
  status: string;
  dataVenda?: string | null;
}
