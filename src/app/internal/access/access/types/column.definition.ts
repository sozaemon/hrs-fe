import { ColumnDefinitions } from "@app/shared/components/data-table/types/data-table.types";
import { Access } from "./access.type";

export const columnDefinition: ColumnDefinitions<Access> = [
  // { field: "id", header: "ID" },
  {
    field: "name",
    header: "Name",
    allowSort: true,
    allowFilter: true,
    filterOptions: {
      fieldType: "number"
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
    allowSort: true,
    allowFilter: true,
    filterOptions: {
      fieldType: "string",
      filterValueOptions: [
        "GET", "POST", "PUT", "PATCH"
      ]
    }
  },
  {
    field: "description",
    header: "Description",
    allowSort: true,
    allowFilter: true,
    filterOptions: {
      fieldType: "date"
    }
  },
];