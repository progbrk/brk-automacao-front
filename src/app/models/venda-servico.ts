export interface VendaServico {
  id: string;
  vendaId: string;
  servicoId: string;
  quantidade: number;
  precoUnitario: number;
  valorTotal: number | null;
  criadoEm: string;
  atualizadoEm: string;
}
