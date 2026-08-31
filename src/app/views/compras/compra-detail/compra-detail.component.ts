import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AlertComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent
} from '@coreui/angular';
import { Fornecedor } from '../../../models/fornecedor';
import { ComprasApiService } from '../../../services/compras-api/compras-api.service';
import { CreateCompraRequest } from '../../../services/compras-api/requests/create-compra-request';
import { FornecedoresApiService } from '../../../services/fornecedores-api/fornecedores-api.service';

const FORNECEDORES_PAGE_SIZE = 200;

@Component({
  selector: 'app-compra-detail',
  templateUrl: './compra-detail.component.html',
  imports: [
    AlertComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    CommonModule,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormsModule,
    RouterLink,
    RowComponent
  ]
})
export class CompraDetailComponent implements OnInit {
  id: string | null = null;
  fornecedores: Fornecedor[] = [];
  form: CreateCompraRequest = this.formVazio();
  valorTotal: number | null = null;
  valorTotalComEncargos: number | null = null;
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
    private comprasApi: ComprasApiService,
    private fornecedoresApi: FornecedoresApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get isEdicao(): boolean {
    return this.id !== null;
  }

  async ngOnInit(): Promise<void> {
    this.carregando = true;
    try {
      const resultadoFornecedores = await this.fornecedoresApi.getAllPaginated({
        pageIndex: 1,
        pageSize: FORNECEDORES_PAGE_SIZE
      });
      this.fornecedores = resultadoFornecedores.items;

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.id = id;
        const compra = await this.comprasApi.getById(id);
        this.form = {
          fornecedorId: compra.fornecedorId,
          vendaId: compra.vendaId,
          item: compra.item,
          quantidade: compra.quantidade,
          valorUnitario: compra.valorUnitario,
          frete: compra.frete,
          imposto: compra.imposto,
          dataCompra: compra.dataCompra
        };
        this.valorTotal = compra.valorTotal;
        this.valorTotalComEncargos = compra.valorTotalComEncargos;
      }
    } catch {
      this.erro = 'Não foi possível carregar os dados.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  async salvar(): Promise<void> {
    this.salvando = true;
    this.erro = null;
    try {
      if (this.isEdicao) {
        await this.comprasApi.update(this.id!, this.form);
      } else {
        await this.comprasApi.create(this.form);
      }
      await this.router.navigateByUrl('/compras');
    } catch {
      this.erro = 'Não foi possível salvar a compra.';
    } finally {
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  async excluir(): Promise<void> {
    if (!this.id) {
      return;
    }
    this.salvando = true;
    try {
      await this.comprasApi.delete(this.id);
      await this.router.navigateByUrl('/compras');
    } catch {
      this.erro = 'Não foi possível excluir a compra.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreateCompraRequest {
    return {
      fornecedorId: '',
      vendaId: null,
      item: '',
      quantidade: 1,
      valorUnitario: 0,
      frete: 0,
      imposto: 0,
      dataCompra: null
    };
  }
}
