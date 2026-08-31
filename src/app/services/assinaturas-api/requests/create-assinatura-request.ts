export interface CreateAssinaturaRequest {
  clienteId: string;
  vendaId?: string | null;
  planoId: string;
  valorMensal: number;
  diaCobranca: number;
  status: string;
  dataInicio?: string | null;
  dataFim?: string | null;
}
