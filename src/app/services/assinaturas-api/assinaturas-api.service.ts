import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Assinatura } from '../../models/assinatura';
import { AuthService } from '../auth/auth.service';
import { PaginatedList } from '../responses/paginated-list';
import { ResponseBase } from '../responses/response-base';
import { CreateAssinaturaRequest } from './requests/create-assinatura-request';
import { GetAssinaturasPaginatedRequest } from './requests/get-assinaturas-paginated-request';
import { UpdateAssinaturaRequest } from './requests/update-assinatura-request';

@Injectable({
  providedIn: 'root'
})
export class AssinaturasApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/Assinaturas`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getAllPaginated(request: GetAssinaturasPaginatedRequest): Promise<PaginatedList<Assinatura>> {
    const headers = this.auth.getAuthHeaders();
    const url = `${this.baseUrl}?pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`;
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PaginatedList<Assinatura>>>(url, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<Assinatura> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<Assinatura>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreateAssinaturaRequest): Promise<Assinatura> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<Assinatura>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async update(id: string, request: UpdateAssinaturaRequest): Promise<Assinatura> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.put<ResponseBase<Assinatura>>(`${this.baseUrl}/${id}`, request, { headers })
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
