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
import { Cliente } from '../../../models/cliente';
import { ClientesApiService } from '../../../services/clientes-api/clientes-api.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
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
export class ClientesListComponent implements OnInit {
  clientes: Cliente[] = [];
  pageIndex = 1;
  totalPages = 1;
  searchTerm = '';
  carregando = false;
  erro: string | null = null;

  constructor(
    private clientesApi: ClientesApiService,
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
      const resultado = await this.clientesApi.getAllPaginated({ pageIndex, pageSize: PAGE_SIZE });
      this.clientes = resultado.items;
      this.pageIndex = resultado.pageIndex;
      this.totalPages = resultado.totalPages || 1;
    } catch {
      this.erro = 'Não foi possível carregar os clientes.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  get clientesFiltrados(): Cliente[] {
    const termo = this.searchTerm.trim().toLowerCase();
    if (!termo) {
      return this.clientes;
    }
    return this.clientes.filter(
      c => c.nome.toLowerCase().includes(termo) || (c.cpfCnpj ?? '').includes(termo)
    );
  }

  abrirCliente(id: string): void {
    this.router.navigate(['/clientes', id]);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
