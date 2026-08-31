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
import { PagamentoColaborador } from '../../../models/pagamento-colaborador';
import { ColaboradoresApiService } from '../../../services/colaboradores-api/colaboradores-api.service';
import { PagamentosColaboradoresApiService } from '../../../services/pagamentos-colaboradores-api/pagamentos-colaboradores-api.service';

const PAGE_SIZE = 20;
const REF_PAGE_SIZE = 200;

@Component({
  selector: 'app-pagamentos-colaboradores-list',
  templateUrl: './pagamentos-colaboradores-list.component.html',
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
export class PagamentosColaboradoresListComponent implements OnInit {
  pagamentos: PagamentoColaborador[] = [];
  colaboradoresPorId = new Map<string, string>();
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private pagamentosApi: PagamentosColaboradoresApiService,
    private colaboradoresApi: ColaboradoresApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarColaboradores();
    this.carregar(1);
  }

  async carregarColaboradores(): Promise<void> {
    try {
      const resultado = await this.colaboradoresApi.getAllPaginated({ pageIndex: 1, pageSize: REF_PAGE_SIZE });
      this.colaboradoresPorId = new Map(resultado.items.map(c => [c.id, c.nome]));
    } catch {
      this.colaboradoresPorId = new Map();
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

  nomeColaborador(colaboradorId: string): string {
    return this.colaboradoresPorId.get(colaboradorId) ?? colaboradorId;
  }

  corStatus(status: string): string {
    return status === 'pago' ? 'success' : 'secondary';
  }

  get pagamentosFiltrados(): PagamentoColaborador[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.pagamentos;
    }
    return this.pagamentos.filter(p => this.nomeColaborador(p.colaboradorId).toLowerCase().includes(termo));
  }

  abrirPagamento(id: string): void {
    this.router.navigate(['/pagamentos-colaboradores', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
