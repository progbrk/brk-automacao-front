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
  FormSelectDirective,
  RowComponent
} from '@coreui/angular';
import { ColaboradoresApiService } from '../../../services/colaboradores-api/colaboradores-api.service';
import { CreateColaboradorRequest } from '../../../services/colaboradores-api/requests/create-colaborador-request';

@Component({
  selector: 'app-colaborador-detail',
  templateUrl: './colaborador-detail.component.html',
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
    FormSelectDirective,
    FormsModule,
    RouterLink,
    RowComponent
  ]
})
export class ColaboradorDetailComponent implements OnInit {
  id: string | null = null;
  form: CreateColaboradorRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
    private colaboradoresApi: ColaboradoresApiService,
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
      const colaborador = await this.colaboradoresApi.getById(id);
      this.form = {
        nome: colaborador.nome,
        cargo: colaborador.cargo,
        tipo: colaborador.tipo,
        cpfCnpj: colaborador.cpfCnpj,
        telefone: colaborador.telefone,
        email: colaborador.email,
        ativo: colaborador.ativo
      };
    } catch {
      this.erro = 'Não foi possível carregar o colaborador.';
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
        await this.colaboradoresApi.update(this.id!, this.form);
      } else {
        await this.colaboradoresApi.create(this.form);
      }
      await this.router.navigateByUrl('/colaboradores');
    } catch {
      this.erro = 'Não foi possível salvar o colaborador.';
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
      await this.colaboradoresApi.delete(this.id);
      await this.router.navigateByUrl('/colaboradores');
    } catch {
      this.erro = 'Não foi possível excluir o colaborador.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreateColaboradorRequest {
    return {
      nome: '',
      cargo: null,
      tipo: 'Interno',
      cpfCnpj: null,
      telefone: null,
      email: null,
      ativo: true
    };
  }
}
