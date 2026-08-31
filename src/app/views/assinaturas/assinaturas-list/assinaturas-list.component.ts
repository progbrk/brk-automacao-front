import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  AlertComponent,
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  InputGroupComponent,
  PageItemDirective,
  PageLinkDirective,
  PaginationComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { Assinatura } from '../../../models/assinatura';
import { AssinaturasApiService } from '../../../services/assinaturas-api/assinaturas-api.service';
import { ClientesApiService } from '../../../services/clientes-api/clientes-api.service';
import { PlanosAssinaturaApiService } from '../../../services/planos-assinatura-api/planos-assinatura-api.service';

const PAGE_SIZE = 20;
const CLIENTES_PAGE_SIZE = 200;
const PLANOS_PAGE_SIZE = 200;

@Component({
  selector: 'app-assinaturas-list',
  templateUrl: './assinaturas-list.component.html',
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    CommonModule,
    FormControlDirective,
    FormsModule,
    InputGroupComponent,
    PageItemDirective,
    PageLinkDirective,
    PaginationComponent,
    RowComponent,
    RouterLink,
    TableDirective
  ]
})
export class AssinaturasListComponent implements OnInit {
  assinaturas: Assinatura[] = [];
  clientesPorId = new Map<string, string>();
  planosPorId = new Map<string, string>();
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private assinaturasApi: AssinaturasApiService,
    private clientesApi: ClientesApiService,
    private planosApi: PlanosAssinaturaApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarReferencias();
    this.carregar(1);
  }

  async carregarReferencias(): Promise<void> {
    try {
      const [resultadoClientes, resultadoPlanos] = await Promise.all([
        this.clientesApi.getAllPaginated({ pageIndex: 1, pageSize: CLIENTES_PAGE_SIZE }),
        this.planosApi.getAllPaginated({ pageIndex: 1, pageSize: PLANOS_PAGE_SIZE })
      ]);
      this.clientesPorId = new Map(resultadoClientes.items.map(c => [c.id, c.nome]));
      this.planosPorId = new Map(resultadoPlanos.items.map(p => [p.id, p.nome]));
    } catch {
      this.clientesPorId = new Map();
      this.planosPorId = new Map();
    } finally {
      this.cdr.markForCheck();
    }
  }

  async carregar(pageIndex: number): Promise<void> {
    this.carregando = true;
    this.erro = null;
    try {
      const resultado = await this.assinaturasApi.getAllPaginated({ pageIndex, pageSize: PAGE_SIZE });
      this.assinaturas = resultado.items;
      this.pageIndex = resultado.pageIndex;
      this.totalPages = resultado.totalPages || 1;
    } catch {
      this.erro = 'Não foi possível carregar as assinaturas.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  nomeCliente(clienteId: string): string {
    return this.clientesPorId.get(clienteId) ?? clienteId;
  }

  nomePlano(planoId: string): string {
    return this.planosPorId.get(planoId) ?? planoId;
  }

  corStatus(status: string): string {
    switch (status) {
      case 'ativa':
        return 'success';
      case 'suspensa':
        return 'warning';
      case 'cancelada':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  get assinaturasFiltradas(): Assinatura[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.assinaturas;
    }
    return this.assinaturas.filter(
      a =>
        this.nomeCliente(a.clienteId).toLowerCase().includes(termo) ||
        this.nomePlano(a.planoId).toLowerCase().includes(termo)
    );
  }

  abrirAssinatura(id: string): void {
    this.router.navigate(['/assinaturas', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
