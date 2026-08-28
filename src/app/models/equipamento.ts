export interface Equipamento {
  id: string;
  clienteId: string;
  vendaId: string | null;
  tipoDispositivo: string;
  identificador: string | null;
  ipVpn: string | null;
  status: string;
  dataInstalacao: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
