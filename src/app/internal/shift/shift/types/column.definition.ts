import { ColumnDefinitions } from "@app/shared/components/data-table/types/data-table.types";
import { Shift } from "./shift.type";

export const columnDefinition: ColumnDefinitions<Shift> = [
  {
    field: "code",
    header: "Code",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  },
  {
    field: "shiftName",
    header: "Shift Name",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  },
  {
    field: "shiftTypeName",
    header: "Shift Type",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  },
  {
    field: "inTime",
    header: "In Time",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "date" }
  },
  {
    field: "outTime",
    header: "Out Time",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "date" }
  },
  {
    field: "inToleranceName",
    header: "In Tolerance",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  },
  {
    field: "outToleranceName",
    header: "Out Tolerance",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  },
]