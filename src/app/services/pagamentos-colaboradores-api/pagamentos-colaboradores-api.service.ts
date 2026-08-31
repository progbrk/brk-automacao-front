import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagamentoColaborador } from '../../models/pagamento-colaborador';
import { AuthService } from '../auth/auth.service';
import { PaginatedList } from '../responses/paginated-list';
import { ResponseBase } from '../responses/response-base';
import { CreatePagamentoColaboradorRequest } from './requests/create-pagamento-colaborador-request';
import { GetPagamentosColaboradoresPaginatedRequest } from './requests/get-pagamentos-colaboradores-paginated-request';
import { UpdatePagamentoColaboradorRequest } from './requests/update-pagamento-colaborador-request';

@Injectable({
  providedIn: 'root'
})
export class PagamentosColaboradoresApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/PagamentosColaboradores`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getAllPaginated(request: GetPagamentosColaboradoresPaginatedRequest): Promise<PaginatedList<PagamentoColaborador>> {
    const headers = this.auth.getAuthHeaders();
    const url = `${this.baseUrl}?pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`;
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PaginatedList<PagamentoColaborador>>>(url, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<PagamentoColaborador> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PagamentoColaborador>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreatePagamentoColaboradorRequest): Promise<PagamentoColaborador> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<PagamentoColaborador>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async update(id: string, request: UpdatePagamentoColaboradorRequest): Promise<PagamentoColaborador> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.put<ResponseBase<PagamentoColaborador>>(`${this.baseUrl}/${id}`, request, { headers })
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
