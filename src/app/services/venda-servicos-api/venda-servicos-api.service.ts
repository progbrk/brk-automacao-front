import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VendaServico } from '../../models/venda-servico';
import { AuthService } from '../auth/auth.service';
import { ResponseBase } from '../responses/response-base';
import { CreateVendaServicoRequest } from './requests/create-venda-servico-request';

@Injectable({
  providedIn: 'root'
})
export class VendaServicosApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/VendaServicos`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getByVenda(vendaId: string): Promise<VendaServico[]> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<VendaServico[]>>(`${this.baseUrl}/venda/${vendaId}`, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<VendaServico> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<VendaServico>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreateVendaServicoRequest): Promise<VendaServico> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<VendaServico>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    const headers = this.auth.getAuthHeaders();
    await firstValueFrom(
      this.http.delete<ResponseBase<boolean>>(`${this.baseUrl}/${id}`, { headers })
    );
  }
}
