import { ColumnDefinitions } from "@app/shared/components/data-table/types/data-table.types";
import { ShiftType } from "./shift_type.type";

export const columnDefinition: ColumnDefinitions<ShiftType> = [
  {
    field: "code",
    header: "Code",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  },
  {
    field: "name",
    header: "Name",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  }
]