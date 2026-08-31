import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VendaItem } from '../../models/venda-item';
import { AuthService } from '../auth/auth.service';
import { ResponseBase } from '../responses/response-base';
import { CreateVendaItemRequest } from './requests/create-venda-item-request';

@Injectable({
  providedIn: 'root'
})
export class VendaItensApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/VendaItens`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getByVenda(vendaId: string): Promise<VendaItem[]> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<VendaItem[]>>(`${this.baseUrl}/venda/${vendaId}`, { headers })
    );
    return response.data;
  }

  async create(request: CreateVendaItemRequest): Promise<VendaItem> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<VendaItem>>(this.baseUrl, request, { headers })
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
