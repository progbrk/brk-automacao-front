export interface CreateEquipamentoRequest {
  clienteId: string;
  vendaId?: string | null;
  tipoDispositivo: string;
  identificador?: string | null;
  ipVpn?: string | null;
  status: string;
  dataInstalacao?: string | null;
}
