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
import { CreatePlanoAssinaturaRequest } from '../../../services/planos-assinatura-api/requests/create-plano-assinatura-request';
import { PlanosAssinaturaApiService } from '../../../services/planos-assinatura-api/planos-assinatura-api.service';

@Component({
  selector: 'app-plano-detail',
  templateUrl: './plano-detail.component.html',
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
export class PlanoDetailComponent implements OnInit {
  id: string | null = null;
  form: CreatePlanoAssinaturaRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
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
      const plano = await this.planosApi.getById(id);
      this.form = {
        nome: plano.nome,
        descricao: plano.descricao,
        valorMensal: plano.valorMensal,
        ativo: plano.ativo
      };
    } catch {
      this.erro = 'Não foi possível carregar o plano.';
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
        await this.planosApi.update(this.id!, this.form);
      } else {
        await this.planosApi.create(this.form);
      }
      await this.router.navigateByUrl('/planos-assinatura');
    } catch {
      this.erro = 'Não foi possível salvar o plano.';
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
      await this.planosApi.delete(this.id);
      await this.router.navigateByUrl('/planos-assinatura');
    } catch {
      this.erro = 'Não foi possível excluir o plano.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreatePlanoAssinaturaRequest {
    return {
      nome: '',
      descricao: null,
      valorMensal: null,
      ativo: true
    };
  }
}
