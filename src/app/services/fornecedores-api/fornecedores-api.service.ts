import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Fornecedor } from '../../models/fornecedor';
import { AuthService } from '../auth/auth.service';
import { PaginatedList } from '../responses/paginated-list';
import { ResponseBase } from '../responses/response-base';
import { CreateFornecedorRequest } from './requests/create-fornecedor-request';
import { GetFornecedoresPaginatedRequest } from './requests/get-fornecedores-paginated-request';
import { UpdateFornecedorRequest } from './requests/update-fornecedor-request';

@Injectable({
  providedIn: 'root'
})
export class FornecedoresApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/Fornecedores`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getAllPaginated(request: GetFornecedoresPaginatedRequest): Promise<PaginatedList<Fornecedor>> {
    const headers = this.auth.getAuthHeaders();
    const url = `${this.baseUrl}?pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`;
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PaginatedList<Fornecedor>>>(url, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<Fornecedor> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<Fornecedor>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreateFornecedorRequest): Promise<Fornecedor> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<Fornecedor>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async update(id: string, request: UpdateFornecedorRequest): Promise<Fornecedor> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.put<ResponseBase<Fornecedor>>(`${this.baseUrl}/${id}`, request, { headers })
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
