import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pagamento } from '../../models/pagamento';
import { AuthService } from '../auth/auth.service';
import { PaginatedList } from '../responses/paginated-list';
import { ResponseBase } from '../responses/response-base';
import { CreatePagamentoRequest } from './requests/create-pagamento-request';
import { GetPagamentosPaginatedRequest } from './requests/get-pagamentos-paginated-request';
import { UpdatePagamentoRequest } from './requests/update-pagamento-request';

@Injectable({
  providedIn: 'root'
})
export class PagamentosApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/Pagamentos`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getAllPaginated(request: GetPagamentosPaginatedRequest): Promise<PaginatedList<Pagamento>> {
    const headers = this.auth.getAuthHeaders();
    const url = `${this.baseUrl}?pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`;
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PaginatedList<Pagamento>>>(url, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<Pagamento> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<Pagamento>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreatePagamentoRequest): Promise<Pagamento> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<Pagamento>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async update(id: string, request: UpdatePagamentoRequest): Promise<Pagamento> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.put<ResponseBase<Pagamento>>(`${this.baseUrl}/${id}`, request, { headers })
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
