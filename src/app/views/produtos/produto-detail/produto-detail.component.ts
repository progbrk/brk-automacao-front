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
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  RowComponent
} from '@coreui/angular';
import { Produto } from '../../../models/produto';
import { CreateProdutoRequest } from '../../../services/produtos-api/requests/create-produto-request';
import { ProdutosApiService } from '../../../services/produtos-api/produtos-api.service';

@Component({
  selector: 'app-produto-detail',
  templateUrl: './produto-detail.component.html',
  imports: [
    AlertComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    CommonModule,
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
export class ProdutoDetailComponent implements OnInit {
  id: string | null = null;
  produto: Produto | null = null;
  form: CreateProdutoRequest = this.formVazio();
  carregando = false;
  salvando = false;
  enviandoFoto = false;
  zoomAberto = false;
  erro: string | null = null;

  constructor(
    private produtosApi: ProdutosApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get isEdicao(): boolean {
    return this.id !== null;
  }

  get urlFoto(): string | null {
    return this.produto ? this.produtosApi.urlFoto(this.produto) : null;
  }

  abrirZoom(): void {
    this.zoomAberto = true;
  }

  fecharZoom(): void {
    this.zoomAberto = false;
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.id = id;
    this.carregando = true;
    try {
      await this.recarregarProduto(id);
    } catch {
      this.erro = 'Não foi possível carregar o produto.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  private async recarregarProduto(id: string): Promise<void> {
    const produto = await this.produtosApi.getById(id);
    this.produto = produto;
    this.form = {
      nome: produto.nome,
      descricao: produto.descricao,
      precoVenda: produto.precoVenda,
      custoBase: produto.custoBase,
      ativo: produto.ativo
    };
  }

  async salvar(): Promise<void> {
    this.salvando = true;
    this.erro = null;
    try {
      if (this.isEdicao) {
        await this.produtosApi.update(this.id!, this.form);
        await this.router.navigateByUrl('/produtos');
      } else {
        const criado = await this.produtosApi.create(this.form);
        await this.router.navigateByUrl(`/produtos/${criado.id}`);
      }
    } catch {
      this.erro = 'Não foi possível salvar o produto.';
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
      await this.produtosApi.delete(this.id);
      await this.router.navigateByUrl('/produtos');
    } catch {
      this.erro = 'Não foi possível excluir o produto.';
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  async selecionarFoto(evento: Event): Promise<void> {
    if (!this.id) {
      return;
    }
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) {
      return;
    }
    this.enviandoFoto = true;
    this.erro = null;
    try {
      this.produto = await this.produtosApi.uploadFoto(this.id, arquivo);
    } catch {
      this.erro = 'Não foi possível enviar a foto. Use JPEG, PNG ou WEBP de até 5MB.';
    } finally {
      this.enviandoFoto = false;
      input.value = '';
      this.cdr.markForCheck();
    }
  }

  async removerFoto(): Promise<void> {
    if (!this.id) {
      return;
    }
    this.enviandoFoto = true;
    try {
      this.produto = await this.produtosApi.removerFoto(this.id);
    } catch {
      this.erro = 'Não foi possível remover a foto.';
    } finally {
      this.enviandoFoto = false;
      this.cdr.markForCheck();
    }
  }

  private formVazio(): CreateProdutoRequest {
    return {
      nome: '',
      descricao: null,
      precoVenda: null,
      custoBase: null,
      ativo: true
    };
  }
}
