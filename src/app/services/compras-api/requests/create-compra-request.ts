export interface CreateCompraRequest {
  fornecedorId: string;
  vendaId?: string | null;
  item: string;
  quantidade: number;
  valorUnitario: number;
  frete: number;
  imposto: number;
  dataCompra?: string | null;
}
