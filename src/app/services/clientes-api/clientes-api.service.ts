import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente } from '../../models/cliente';
import { AuthService } from '../auth/auth.service';
import { PaginatedList } from '../responses/paginated-list';
import { ResponseBase } from '../responses/response-base';
import { CreateClienteRequest } from './requests/create-cliente-request';
import { GetClientesPaginatedRequest } from './requests/get-clientes-paginated-request';
import { UpdateClienteRequest } from './requests/update-cliente-request';

@Injectable({
  providedIn: 'root'
})
export class ClientesApiService {
  private baseUrl = `${environment.brkAutomacaoApi}/Clientes`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async getAllPaginated(request: GetClientesPaginatedRequest): Promise<PaginatedList<Cliente>> {
    const headers = this.auth.getAuthHeaders();
    const url = `${this.baseUrl}?pageIndex=${request.pageIndex}&pageSize=${request.pageSize}`;
    const response = await firstValueFrom(
      this.http.get<ResponseBase<PaginatedList<Cliente>>>(url, { headers })
    );
    return response.data;
  }

  async getById(id: string): Promise<Cliente> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<ResponseBase<Cliente>>(`${this.baseUrl}/${id}`, { headers })
    );
    return response.data;
  }

  async create(request: CreateClienteRequest): Promise<Cliente> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<ResponseBase<Cliente>>(this.baseUrl, request, { headers })
    );
    return response.data;
  }

  async update(id: string, request: UpdateClienteRequest): Promise<Cliente> {
    const headers = this.auth.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.put<ResponseBase<Cliente>>(`${this.baseUrl}/${id}`, request, { headers })
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
