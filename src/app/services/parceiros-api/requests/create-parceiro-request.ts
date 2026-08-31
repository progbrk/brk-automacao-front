export interface CreateParceiroRequest {
  nome: string;
  tipo: string;
  telefone?: string | null;
  email?: string | null;
  percentualComissao: number;
}
