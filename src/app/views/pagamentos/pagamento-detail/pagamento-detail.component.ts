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
import { Assinatura } from '../../../models/assinatura';
import { Cliente } from '../../../models/cliente';
import { Venda } from '../../../models/venda';
import { AssinaturasApiService } from '../../../services/assinaturas-api/assinaturas-api.service';
import { ClientesApiService } from '../../../services/clientes-api/clientes-api.service';
import { CreatePagamentoRequest } from '../../../services/pagamentos-api/requests/create-pagamento-request';
import { PagamentosApiService } from '../../../services/pagamentos-api/pagamentos-api.service';
import { VendasApiService } from '../../../services/vendas-api/vendas-api.service';

const REF_PAGE_SIZE = 200;

@Component({
  selector: 'app-pagamento-detail',
  templateUrl: './pagamento-detail.component.html',
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
export class PagamentoDetailComponent implements OnInit {
  id: string | null = null;
  clientes: Cliente[] = [];
  vendas: Venda[] = [];
  assinaturas: Assinatura[] = [];
  form: CreatePagamentoRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
    private pagamentosApi: PagamentosApiService,
    private clientesApi: ClientesApiService,
    private vendasApi: VendasApiService,
    private assinaturasApi: AssinaturasApiService,
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
      const [resultadoClientes, resultadoVendas, resultadoAssinaturas] = await Promise.all([
        this.clientesApi.getAllPaginated({ pageIndex: 1, pageSize: REF_PAGE_SIZE }),
        this.vendasApi.getAllPaginated({ pageIndex: 1, pageSize: REF_PAGE_SIZE }),
        this.assinaturasApi.getAllPaginated({ pageIndex: 1, pageSize: REF_PAGE_SIZE })
      ]);
      this.clientes = resultadoClientes.items;
      this.vendas = resultadoVendas.items;
      this.assinaturas = resultadoAssinaturas.items;

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.id = id;
        const pagamento = await this.pagamentosApi.getById(id);
        this.form = {
          clienteId: pagamento.clienteId,
          vendaId: pagamento.vendaId,
          assinaturaId: pagamento.assinaturaId,
          valor: pagamento.valor,
          formaPagamento: pagamento.formaPagamento,
          status: pagamento.status,
          dataPagamento: pagamento.dataPagamento
        };
      }
    } catch {
      this.erro = 'Não foi possível carregar os dados.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  descricaoVenda(venda: Venda): string {
    return venda.descricao || venda.dataVenda;
  }

  onVendaSelecionada(): void {
    const venda = this.vendas.find(v => v.id === this.form.vendaId);
    if (venda) {
      this.form.valor = venda.valor;
      this.form.assinaturaId = null;
    }
  }

  onAssinaturaSelecionada(): void {
    const assinatura = this.assinaturas.find(a => a.id === this.form.assinaturaId);
    if (assinatura) {
      this.form.valor = assinatura.valorMensal;
      this.form.vendaId = null;
    }
  }

  async salvar(): Promise<void> {
    this.salvando = true;
    this.erro = null;
    try {
      if (this.isEdicao) {
        await this.pagamentosApi.update(this.id!, this.form);
      } else {
        await this.pagamentosApi.create(this.form);
      }
      await this.router.navigateByUrl('/pagamentos');
    } catch {
      this.erro = 'Não foi possível salvar o pagamento.';
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
      await this.pagamentosApi.delete(this.id);
      await this.router.navigateByUrl('/pagamentos');
    } catch {
      this.erro = 'Não foi possível excluir o pagamento.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreatePagamentoRequest {
    return {
      clienteId: '',
      vendaId: null,
      assinaturaId: null,
      valor: 0,
      formaPagamento: null,
      status: 'pendente',
      dataPagamento: null
    };
  }
}
