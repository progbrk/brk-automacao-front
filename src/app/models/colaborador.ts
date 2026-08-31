export interface Colaborador {
  id: string;
  nome: string;
  cargo: string | null;
  telefone: string | null;
  email: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}
