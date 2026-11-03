import { HttpResponseBody } from "@app/core/http/client";
import { PaginationResponse, RecordType } from "@app/shared/components/data-table/types/pagination-response";

export interface User extends Record<string, RecordType> {
  id?: number;
  userName: string;
  email: string;
  fullName: string;
  expiryDate?: string | Date;
  plainPassword?: string;
}

export interface AssignUserRole {
  userId: number;
  roleId: number[];
}

export type PaginationUser = PaginationResponse<User>;
export type UserPaginationResponse = HttpResponseBody<PaginationUser>;
export type UserResponse = HttpResponseBody<User>;
