import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Produto } from '../../models/produto';
import { AuthService } from '../auth/auth.service';
import { PaginatedList } from '../responses/paginated-list';
import { ResponseBase } from '../responses/response-base';
import { CreateProdutoRequest } from './requests/create-produto-request';
import { GetProdutosPaginatedRequest } from './requests/get-produtos-paginated-request';
import { UpdateProdutoRequest } from './requests/update-produto-request';

@Injectable({
  providedIn: 'root'
})
export class ProdutosApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/Produtos`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getAllPaginated(request: GetProdutosPaginatedRequest): Promise<PaginatedList<Produto>> {
    const headers = this.auth.getAuthHeaders();
    const url = `${this.baseUrl}?pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`;
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PaginatedList<Produto>>>(url, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<Produto> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<Produto>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreateProdutoRequest): Promise<Produto> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<Produto>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async update(id: string, request: UpdateProdutoRequest): Promise<Produto> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.put<ResponseBase<Produto>>(`${this.baseUrl}/${id}`, request, { headers })
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    const headers = this.auth.getAuthHeaders();
    await firstValueFrom(
      this.http.delete<ResponseBase<boolean>>(`${this.baseUrl}/${id}`, { headers })
    );
  }

  async uploadFoto(id: string, arquivo: File): Promise<Produto> {
    const headers = this.auth.getAuthHeaders();
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    const response = await firstValueFrom(
      this.http.post<ResponseBase<Produto>>(`${this.baseUrl}/${id}/foto`, formData, { headers })
    );
    return response.data;
  }

  async removerFoto(id: string): Promise<Produto> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.delete<ResponseBase<Produto>>(`${this.baseUrl}/${id}/foto`, { headers })
    );
    return response.data;
  }

  urlFoto(produto: Produto): string | null {
    if (!produto.fotoUrl) {
      return null;
    }
    return `${environment.brkAutomacaoApi.replace(/\/api$/, '')}${produto.fotoUrl}`;
  }
}
