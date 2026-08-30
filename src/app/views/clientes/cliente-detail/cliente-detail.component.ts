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
  RowComponent
} from '@coreui/angular';
import { CreateClienteRequest } from '../../../services/clientes-api/requests/create-cliente-request';
import { ClientesApiService } from '../../../services/clientes-api/clientes-api.service';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
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
    FormsModule,
    RouterLink,
    RowComponent
  ]
})
export class ClienteDetailComponent implements OnInit {
  id: string | null = null;
  form: CreateClienteRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
    private clientesApi: ClientesApiService,
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
