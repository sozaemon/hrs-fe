import { inject, Injectable } from "@angular/core";
import { ServerClient } from "@app/core/http/client";

import { Observable } from "rxjs";
import { Access, AccessPaginationResponse, AccessResponse, PaginationAccess, RolePaginationResponse } from "@app/internal/access/access/types/access.type";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { PaginationInterface } from "@app/shared/components/data-table/interface/pagination.interface";

@Injectable()
export class AccessService implements PaginationInterface<Access> {

  private readonly client = inject(ServerClient);
  private readonly apiUrl = "access";

  paginateList(request: PaginationRequest): Observable<AccessPaginationResponse> {
    return this.client.post<PaginationRequest, PaginationAccess>(`${this.apiUrl}/list`, request);
  }

  createAccess(request: Access): Observable<AccessResponse> {
    return this.client.post<Access, Access>(`${this.apiUrl}/create`, request);
  }

  updateAccess(request: Access): Observable<AccessResponse> {
    return this.client.put<Access, Access>(`${this.apiUrl}/update`, request);
  }

  roleList(request: PaginationRequest): Observable<RolePaginationResponse> {
    return this.client.post("role/list", request);
  }
}