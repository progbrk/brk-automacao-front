export interface CreatePlanoAssinaturaRequest {
  nome: string;
  descricao?: string | null;
  valorMensal?: number | null;
  ativo: boolean;
}
