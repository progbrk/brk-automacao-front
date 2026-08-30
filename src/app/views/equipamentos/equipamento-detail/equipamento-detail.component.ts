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
import { ClientesApiService } from '../../../services/clientes-api/clientes-api.service';
import { CreateEquipamentoRequest } from '../../../services/equipamentos-api/requests/create-equipamento-request';
import { EquipamentosApiService } from '../../../services/equipamentos-api/equipamentos-api.service';

const CLIENTES_PAGE_SIZE = 200;

@Component({
  selector: 'app-equipamento-detail',
  templateUrl: './equipamento-detail.component.html',
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
export class EquipamentoDetailComponent implements OnInit {
  id: string | null = null;
  clientes: Cliente[] = [];
  form: CreateEquipamentoRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
    private equipamentosApi: EquipamentosApiService,
    private clientesApi: ClientesApiService,
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
      const resultadoClientes = await this.clientesApi.getAllPaginated({ pageIndex: 1, pageSize: CLIENTES_PAGE_SIZE });
      this.clientes = resultadoClientes.items;

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.id = id;
        const equipamento = await this.equipamentosApi.getById(id);
        this.form = {
          clienteId: equipamento.clienteId,
          tipoDispositivo: equipamento.tipoDispositivo,
          identificador: equipamento.identificador,
          ipVpn: equipamento.ipVpn,
          status: equipamento.status,
          dataInstalacao: equipamento.dataInstalacao
        };
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
        await this.equipamentosApi.update(this.id!, this.form);
      } else {
        await this.equipamentosApi.create(this.form);
      }
      await this.router.navigateByUrl('/equipamentos');
    } catch {
      this.erro = 'Não foi possível salvar o equipamento.';
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
      await this.equipamentosApi.delete(this.id);
      await this.router.navigateByUrl('/equipamentos');
    } catch {
      this.erro = 'Não foi possível excluir o equipamento.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreateEquipamentoRequest {
    return {
      clienteId: '',
      tipoDispositivo: 'KC868-A16',
      identificador: null,
      ipVpn: null,
      status: 'ativo',
      dataInstalacao: null
    };
  }
}
