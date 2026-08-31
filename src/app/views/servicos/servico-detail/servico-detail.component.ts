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
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  RowComponent
} from '@coreui/angular';
import { CreateServicoRequest } from '../../../services/servicos-api/requests/create-servico-request';
import { ServicosApiService } from '../../../services/servicos-api/servicos-api.service';

@Component({
  selector: 'app-servico-detail',
  templateUrl: './servico-detail.component.html',
  imports: [
    AlertComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormsModule,
    RouterLink,
    RowComponent
  ]
})
export class ServicoDetailComponent implements OnInit {
  id: string | null = null;
  form: CreateServicoRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
    private servicosApi: ServicosApiService,
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
      const servico = await this.servicosApi.getById(id);
      this.form = {
        nome: servico.nome,
        descricao: servico.descricao,
        preco: servico.preco,
        ativo: servico.ativo
      };
    } catch {
      this.erro = 'Não foi possível carregar o serviço.';
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
        await this.servicosApi.update(this.id!, this.form);
      } else {
        await this.servicosApi.create(this.form);
      }
      await this.router.navigateByUrl('/servicos');
    } catch {
      this.erro = 'Não foi possível salvar o serviço.';
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
      await this.servicosApi.delete(this.id);
      await this.router.navigateByUrl('/servicos');
    } catch {
      this.erro = 'Não foi possível excluir o serviço.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreateServicoRequest {
    return {
      nome: '',
      descricao: null,
      preco: null,
      ativo: true
    };
  }
}
