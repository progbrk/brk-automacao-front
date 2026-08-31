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
import { Parceiro } from '../../../models/parceiro';
import { ParceirosApiService } from '../../../services/parceiros-api/parceiros-api.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-parceiros-list',
  templateUrl: './parceiros-list.component.html',
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
export class ParceirosListComponent implements OnInit {
  parceiros: Parceiro[] = [];
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private parceirosApi: ParceirosApiService,
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
      const resultado = await this.parceirosApi.getAllPaginated({ pageIndex, pageSize: PAGE_SIZE });
      this.parceiros = resultado.items;
      this.pageIndex = resultado.pageIndex;
      this.totalPages = resultado.totalPages || 1;
    } catch {
      this.erro = 'Não foi possível carregar os parceiros.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  get parceirosFiltrados(): Parceiro[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.parceiros;
    }
    return this.parceiros.filter(
      p => p.nome.toLowerCase().includes(termo) || p.tipo.toLowerCase().includes(termo)
    );
  }

  abrirParceiro(id: string): void {
    this.router.navigate(['/parceiros', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
