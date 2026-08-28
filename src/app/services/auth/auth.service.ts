import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseBase } from '../responses/response-base';

const TOKEN_KEY = 'brkAutomacaoToken';

interface LoginRequest {
  usuario: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.brkAutomacaoApi;

  constructor(private http: HttpClient) {}

  async login(usuario: string, senha: string): Promise<void> {
    const request: LoginRequest = { usuario, senha };
    const response = await firstValueFrom(
      this.http.post<ResponseBase<string>>(`${this.baseUrl}/Login`, request)
    );
    if (!response.success) {
      throw new Error(response.message ?? 'Usuário ou senha inválidos.');
    }
    localStorage.setItem(TOKEN_KEY, response.data);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
