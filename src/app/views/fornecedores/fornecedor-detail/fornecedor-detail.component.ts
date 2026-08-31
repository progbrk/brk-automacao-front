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
import { CreateFornecedorRequest } from '../../../services/fornecedores-api/requests/create-fornecedor-request';
import { FornecedoresApiService } from '../../../services/fornecedores-api/fornecedores-api.service';

@Component({
  selector: 'app-fornecedor-detail',
  templateUrl: './fornecedor-detail.component.html',
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
export class FornecedorDetailComponent implements OnInit {
  id: string | null = null;
  form: CreateFornecedorRequest = this.formVazio();
  carregando = false;
  salvando = false;
  erro: string | null = null;

  constructor(
    private fornecedoresApi: FornecedoresApiService,
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
      const fornecedor = await this.fornecedoresApi.getById(id);
      this.form = {
        nome: fornecedor.nome,
        contato: fornecedor.contato,
        telefone: fornecedor.telefone,
        email: fornecedor.email
      };
    } catch {
      this.erro = 'Não foi possível carregar o fornecedor.';
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
        await this.fornecedoresApi.update(this.id!, this.form);
      } else {
        await this.fornecedoresApi.create(this.form);
      }
      await this.router.navigateByUrl('/fornecedores');
    } catch {
      this.erro = 'Não foi possível salvar o fornecedor.';
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
      await this.fornecedoresApi.delete(this.id);
      await this.router.navigateByUrl('/fornecedores');
    } catch {
      this.erro = 'Não foi possível excluir o fornecedor.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreateFornecedorRequest {
    return {
      nome: '',
      contato: null,
      telefone: null,
      email: null
    };
  }
}
