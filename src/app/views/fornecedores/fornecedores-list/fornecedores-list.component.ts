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
import { Fornecedor } from '../../../models/fornecedor';
import { FornecedoresApiService } from '../../../services/fornecedores-api/fornecedores-api.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-fornecedores-list',
  templateUrl: './fornecedores-list.component.html',
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
export class FornecedoresListComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private fornecedoresApi: FornecedoresApiService,
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
      const resultado = await this.fornecedoresApi.getAllPaginated({ pageIndex, pageSize: PAGE_SIZE });
      this.fornecedores = resultado.items;
      this.pageIndex = resultado.pageIndex;
      this.totalPages = resultado.totalPages || 1;
    } catch {
      this.erro = 'Não foi possível carregar os fornecedores.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  get fornecedoresFiltrados(): Fornecedor[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.fornecedores;
    }
    return this.fornecedores.filter(f => f.nome.toLowerCase().includes(termo));
  }

  abrirFornecedor(id: string): void {
    this.router.navigate(['/fornecedores', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
