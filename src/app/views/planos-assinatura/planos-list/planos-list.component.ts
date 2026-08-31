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
import { PlanoAssinatura } from '../../../models/plano-assinatura';
import { PlanosAssinaturaApiService } from '../../../services/planos-assinatura-api/planos-assinatura-api.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-planos-list',
  templateUrl: './planos-list.component.html',
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
export class PlanosListComponent implements OnInit {
  planos: PlanoAssinatura[] = [];
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private planosApi: PlanosAssinaturaApiService,
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
      const resultado = await this.planosApi.getAllPaginated({ pageIndex, pageSize: PAGE_SIZE });
      this.planos = resultado.items;
      this.pageIndex = resultado.pageIndex;
      this.totalPages = resultado.totalPages || 1;
    } catch {
      this.erro = 'Não foi possível carregar os planos.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  get planosFiltrados(): PlanoAssinatura[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.planos;
    }
    return this.planos.filter(p => p.nome.toLowerCase().includes(termo));
  }

  abrirPlano(id: string): void {
    this.router.navigate(['/planos-assinatura', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
