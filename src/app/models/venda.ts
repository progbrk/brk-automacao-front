export interface Venda {
  id: string;
  clienteId: string;
  parceiroId: string | null;
  descricao: string | null;
  desconto: number;
  valor: number;
  status: string;
  dataVenda: string;
  criadoEm: string;
  atualizadoEm: string;
}
