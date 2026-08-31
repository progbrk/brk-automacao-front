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
import { Comissao } from '../../../models/comissao';
import { ComissoesApiService } from '../../../services/comissoes-api/comissoes-api.service';
import { ParceirosApiService } from '../../../services/parceiros-api/parceiros-api.service';
import { VendasApiService } from '../../../services/vendas-api/vendas-api.service';

const PAGE_SIZE = 20;
const REF_PAGE_SIZE = 200;

@Component({
  selector: 'app-comissoes-list',
  templateUrl: './comissoes-list.component.html',
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
export class ComissoesListComponent implements OnInit {
  comissoes: Comissao[] = [];
  parceirosPorId = new Map<string, string>();
  vendasDescricaoPorId = new Map<string, string>();
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private comissoesApi: ComissoesApiService,
    private parceirosApi: ParceirosApiService,
    private vendasApi: VendasApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarReferencias();
    this.carregar(1);
  }

  async carregarReferencias(): Promise<void> {
    try {
      const [resultadoParceiros, resultadoVendas] = await Promise.all([
        this.parceirosApi.getAllPaginated({ pageIndex: 1, pageSize: REF_PAGE_SIZE }),
        this.vendasApi.getAllPaginated({ pageIndex: 1, pageSize: REF_PAGE_SIZE })
      ]);
      this.parceirosPorId = new Map(resultadoParceiros.items.map(p => [p.id, p.nome]));
      this.vendasDescricaoPorId = new Map(
        resultadoVendas.items.map(v => [v.id, v.descricao || v.dataVenda])
      );
    } catch {
      this.parceirosPorId = new Map();
      this.vendasDescricaoPorId = new Map();
    } finally {
      this.cdr.markForCheck();
    }
  }

  async carregar(pageIndex: number): Promise<void> {
    this.carregando = true;
    this.erro = null;
    try {
      const resultado = await this.comissoesApi.getAllPaginated({ pageIndex, pageSize: PAGE_SIZE });
      this.comissoes = resultado.items;
      this.pageIndex = resultado.pageIndex;
      this.totalPages = resultado.totalPages || 1;
    } catch {
      this.erro = 'Não foi possível carregar as comissões.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  nomeParceiro(parceiroId: string): string {
    return this.parceirosPorId.get(parceiroId) ?? parceiroId;
  }

  descricaoVenda(vendaId: string): string {
    return this.vendasDescricaoPorId.get(vendaId) ?? vendaId;
  }

  corStatus(status: string): string {
    return status === 'pago' ? 'success' : 'secondary';
  }

  get comissoesFiltradas(): Comissao[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.comissoes;
    }
    return this.comissoes.filter(c => this.nomeParceiro(c.parceiroId).toLowerCase().includes(termo));
  }

  abrirComissao(id: string): void {
    this.router.navigate(['/comissoes', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
