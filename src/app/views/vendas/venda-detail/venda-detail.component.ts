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
import { Parceiro } from '../../../models/parceiro';
import { Produto } from '../../../models/produto';
import { Servico } from '../../../models/servico';
import { VendaItem } from '../../../models/venda-item';
import { VendaServico } from '../../../models/venda-servico';
import { ClientesApiService } from '../../../services/clientes-api/clientes-api.service';
import { ParceirosApiService } from '../../../services/parceiros-api/parceiros-api.service';
import { ProdutosApiService } from '../../../services/produtos-api/produtos-api.service';
import { ServicosApiService } from '../../../services/servicos-api/servicos-api.service';
import { CreateVendaRequest } from '../../../services/vendas-api/requests/create-venda-request';
import { VendasApiService } from '../../../services/vendas-api/vendas-api.service';
import { VendaItensApiService } from '../../../services/venda-itens-api/venda-itens-api.service';
import { VendaServicosApiService } from '../../../services/venda-servicos-api/venda-servicos-api.service';

const CLIENTES_PAGE_SIZE = 200;
const PRODUTOS_PAGE_SIZE = 200;
const SERVICOS_PAGE_SIZE = 200;
const PARCEIROS_PAGE_SIZE = 200;

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
  parceiros: Parceiro[] = [];
  produtos: Produto[] = [];
  servicos: Servico[] = [];
  itens: VendaItem[] = [];
  servicosVenda: VendaServico[] = [];
  valorVenda = 0;
  form: CreateVendaRequest = this.formVazio();
  novoItem: { produtoId: string; quantidade: number; precoUnitario: number | null } = {
    produtoId: '',
    quantidade: 1,
    precoUnitario: null
  };
  novoServico: { servicoId: string; quantidade: number; precoUnitario: number | null } = {
    servicoId: '',
    quantidade: 1,
    precoUnitario: null
  };
  carregando = false;
  salvando = false;
  adicionandoItem = false;
  adicionandoServico = false;
  erro: string | null = null;

  constructor(
    private vendasApi: VendasApiService,
    private vendaItensApi: VendaItensApiService,
    private vendaServicosApi: VendaServicosApiService,
    private clientesApi: ClientesApiService,
    private parceirosApi: ParceirosApiService,
    private produtosApi: ProdutosApiService,
    private servicosApi: ServicosApiService,
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
      const [resultadoClientes, resultadoProdutos, resultadoServicos, resultadoParceiros] = await Promise.all([
        this.clientesApi.getAllPaginated({ pageIndex: 1, pageSize: CLIENTES_PAGE_SIZE }),
        this.produtosApi.getAllPaginated({ pageIndex: 1, pageSize: PRODUTOS_PAGE_SIZE }),
        this.servicosApi.getAllPaginated({ pageIndex: 1, pageSize: SERVICOS_PAGE_SIZE }),
        this.parceirosApi.getAllPaginated({ pageIndex: 1, pageSize: PARCEIROS_PAGE_SIZE })
      ]);
      this.clientes = resultadoClientes.items;
      this.produtos = resultadoProdutos.items;
      this.servicos = resultadoServicos.items;
      this.parceiros = resultadoParceiros.items;

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.id = id;
        await this.carregarVenda(id);
        await this.carregarItens(id);
        await this.carregarServicosVenda(id);
      }
    } catch {
      this.erro = 'Não foi possível carregar os dados.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  private async carregarVenda(vendaId: string): Promise<void> {
    const venda = await this.vendasApi.getById(vendaId);
    this.form = {
      clienteId: venda.clienteId,
      parceiroId: venda.parceiroId,
      descricao: venda.descricao,
      desconto: venda.desconto,
      status: venda.status,
      dataVenda: venda.dataVenda
    };
    this.valorVenda = venda.valor;
  }

  private async carregarItens(vendaId: string): Promise<void> {
    this.itens = await this.vendaItensApi.getByVenda(vendaId);
  }

  private async carregarServicosVenda(vendaId: string): Promise<void> {
    this.servicosVenda = await this.vendaServicosApi.getByVenda(vendaId);
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

  nomeServico(servicoId: string): string {
    return this.servicos.find(s => s.id === servicoId)?.nome ?? servicoId;
  }

  onProdutoSelecionado(): void {
    const produto = this.produtos.find(p => p.id === this.novoItem.produtoId);
    if (produto?.precoVenda != null) {
      this.novoItem.precoUnitario = produto.precoVenda;
    }
  }

  onServicoSelecionado(): void {
    const servico = this.servicos.find(s => s.id === this.novoServico.servicoId);
    if (servico?.preco != null) {
      this.novoServico.precoUnitario = servico.preco;
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
      await this.carregarVenda(this.id);
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
      await this.carregarVenda(this.id);
    } catch {
      this.erro = 'Não foi possível remover o item.';
    } finally {
      this.cdr.markForCheck();
    }
  }

  async adicionarServico(): Promise<void> {
    if (!this.id || !this.novoServico.servicoId || this.novoServico.precoUnitario == null) {
      return;
    }
    this.adicionandoServico = true;
    this.erro = null;
    try {
      await this.vendaServicosApi.create({
        vendaId: this.id,
        servicoId: this.novoServico.servicoId,
        quantidade: this.novoServico.quantidade,
        precoUnitario: this.novoServico.precoUnitario
      });
      await this.carregarServicosVenda(this.id);
      await this.carregarVenda(this.id);
      this.novoServico = { servicoId: '', quantidade: 1, precoUnitario: null };
    } catch {
      this.erro = 'Não foi possível adicionar o serviço (ele já pode estar nessa venda).';
    } finally {
      this.adicionandoServico = false;
      this.cdr.markForCheck();
    }
  }

  async removerServico(itemId: string): Promise<void> {
    if (!this.id) {
      return;
    }
    try {
      await this.vendaServicosApi.delete(itemId);
      await this.carregarServicosVenda(this.id);
      await this.carregarVenda(this.id);
    } catch {
      this.erro = 'Não foi possível remover o serviço.';
    } finally {
      this.cdr.markForCheck();
    }
  }

  get valorTotalItens(): number {
    return this.itens.reduce((soma, item) => soma + (item.valorTotal ?? 0), 0);
  }

  get valorTotalServicos(): number {
    return this.servicosVenda.reduce((soma, item) => soma + (item.valorTotal ?? 0), 0);
  }

  get subtotal(): number {
    return this.valorTotalItens + this.valorTotalServicos;
  }

  get previewValorFinal(): number {
    return Math.max(0, this.subtotal - (this.form.desconto || 0));
  }

  get previewDivergeDoSalvo(): boolean {
    // Arredonda em centavos antes de comparar — soma em ponto flutuante no
    // front pode diferir do total calculado com NUMERIC no backend por uma
    // fração de centavo mesmo quando o valor exibido é idêntico.
    return Math.round(this.previewValorFinal * 100) !== Math.round(this.valorVenda * 100);
  }

  private formVazio(): CreateVendaRequest {
    return {
      clienteId: '',
      parceiroId: null,
      descricao: null,
      desconto: 0,
      status: 'orcamento',
      dataVenda: null
    };
  }
}
