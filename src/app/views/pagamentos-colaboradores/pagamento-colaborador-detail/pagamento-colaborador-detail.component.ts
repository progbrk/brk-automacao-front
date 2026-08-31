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
import { Colaborador } from '../../../models/colaborador';
import { Servico } from '../../../models/servico';
import { Venda } from '../../../models/venda';
import { VendaServico } from '../../../models/venda-servico';
import { ColaboradoresApiService } from '../../../services/colaboradores-api/colaboradores-api.service';
import { CreatePagamentoColaboradorRequest } from '../../../services/pagamentos-colaboradores-api/requests/create-pagamento-colaborador-request';
import { PagamentosColaboradoresApiService } from '../../../services/pagamentos-colaboradores-api/pagamentos-colaboradores-api.service';
import { ServicosApiService } from '../../../services/servicos-api/servicos-api.service';
import { VendasApiService } from '../../../services/vendas-api/vendas-api.service';
import { VendaServicosApiService } from '../../../services/venda-servicos-api/venda-servicos-api.service';

const REF_PAGE_SIZE = 200;

@Component({
  selector: 'app-pagamento-colaborador-detail',
  templateUrl: './pagamento-colaborador-detail.component.html',
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
export class PagamentoColaboradorDetailComponent implements OnInit {
  id: string | null = null;
  colaboradores: Colaborador[] = [];
  vendas: Venda[] = [];
  servicos: Servico[] = [];
  servicosDaVenda: VendaServico[] = [];
  vendaSelecionadaId = '';
  form: CreatePagamentoColaboradorRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
    private pagamentosApi: PagamentosColaboradoresApiService,
    private colaboradoresApi: ColaboradoresApiService,
    private vendasApi: VendasApiService,
    private servicosApi: ServicosApiService,
    private vendaServicosApi: VendaServicosApiService,
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
      const [resultadoColaboradores, resultadoVendas, resultadoServicos] = await Promise.all([
        this.colaboradoresApi.getAllPaginated({ pageIndex: 1, pageSize: REF_PAGE_SIZE }),
        this.vendasApi.getAllPaginated({ pageIndex: 1, pageSize: REF_PAGE_SIZE }),
        this.servicosApi.getAllPaginated({ pageIndex: 1, pageSize: REF_PAGE_SIZE })
      ]);
      this.colaboradores = resultadoColaboradores.items;
      this.vendas = resultadoVendas.items;
      this.servicos = resultadoServicos.items;

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.id = id;
        const pagamento = await this.pagamentosApi.getById(id);
        this.form = {
          colaboradorId: pagamento.colaboradorId,
          vendaServicoId: pagamento.vendaServicoId,
          valor: pagamento.valor,
          status: pagamento.status,
          dataPagamento: pagamento.dataPagamento
        };
        const vendaServico = await this.vendaServicosApi.getById(pagamento.vendaServicoId);
        this.vendaSelecionadaId = vendaServico.vendaId;
        await this.carregarServicosDaVenda(vendaServico.vendaId);
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

  nomeServico(servicoId: string): string {
    return this.servicos.find(s => s.id === servicoId)?.nome ?? servicoId;
  }

  async onVendaSelecionada(): Promise<void> {
    this.form.vendaServicoId = '';
    await this.carregarServicosDaVenda(this.vendaSelecionadaId);
    this.cdr.markForCheck();
  }

  private async carregarServicosDaVenda(vendaId: string): Promise<void> {
    if (!vendaId) {
      this.servicosDaVenda = [];
      return;
    }
    try {
      this.servicosDaVenda = await this.vendaServicosApi.getByVenda(vendaId);
    } catch {
      this.servicosDaVenda = [];
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
      await this.router.navigateByUrl('/pagamentos-colaboradores');
    } catch {
      this.erro = 'Não foi possível salvar o pagamento (esse serviço já pode ter um pagamento vinculado).';
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
      await this.router.navigateByUrl('/pagamentos-colaboradores');
    } catch {
      this.erro = 'Não foi possível excluir o pagamento.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreatePagamentoColaboradorRequest {
    return {
      colaboradorId: '',
      vendaServicoId: '',
      valor: 0,
      status: 'pendente',
      dataPagamento: null
    };
  }
}
