import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResponseBody, ServerClient } from "@app/core/http/client";
import { Role } from "@app/internal/access/role/type/role.type";
import { PaginationInterface } from "@app/shared/components/data-table/interface/pagination.interface";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { PaginationResponse } from "@app/shared/components/data-table/types/pagination-response";
import { AssignUserRole, PaginationUser, User, UserPaginationResponse, UserResponse } from "../type/user.type";

type PaginationRole = PaginationResponse<Role>;
type RolePaginationResponse = HttpResponseBody<PaginationRole>;

@Injectable()
export class UserService implements PaginationInterface<User> {

  private readonly client = inject(ServerClient);
  private readonly apiUrl = "user";

  paginateList(request: PaginationRequest): Observable<UserPaginationResponse> {
    return this.client.post<PaginationRequest, PaginationUser>(`${this.apiUrl}/list`, request);
  }

  create(request: User): Observable<UserResponse> {
    return this.client.post<User, User>(`${this.apiUrl}/create`, request);
  }

  update(request: User): Observable<UserResponse> {
    return this.client.put<User, User>(`${this.apiUrl}/update`, request);
  }

  delete(userId: number): Observable<HttpResponseBody<void>> {
    return this.client.delete<void>(`${this.apiUrl}/delete/${userId}`);
  }

  assignUserRole(request: AssignUserRole): Observable<HttpResponseBody<void>> {
    return this.client.post<AssignUserRole, void>(`${this.apiUrl}/assign-role`, request);
  }

  getUserRoles(userId: number): Observable<HttpResponseBody<Role[]>> {
    return this.client.get<Role[]>(`${this.apiUrl}/user-roles/${userId}`);
  }

  roleList(request: PaginationRequest): Observable<RolePaginationResponse> {
    return this.client.post<PaginationRequest, PaginationRole>("role/list", request);
  }
}
