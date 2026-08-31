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
import { CreateParceiroRequest } from '../../../services/parceiros-api/requests/create-parceiro-request';
import { ParceirosApiService } from '../../../services/parceiros-api/parceiros-api.service';

@Component({
  selector: 'app-parceiro-detail',
  templateUrl: './parceiro-detail.component.html',
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
export class ParceiroDetailComponent implements OnInit {
  id: string | null = null;
  form: CreateParceiroRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
    private parceirosApi: ParceirosApiService,
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
      const parceiro = await this.parceirosApi.getById(id);
      this.form = {
        nome: parceiro.nome,
        tipo: parceiro.tipo,
        telefone: parceiro.telefone,
        email: parceiro.email,
        percentualComissao: parceiro.percentualComissao
      };
    } catch {
      this.erro = 'Não foi possível carregar o parceiro.';
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
        await this.parceirosApi.update(this.id!, this.form);
      } else {
        await this.parceirosApi.create(this.form);
      }
      await this.router.navigateByUrl('/parceiros');
    } catch {
      this.erro = 'Não foi possível salvar o parceiro.';
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
      await this.parceirosApi.delete(this.id);
      await this.router.navigateByUrl('/parceiros');
    } catch {
      this.erro = 'Não foi possível excluir o parceiro.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreateParceiroRequest {
    return {
      nome: '',
      tipo: 'instalacao_hidraulica',
      telefone: null,
      email: null,
      percentualComissao: 0
    };
  }
}
