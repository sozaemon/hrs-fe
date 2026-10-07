import { RecordType } from "@app/shared/components/data-table/types/pagination-response";

export interface RoleAccess extends Record<string, RecordType> {
  accessId: number;
  roleId: number;
  roleName?: string;
  accessName?: string;
}

export interface AssignRolesToAccessRequest {
  accessId: number;
  roleIds: number[];
}