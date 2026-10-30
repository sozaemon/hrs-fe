import { ColumnDefinitions } from "@app/shared/components/data-table/types/data-table.types";
import { UploadedRoleAccess } from "./upload-role-access.type";

export const columnDefinition: ColumnDefinitions<UploadedRoleAccess> = [
  {
    field: "moduleName",
    header: "Module Name",
    allowSort: true,
    allowFilter: true,
    filterOptions: {
      fieldType: "string"
    }
  },
  {
    field: "status",
    header: "Status",
    allowFilter: true,
    filterOptions: {
      fieldType: "string",
      filterValueOptions: ["UPLOADED", "PROCESSING", "COMPLETE"]
    }
  },
  {
    field: "description",
    header: "Description",
    allowSort: true,
    allowFilter: true,
    filterOptions: {
      fieldType: "string"
    }
  }
];
