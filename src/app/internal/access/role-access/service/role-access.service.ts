import { inject, Injectable } from "@angular/core";
import { HttpResponseBody, ServerClient } from "@app/core/http/client";
import { PaginationInterface } from "@app/shared/components/data-table/interface/pagination.interface";
import { AssignRolesToAccessRequest, RoleAccess } from "../types/role-access.type";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { PaginationResponse } from "@app/shared/components/data-table/types/pagination-response";
import { Observable } from "rxjs";

type PaginationRoleAccess = PaginationResponse<RoleAccess>;
type RoleAccessPaginationResponse = HttpResponseBody<PaginationRoleAccess>;
type RoleAccessResponse = HttpResponseBody<RoleAccess>

@Injectable()
export class RoleAccessService implements PaginationInterface<RoleAccess> {

  private readonly client = inject(ServerClient);
  private readonly apiUrl = "role-access";

  paginateList(request: PaginationRequest): Observable<RoleAccessPaginationResponse> {
    return this.client.post<PaginationRequest, PaginationRoleAccess>(`${this.apiUrl}/list`, request);
  }

  removeRoleAccess(roleAccessId: number): Observable<HttpResponseBody<void>> {
    return this.client.delete<string>(`${this.apiUrl}/${roleAccessId}`);
  }

  assignAccess(request: RoleAccess): Observable<RoleAccessResponse> {
    return this.client.post<RoleAccess, RoleAccess>(`${this.apiUrl}/create`, request);
  }

  assignRoleAccess(request: AssignRolesToAccessRequest): Observable<HttpResponseBody<RoleAccess[]>> {
    return this.client.post<AssignRolesToAccessRequest, RoleAccess[]>(`${this.apiUrl}/assign-roles`, request);
  }

}