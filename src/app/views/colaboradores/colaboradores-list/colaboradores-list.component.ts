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
import { Colaborador } from '../../../models/colaborador';
import { ColaboradoresApiService } from '../../../services/colaboradores-api/colaboradores-api.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-colaboradores-list',
  templateUrl: './colaboradores-list.component.html',
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
export class ColaboradoresListComponent implements OnInit {
  colaboradores: Colaborador[] = [];
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private colaboradoresApi: ColaboradoresApiService,
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
      const resultado = await this.colaboradoresApi.getAllPaginated({ pageIndex, pageSize: PAGE_SIZE });
      this.colaboradores = resultado.items;
      this.pageIndex = resultado.pageIndex;
      this.totalPages = resultado.totalPages || 1;
    } catch {
      this.erro = 'Não foi possível carregar os colaboradores.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  get colaboradoresFiltrados(): Colaborador[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.colaboradores;
    }
    return this.colaboradores.filter(
      c => c.nome.toLowerCase().includes(termo) || (c.cargo ?? '').toLowerCase().includes(termo)
    );
  }

  abrirColaborador(id: string): void {
    this.router.navigate(['/colaboradores', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
