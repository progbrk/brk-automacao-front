export interface CreateVendaRequest {
  clienteId: string;
  parceiroId?: string | null;
  descricao?: string | null;
  valor: number;
  status: string;
  dataVenda?: string | null;
}
