import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Colaborador } from '../../models/colaborador';
import { AuthService } from '../auth/auth.service';
import { PaginatedList } from '../responses/paginated-list';
import { ResponseBase } from '../responses/response-base';
import { CreateColaboradorRequest } from './requests/create-colaborador-request';
import { GetColaboradoresPaginatedRequest } from './requests/get-colaboradores-paginated-request';
import { UpdateColaboradorRequest } from './requests/update-colaborador-request';

@Injectable({
  providedIn: 'root'
})
export class ColaboradoresApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/Colaboradores`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getAllPaginated(request: GetColaboradoresPaginatedRequest): Promise<PaginatedList<Colaborador>> {
    const headers = this.auth.getAuthHeaders();
    const url = `${this.baseUrl}?pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`;
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PaginatedList<Colaborador>>>(url, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<Colaborador> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<Colaborador>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreateColaboradorRequest): Promise<Colaborador> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<Colaborador>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async update(id: string, request: UpdateColaboradorRequest): Promise<Colaborador> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.put<ResponseBase<Colaborador>>(`${this.baseUrl}/${id}`, request, { headers })
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
