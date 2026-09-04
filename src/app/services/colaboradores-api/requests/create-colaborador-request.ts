export interface CreateColaboradorRequest {
  nome: string;
  cargo?: string | null;
  tipo: string;
  cpfCnpj?: string | null;
  telefone?: string | null;
  email?: string | null;
  ativo: boolean;
}
