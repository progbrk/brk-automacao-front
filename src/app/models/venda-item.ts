export interface VendaItem {
  id: string;
  vendaId: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  valorTotal: number | null;
  criadoEm: string;
  atualizadoEm: string;
}
