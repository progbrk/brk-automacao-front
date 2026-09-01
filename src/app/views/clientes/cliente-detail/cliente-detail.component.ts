import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AlertComponent,
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { Assinatura } from '../../../models/assinatura';
import { Equipamento } from '../../../models/equipamento';
import { PlanoAssinatura } from '../../../models/plano-assinatura';
import { Venda } from '../../../models/venda';
import { AssinaturasApiService } from '../../../services/assinaturas-api/assinaturas-api.service';
import { CreateClienteRequest } from '../../../services/clientes-api/requests/create-cliente-request';
import { ClientesApiService } from '../../../services/clientes-api/clientes-api.service';
import { EquipamentosApiService } from '../../../services/equipamentos-api/equipamentos-api.service';
import { PlanosAssinaturaApiService } from '../../../services/planos-assinatura-api/planos-assinatura-api.service';
import { VendasApiService } from '../../../services/vendas-api/vendas-api.service';

const HISTORICO_PAGE_SIZE = 200;

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
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
    FormDirective,
    FormLabelDirective,
    FormsModule,
    RouterLink,
    RowComponent,
    TableDirective
  ]
})
export class ClienteDetailComponent implements OnInit {
  id: string | null = null;
  form: CreateClienteRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  vendas: Venda[] = [];
  equipamentos: Equipamento[] = [];
  assinaturas: Assinatura[] = [];
  planos: PlanoAssinatura[] = [];
  carregandoHistorico = false;

  constructor(
    private clientesApi: ClientesApiService,
    private vendasApi: VendasApiService,
    private equipamentosApi: EquipamentosApiService,
    private assinaturasApi: AssinaturasApiService,
    private planosApi: PlanosAssinaturaApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get isEdicao(): boolean {
    return this.id !== null;
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.id = id;
    this.carregando = true;
    try {
      const cliente = await this.clientesApi.getById(id);
      this.form = {
        nome: cliente.nome,
        cpfCnpj: cliente.cpfCnpj,
        telefone: cliente.telefone,
        email: cliente.email,
        endereco: cliente.endereco,
        cidade: cliente.cidade,
        estado: cliente.estado,
        cep: cliente.cep,
        observacoes: cliente.observacoes
      };
    } catch {
      this.erro = 'Não foi possível carregar o cliente.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }

    await this.carregarHistorico(id);
  }

  private async carregarHistorico(clienteId: string): Promise<void> {
    this.carregandoHistorico = true;
    try {
      const [vendas, equipamentos, assinaturas, planos] = await Promise.all([
        this.vendasApi.getAllPaginated({ pageIndex: 1, pageSize: HISTORICO_PAGE_SIZE }),
        this.equipamentosApi.getAllPaginated({ pageIndex: 1, pageSize: HISTORICO_PAGE_SIZE }),
        this.assinaturasApi.getAllPaginated({ pageIndex: 1, pageSize: HISTORICO_PAGE_SIZE }),
        this.planosApi.getAllPaginated({ pageIndex: 1, pageSize: HISTORICO_PAGE_SIZE })
      ]);
      this.vendas = vendas.items.filter(v => v.clienteId === clienteId);
      this.equipamentos = equipamentos.items.filter(e => e.clienteId === clienteId);
      this.assinaturas = assinaturas.items.filter(a => a.clienteId === clienteId);
      this.planos = planos.items;
    } catch {
      // Histórico é informativo — se falhar, o formulário de edição do cliente continua funcionando.
    } finally {
      this.carregandoHistorico = false;
      this.cdr.markForCheck();
    }
  }

  nomePlano(planoId: string): string {
    return this.planos.find(p => p.id === planoId)?.nome ?? planoId;
  }

  abrirVenda(id: string): void {
    this.router.navigate(['/vendas', id]);
  }

  abrirEquipamento(id: string): void {
    this.router.navigate(['/equipamentos', id]);
  }

  abrirAssinatura(id: string): void {
    this.router.navigate(['/assinaturas', id]);
  }

  corStatus(status: string): string {
    switch (status) {
      case 'instalada':
      case 'ativa':
      case 'ativo':
        return 'success';
      case 'confirmada':
        return 'info';
      case 'cancelada':
      case 'suspensa':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  async salvar(): Promise<void> {
    this.salvando = true;
    this.erro = null;
    try {
      if (this.isEdicao) {
        await this.clientesApi.update(this.id!, this.form);
      } else {
        await this.clientesApi.create(this.form);
      }
      await this.router.navigateByUrl('/clientes');
    } catch {
      this.erro = 'Não foi possível salvar o cliente.';
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
      await this.clientesApi.delete(this.id);
      await this.router.navigateByUrl('/clientes');
    } catch {
      this.erro = 'Não foi possível excluir o cliente.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreateClienteRequest {
    return {
      nome: '',
      cpfCnpj: null,
      telefone: null,
      email: null,
      endereco: null,
      cidade: null,
      estado: null,
      cep: null,
      observacoes: null
    };
  }
}
