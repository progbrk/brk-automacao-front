export interface CreateColaboradorRequest {
  nome: string;
  cargo?: string | null;
  telefone?: string | null;
  email?: string | null;
  ativo: boolean;
}
