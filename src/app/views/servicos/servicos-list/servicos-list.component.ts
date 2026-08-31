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
import { Servico } from '../../../models/servico';
import { ServicosApiService } from '../../../services/servicos-api/servicos-api.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-servicos-list',
  templateUrl: './servicos-list.component.html',
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
export class ServicosListComponent implements OnInit {
  servicos: Servico[] = [];
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private servicosApi: ServicosApiService,
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
      const resultado = await this.servicosApi.getAllPaginated({ pageIndex, pageSize: PAGE_SIZE });
      this.servicos = resultado.items;
      this.pageIndex = resultado.pageIndex;
      this.totalPages = resultado.totalPages || 1;
    } catch {
      this.erro = 'Não foi possível carregar os serviços.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  get servicosFiltrados(): Servico[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.servicos;
    }
    return this.servicos.filter(s => s.nome.toLowerCase().includes(termo));
  }

  abrirServico(id: string): void {
    this.router.navigate(['/servicos', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
