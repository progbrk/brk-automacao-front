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
import { Pagamento } from '../../../models/pagamento';
import { ClientesApiService } from '../../../services/clientes-api/clientes-api.service';
import { PagamentosApiService } from '../../../services/pagamentos-api/pagamentos-api.service';

const PAGE_SIZE = 20;
const CLIENTES_PAGE_SIZE = 200;

@Component({
  selector: 'app-pagamentos-list',
  templateUrl: './pagamentos-list.component.html',
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
export class PagamentosListComponent implements OnInit {
  pagamentos: Pagamento[] = [];
  clientesPorId = new Map<string, string>();
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private pagamentosApi: PagamentosApiService,
    private clientesApi: ClientesApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
    this.carregar(1);
  }

  async carregarClientes(): Promise<void> {
    try {
      const resultado = await this.clientesApi.getAllPaginated({ pageIndex: 1, pageSize: CLIENTES_PAGE_SIZE });
      this.clientesPorId = new Map(resultado.items.map(c => [c.id, c.nome]));
    } catch {
      this.clientesPorId = new Map();
    } finally {
      this.cdr.markForCheck();
    }
  }

  async carregar(pageIndex: number): Promise<void> {
    this.carregando = true;
    this.erro = null;
    try {
      const resultado = await this.pagamentosApi.getAllPaginated({ pageIndex, pageSize: PAGE_SIZE });
      this.pagamentos = resultado.items;
      this.pageIndex = resultado.pageIndex;
      this.totalPages = resultado.totalPages || 1;
    } catch {
      this.erro = 'Não foi possível carregar os pagamentos.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  nomeCliente(clienteId: string): string {
    return this.clientesPorId.get(clienteId) ?? clienteId;
  }

  corStatus(status: string): string {
    switch (status) {
      case 'pago':
        return 'success';
      case 'atrasado':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  get pagamentosFiltrados(): Pagamento[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.pagamentos;
    }
    return this.pagamentos.filter(p => this.nomeCliente(p.clienteId).toLowerCase().includes(termo));
  }

  abrirPagamento(id: string): void {
    this.router.navigate(['/pagamentos', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
