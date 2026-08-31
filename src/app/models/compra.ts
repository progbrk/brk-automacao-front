export interface Compra {
  id: string;
  fornecedorId: string;
  vendaId: string | null;
  item: string;
  quantidade: number;
  valorUnitario: number;
  frete: number;
  imposto: number;
  valorTotal: number | null;
  valorTotalComEncargos: number | null;
  dataCompra: string;
  criadoEm: string;
  atualizadoEm: string;
}
