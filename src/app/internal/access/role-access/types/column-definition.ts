import { ColumnDefinitions } from "@app/shared/components/data-table/types/data-table.types";
import { RoleAccess } from "./role-access.type";

export const columnDefinition: ColumnDefinitions<RoleAccess> = [
  {
    field: "accessName",
    header: "Access",
    allowFilter: true,
    allowSort: true,
    filterOptions: {
      fieldType: "string"
    }
  },
  {
    field: "roleName",
    header: "Role",
    allowFilter: true,
    allowSort: true,
    filterOptions: {
      fieldType: "string"
    }
  }
]