import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlanoAssinatura } from '../../models/plano-assinatura';
import { AuthService } from '../auth/auth.service';
import { PaginatedList } from '../responses/paginated-list';
import { ResponseBase } from '../responses/response-base';
import { CreatePlanoAssinaturaRequest } from './requests/create-plano-assinatura-request';
import { GetPlanosAssinaturaPaginatedRequest } from './requests/get-planos-assinatura-paginated-request';
import { UpdatePlanoAssinaturaRequest } from './requests/update-plano-assinatura-request';

@Injectable({
  providedIn: 'root'
})
export class PlanosAssinaturaApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/PlanosAssinatura`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getAllPaginated(request: GetPlanosAssinaturaPaginatedRequest): Promise<PaginatedList<PlanoAssinatura>> {
    const headers = this.auth.getAuthHeaders();
    const url = `${this.baseUrl}?pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`;
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PaginatedList<PlanoAssinatura>>>(url, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<PlanoAssinatura> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PlanoAssinatura>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreatePlanoAssinaturaRequest): Promise<PlanoAssinatura> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<PlanoAssinatura>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async update(id: string, request: UpdatePlanoAssinaturaRequest): Promise<PlanoAssinatura> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.put<ResponseBase<PlanoAssinatura>>(`${this.baseUrl}/${id}`, request, { headers })
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
