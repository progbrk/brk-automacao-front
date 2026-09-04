export interface Colaborador {
  id: string;
  nome: string;
  cargo: string | null;
  tipo: string;
  cpfCnpj: string | null;
  telefone: string | null;
  email: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}
