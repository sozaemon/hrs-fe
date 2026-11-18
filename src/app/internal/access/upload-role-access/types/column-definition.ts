import { ColumnDefinitions } from "@app/shared/components/data-table/types/data-table.types";
import { UploadedRoleAccess } from "./upload-role-access.type";
import { format } from 'date-fns';

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
    field: "created",
    header: "Created Date",
    allowSort: true,
    allowFilter: true,
    columnFn(row: UploadedRoleAccess) {
      return format(new Date(row.created), 'dd/MM/yyyy HH:mm');
    },
    filterOptions: {
      fieldType: "date"
    }
  },
  {
    field: "updated",
    header: "Updated Date",
    allowSort: true,
    allowFilter: true,
    columnFn(row: UploadedRoleAccess) {
      if (row.updated) {
        return format(new Date(row.updated), 'dd/MM/yyyy HH:mm');
      }
      return "";
    },
    filterOptions: {
      fieldType: "date"
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
