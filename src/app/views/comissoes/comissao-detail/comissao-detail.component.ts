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
import { Parceiro } from '../../../models/parceiro';
import { Venda } from '../../../models/venda';
import { ComissoesApiService } from '../../../services/comissoes-api/comissoes-api.service';
import { CreateComissaoRequest } from '../../../services/comissoes-api/requests/create-comissao-request';
import { ParceirosApiService } from '../../../services/parceiros-api/parceiros-api.service';
import { VendasApiService } from '../../../services/vendas-api/vendas-api.service';

const REF_PAGE_SIZE = 200;

@Component({
  selector: 'app-comissao-detail',
  templateUrl: './comissao-detail.component.html',
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
export class ComissaoDetailComponent implements OnInit {
  id: string | null = null;
  parceiros: Parceiro[] = [];
  vendas: Venda[] = [];
  form: CreateComissaoRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
    private comissoesApi: ComissoesApiService,
    private parceirosApi: ParceirosApiService,
    private vendasApi: VendasApiService,
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
      const [resultadoParceiros, resultadoVendas] = await Promise.all([
        this.parceirosApi.getAllPaginated({ pageIndex: 1, pageSize: REF_PAGE_SIZE }),
        this.vendasApi.getAllPaginated({ pageIndex: 1, pageSize: REF_PAGE_SIZE })
      ]);
      this.parceiros = resultadoParceiros.items;
      this.vendas = resultadoVendas.items;

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.id = id;
        const comissao = await this.comissoesApi.getById(id);
        this.form = {
          parceiroId: comissao.parceiroId,
          vendaId: comissao.vendaId,
          valor: comissao.valor,
          status: comissao.status,
          dataPagamento: comissao.dataPagamento
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

  onReferenciaSelecionada(): void {
    const parceiro = this.parceiros.find(p => p.id === this.form.parceiroId);
    const venda = this.vendas.find(v => v.id === this.form.vendaId);
    if (parceiro && venda) {
      this.form.valor = Math.round(venda.valor * (parceiro.percentualComissao / 100) * 100) / 100;
    }
  }

  async salvar(): Promise<void> {
    this.salvando = true;
    this.erro = null;
    try {
      if (this.isEdicao) {
        await this.comissoesApi.update(this.id!, this.form);
      } else {
        await this.comissoesApi.create(this.form);
      }
      await this.router.navigateByUrl('/comissoes');
    } catch {
      this.erro = 'Não foi possível salvar a comissão.';
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
      await this.comissoesApi.delete(this.id);
      await this.router.navigateByUrl('/comissoes');
    } catch {
      this.erro = 'Não foi possível excluir a comissão.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreateComissaoRequest {
    return {
      parceiroId: '',
      vendaId: '',
      valor: 0,
      status: 'pendente',
      dataPagamento: null
    };
  }
}
