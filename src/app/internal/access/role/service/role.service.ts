import { inject, Injectable } from "@angular/core";
import { PaginationResponse } from "@app/shared/components/data-table/types/pagination-response";
import { Role } from "../type/role.type";
import { HttpResponseBody, ServerClient } from "@app/core/http/client";
import { PaginationInterface } from "@app/shared/components/data-table/interface/pagination.interface";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { Observable } from "rxjs";

type PaginationRole = PaginationResponse<Role>;
type RolePaginationResponse = HttpResponseBody<PaginationRole>;
@Injectable()
export class RoleService implements PaginationInterface<Role>{

  private readonly client = inject(ServerClient);
  private readonly apiUrl = "role";

  paginateList(request: PaginationRequest): Observable<RolePaginationResponse> {
    return this.client.post<PaginationRequest, PaginationRole>(`${this.apiUrl}/list`, request);
  }

  create(request: Role): Observable<HttpResponseBody<Role>> {
    return this.client.post<Role, Role>(`${this.apiUrl}/create`, request);
  }

  update(request: Role): Observable<HttpResponseBody<Role>>{
    return this.client.put<Role, Role>(`${this.apiUrl}/update`, request);
  }

  delete(roleId:number):Observable<HttpResponseBody<void>> {
    return this.client.delete<void>(`${this.apiUrl}/delete/${roleId}`);
  }

}