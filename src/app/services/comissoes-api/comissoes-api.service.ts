import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comissao } from '../../models/comissao';
import { AuthService } from '../auth/auth.service';
import { PaginatedList } from '../responses/paginated-list';
import { ResponseBase } from '../responses/response-base';
import { CreateComissaoRequest } from './requests/create-comissao-request';
import { GetComissoesPaginatedRequest } from './requests/get-comissoes-paginated-request';
import { UpdateComissaoRequest } from './requests/update-comissao-request';

@Injectable({
  providedIn: 'root'
})
export class ComissoesApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/Comissoes`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getAllPaginated(request: GetComissoesPaginatedRequest): Promise<PaginatedList<Comissao>> {
    const headers = this.auth.getAuthHeaders();
    const url = `${this.baseUrl}?pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`;
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PaginatedList<Comissao>>>(url, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<Comissao> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<Comissao>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreateComissaoRequest): Promise<Comissao> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<Comissao>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async update(id: string, request: UpdateComissaoRequest): Promise<Comissao> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.put<ResponseBase<Comissao>>(`${this.baseUrl}/${id}`, request, { headers })
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
