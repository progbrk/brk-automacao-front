import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  AlertComponent,
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
import { Compra } from '../../../models/compra';
import { ComprasApiService } from '../../../services/compras-api/compras-api.service';
import { FornecedoresApiService } from '../../../services/fornecedores-api/fornecedores-api.service';

const PAGE_SIZE = 20;
const FORNECEDORES_PAGE_SIZE = 200;

@Component({
  selector: 'app-compras-list',
  templateUrl: './compras-list.component.html',
  imports: [
    AlertComponent,
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
export class ComprasListComponent implements OnInit {
  compras: Compra[] = [];
  fornecedoresPorId = new Map<string, string>();
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private comprasApi: ComprasApiService,
    private fornecedoresApi: FornecedoresApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarFornecedores();
    this.carregar(1);
  }

  async carregarFornecedores(): Promise<void> {
    try {
      const resultado = await this.fornecedoresApi.getAllPaginated({ pageIndex: 1, pageSize: FORNECEDORES_PAGE_SIZE });
      this.fornecedoresPorId = new Map(resultado.items.map(f => [f.id, f.nome]));
    } catch {
      this.fornecedoresPorId = new Map();
    } finally {
      this.cdr.markForCheck();
    }
  }

  async carregar(pageIndex: number): Promise<void> {
    this.carregando = true;
    this.erro = null;
    try {
      const resultado = await this.comprasApi.getAllPaginated({ pageIndex, pageSize: PAGE_SIZE });
      this.compras = resultado.items;
      this.pageIndex = resultado.pageIndex;
      this.totalPages = resultado.totalPages || 1;
    } catch {
      this.erro = 'Não foi possível carregar as compras.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  nomeFornecedor(fornecedorId: string): string {
    return this.fornecedoresPorId.get(fornecedorId) ?? fornecedorId;
  }

  get comprasFiltradas(): Compra[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.compras;
    }
    return this.compras.filter(
      c =>
        c.item.toLowerCase().includes(termo) ||
        this.nomeFornecedor(c.fornecedorId).toLowerCase().includes(termo)
    );
  }

  abrirCompra(id: string): void {
    this.router.navigate(['/compras', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
