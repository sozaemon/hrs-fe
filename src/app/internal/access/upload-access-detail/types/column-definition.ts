import { ColumnDefinitions } from "@app/shared/components/data-table/types/data-table.types";
import { UploadAccessDetail } from "./upload-access-detail.type";

export const columnDefinition: ColumnDefinitions<UploadAccessDetail> = [
  {
    field: "name",
    header: "Name",
    allowSort: true,
    allowFilter: true,
    filterOptions: {
      fieldType: "string"
    }
  },
  {
    field: "path",
    header: "Path",
    allowSort: true,
    allowFilter: true,
    filterOptions: {
      fieldType: "string"
    }
  },
  {
    field: "method",
    header: "Method",
    allowFilter: true,
    filterOptions: {
      fieldType: "string",
      filterValueOptions: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    }
  },
  {
    field: "roles",
    header: "Roles",
    allowFilter: true,
    filterOptions: {
      fieldType: "string"
    }
  },
  {
    field: "uploadStatus",
    header: "Status",
    allowFilter: true,
    filterOptions: {
      fieldType: "string",
      filterValueOptions: ["UPLOADED", "REVALIDATE", "VALID", "NOTVALID", "COMPLETED"]
    }
  },
  {
    field: "errorMessage",
    header: "Validation Error",
    columnFn: (row) => row.errorMessage ?? ""
  }
];
