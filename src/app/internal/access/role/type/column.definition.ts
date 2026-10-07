import { ColumnDefinitions } from "@app/shared/components/data-table/types/data-table.types";
import { Role } from "./role.type";

export const roleColumnDefinition: ColumnDefinitions<Role> = [
  {
    field: "code",
    header: "Role Code",
    allowSort: true,
    allowFilter: true,
    filterOptions: {
      fieldType: "string"
    },
  },
  {
    field: "name",
    header: "Name",
    allowFilter: true,
    allowSort: true,
    filterOptions: {
      fieldType: "string"
    }
  },
  {
    field: "description",
    header: "Description",
    allowFilter: true,
    allowSort: true,
    filterOptions: {
      fieldType: "string"
    }
  }
];