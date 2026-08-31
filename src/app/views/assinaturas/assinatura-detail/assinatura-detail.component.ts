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
import { Cliente } from '../../../models/cliente';
import { PlanoAssinatura } from '../../../models/plano-assinatura';
import { AssinaturasApiService } from '../../../services/assinaturas-api/assinaturas-api.service';
import { CreateAssinaturaRequest } from '../../../services/assinaturas-api/requests/create-assinatura-request';
import { ClientesApiService } from '../../../services/clientes-api/clientes-api.service';
import { PlanosAssinaturaApiService } from '../../../services/planos-assinatura-api/planos-assinatura-api.service';

const CLIENTES_PAGE_SIZE = 200;
const PLANOS_PAGE_SIZE = 200;

@Component({
  selector: 'app-assinatura-detail',
  templateUrl: './assinatura-detail.component.html',
  imports: [
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
    FormsModule,
    RouterLink,
    RowComponent
  ]
})
export class AssinaturaDetailComponent implements OnInit {
  id: string | null = null;
  clientes: Cliente[] = [];
  planos: PlanoAssinatura[] = [];
  form: CreateAssinaturaRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
    private assinaturasApi: AssinaturasApiService,
    private clientesApi: ClientesApiService,
    private planosApi: PlanosAssinaturaApiService,
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
      const [resultadoClientes, resultadoPlanos] = await Promise.all([
        this.clientesApi.getAllPaginated({ pageIndex: 1, pageSize: CLIENTES_PAGE_SIZE }),
        this.planosApi.getAllPaginated({ pageIndex: 1, pageSize: PLANOS_PAGE_SIZE })
      ]);
      this.clientes = resultadoClientes.items;
      this.planos = resultadoPlanos.items;

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.id = id;
        const assinatura = await this.assinaturasApi.getById(id);
        this.form = {
          clienteId: assinatura.clienteId,
          vendaId: assinatura.vendaId,
          planoId: assinatura.planoId,
          valorMensal: assinatura.valorMensal,
          diaCobranca: assinatura.diaCobranca,
          status: assinatura.status,
          dataInicio: assinatura.dataInicio,
          dataFim: assinatura.dataFim
        };
      }
    } catch {
      this.erro = 'Não foi possível carregar os dados.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  onPlanoSelecionado(): void {
    const plano = this.planos.find(p => p.id === this.form.planoId);
    if (plano?.valorMensal != null) {
      this.form.valorMensal = plano.valorMensal;
    }
  }

  async salvar(): Promise<void> {
    this.salvando = true;
    this.erro = null;
    try {
      if (this.isEdicao) {
        await this.assinaturasApi.update(this.id!, this.form);
      } else {
        await this.assinaturasApi.create(this.form);
      }
      await this.router.navigateByUrl('/assinaturas');
    } catch {
      this.erro = 'Não foi possível salvar a assinatura.';
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
      await this.assinaturasApi.delete(this.id);
      await this.router.navigateByUrl('/assinaturas');
    } catch {
      this.erro = 'Não foi possível excluir a assinatura.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreateAssinaturaRequest {
    return {
      clienteId: '',
      vendaId: null,
      planoId: '',
      valorMensal: 0,
      diaCobranca: 10,
      status: 'ativa',
      dataInicio: null,
      dataFim: null
    };
  }
}
