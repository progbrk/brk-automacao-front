import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Servico } from '../../models/servico';
import { AuthService } from '../auth/auth.service';
import { PaginatedList } from '../responses/paginated-list';
import { ResponseBase } from '../responses/response-base';
import { CreateServicoRequest } from './requests/create-servico-request';
import { GetServicosPaginatedRequest } from './requests/get-servicos-paginated-request';
import { UpdateServicoRequest } from './requests/update-servico-request';

@Injectable({
  providedIn: 'root'
})
export class ServicosApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/Servicos`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getAllPaginated(request: GetServicosPaginatedRequest): Promise<PaginatedList<Servico>> {
    const headers = this.auth.getAuthHeaders();
    const url = `${this.baseUrl}?pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`;
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PaginatedList<Servico>>>(url, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<Servico> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<Servico>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreateServicoRequest): Promise<Servico> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<Servico>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async update(id: string, request: UpdateServicoRequest): Promise<Servico> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.put<ResponseBase<Servico>>(`${this.baseUrl}/${id}`, request, { headers })
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
