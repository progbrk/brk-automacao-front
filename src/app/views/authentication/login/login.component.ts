import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  RowComponent
} from '@coreui/angular';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  host: {
    class: 'bg-body-tertiary min-vh-100 d-flex flex-row align-items-center'
  },
  imports: [
    AlertComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormsModule,
    RowComponent
  ]
})
export class LoginComponent {
  usuario = '';
  senha = '';
  erro: string | null = null;
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async entrar(): Promise<void> {
    this.erro = null;
    this.carregando = true;
    try {
      await this.authService.login(this.usuario, this.senha);
      await this.router.navigateByUrl('/dashboard');
    } catch (error) {
      this.erro = error instanceof Error ? error.message : 'Usuário ou senha inválidos.';
    } finally {
      this.carregando = false;
    }
  }
}
