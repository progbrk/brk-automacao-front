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
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { Cliente } from '../../../models/cliente';
import { Produto } from '../../../models/produto';
import { VendaItem } from '../../../models/venda-item';
import { ClientesApiService } from '../../../services/clientes-api/clientes-api.service';
import { ProdutosApiService } from '../../../services/produtos-api/produtos-api.service';
import { CreateVendaRequest } from '../../../services/vendas-api/requests/create-venda-request';
import { VendasApiService } from '../../../services/vendas-api/vendas-api.service';
import { VendaItensApiService } from '../../../services/venda-itens-api/venda-itens-api.service';

const CLIENTES_PAGE_SIZE = 200;
const PRODUTOS_PAGE_SIZE = 200;

@Component({
  selector: 'app-venda-detail',
  templateUrl: './venda-detail.component.html',
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
    RowComponent,
    TableDirective
  ]
})
export class VendaDetailComponent implements OnInit {
  id: string | null = null;
  clientes: Cliente[] = [];
  produtos: Produto[] = [];
  itens: VendaItem[] = [];
  form: CreateVendaRequest = this.formVazio();
  novoItem: { produtoId: string; quantidade: number; precoUnitario: number | null } = {
    produtoId: '',
    quantidade: 1,
    precoUnitario: null
  };
  carregando = false;
  salvando = false;
  adicionandoItem = false;
  erro: string | null = null;

  constructor(
    private vendasApi: VendasApiService,
    private vendaItensApi: VendaItensApiService,
    private clientesApi: ClientesApiService,
    private produtosApi: ProdutosApiService,
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
      const [resultadoClientes, resultadoProdutos] = await Promise.all([
        this.clientesApi.getAllPaginated({ pageIndex: 1, pageSize: CLIENTES_PAGE_SIZE }),
        this.produtosApi.getAllPaginated({ pageIndex: 1, pageSize: PRODUTOS_PAGE_SIZE })
      ]);
      this.clientes = resultadoClientes.items;
      this.produtos = resultadoProdutos.items;

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.id = id;
        const venda = await this.vendasApi.getById(id);
        this.form = {
          clienteId: venda.clienteId,
          parceiroId: venda.parceiroId,
          descricao: venda.descricao,
          valor: venda.valor,
          status: venda.status,
          dataVenda: venda.dataVenda
        };
        await this.carregarItens(id);
      }
    } catch {
      this.erro = 'Não foi possível carregar os dados.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  private async carregarItens(vendaId: string): Promise<void> {
    this.itens = await this.vendaItensApi.getByVenda(vendaId);
  }

  async salvar(): Promise<void> {
    this.salvando = true;
    this.erro = null;
    try {
      if (this.isEdicao) {
        await this.vendasApi.update(this.id!, this.form);
        await this.router.navigateByUrl('/vendas');
      } else {
        const criada = await this.vendasApi.create(this.form);
        await this.router.navigateByUrl(`/vendas/${criada.id}`);
      }
    } catch {
      this.erro = 'Não foi possível salvar a venda.';
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
      await this.vendasApi.delete(this.id);
      await this.router.navigateByUrl('/vendas');
    } catch {
      this.erro = 'Não foi possível excluir a venda.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  nomeProduto(produtoId: string): string {
    return this.produtos.find(p => p.id === produtoId)?.nome ?? produtoId;
  }

  onProdutoSelecionado(): void {
    const produto = this.produtos.find(p => p.id === this.novoItem.produtoId);
    if (produto?.precoVenda != null) {
      this.novoItem.precoUnitario = produto.precoVenda;
    }
  }

  async adicionarItem(): Promise<void> {
    if (!this.id || !this.novoItem.produtoId || this.novoItem.precoUnitario == null) {
      return;
    }
    this.adicionandoItem = true;
    this.erro = null;
    try {
      await this.vendaItensApi.create({
        vendaId: this.id,
        produtoId: this.novoItem.produtoId,
        quantidade: this.novoItem.quantidade,
        precoUnitario: this.novoItem.precoUnitario
      });
      await this.carregarItens(this.id);
      this.novoItem = { produtoId: '', quantidade: 1, precoUnitario: null };
    } catch {
      this.erro = 'Não foi possível adicionar o item (a peça já pode estar nessa venda).';
    } finally {
      this.adicionandoItem = false;
      this.cdr.markForCheck();
    }
  }

  async removerItem(itemId: string): Promise<void> {
    if (!this.id) {
      return;
    }
    try {
      await this.vendaItensApi.delete(itemId);
      await this.carregarItens(this.id);
    } catch {
      this.erro = 'Não foi possível remover o item.';
    } finally {
      this.cdr.markForCheck();
    }
  }

  get valorTotalItens(): number {
    return this.itens.reduce((soma, item) => soma + (item.valorTotal ?? 0), 0);
  }

  private formVazio(): CreateVendaRequest {
    return {
      clienteId: '',
      parceiroId: null,
      descricao: null,
      valor: 0,
      status: 'orcamento',
      dataVenda: null
    };
  }
}
