import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Equipamento } from '../../models/equipamento';
import { AuthService } from '../auth/auth.service';
import { PaginatedList } from '../responses/paginated-list';
import { ResponseBase } from '../responses/response-base';
import { CreateEquipamentoRequest } from './requests/create-equipamento-request';
import { GetEquipamentosPaginatedRequest } from './requests/get-equipamentos-paginated-request';
import { UpdateEquipamentoRequest } from './requests/update-equipamento-request';

@Injectable({
  providedIn: 'root'
})
export class EquipamentosApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/Equipamentos`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getAllPaginated(request: GetEquipamentosPaginatedRequest): Promise<PaginatedList<Equipamento>> {
    const headers = this.auth.getAuthHeaders();
    const url = `${this.baseUrl}?pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`;
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PaginatedList<Equipamento>>>(url, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<Equipamento> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<Equipamento>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreateEquipamentoRequest): Promise<Equipamento> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<Equipamento>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async update(id: string, request: UpdateEquipamentoRequest): Promise<Equipamento> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.put<ResponseBase<Equipamento>>(`${this.baseUrl}/${id}`, request, { headers })
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
