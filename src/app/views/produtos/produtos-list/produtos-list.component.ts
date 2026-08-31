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
import { Produto } from '../../../models/produto';
import { ProdutosApiService } from '../../../services/produtos-api/produtos-api.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-produtos-list',
  templateUrl: './produtos-list.component.html',
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
export class ProdutosListComponent implements OnInit {
  produtos: Produto[] = [];
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private produtosApi: ProdutosApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregar(1);
  }

  async carregar(pageIndex: number): Promise<void> {
    this.carregando = true;
    this.erro = null;
    try {
      const resultado = await this.produtosApi.getAllPaginated({ pageIndex, pageSize: PAGE_SIZE });
      this.produtos = resultado.items;
      this.pageIndex = resultado.pageIndex;
      this.totalPages = resultado.totalPages || 1;
    } catch {
      this.erro = 'Não foi possível carregar os produtos.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  urlFoto(produto: Produto): string | null {
    return this.produtosApi.urlFoto(produto);
  }

  get produtosFiltrados(): Produto[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.produtos;
    }
    return this.produtos.filter(
      p => p.nome.toLowerCase().includes(termo)
    );
  }

  abrirProduto(id: string): void {
    this.router.navigate(['/produtos', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
