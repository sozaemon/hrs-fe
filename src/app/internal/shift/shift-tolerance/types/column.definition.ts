import { ColumnDefinitions } from "@app/shared/components/data-table/types/data-table.types";
import { ShiftTolerance } from "./shift-tolerance.type";

export const columnDefinition: ColumnDefinitions<ShiftTolerance> = [
  {
    field: "code",
    header: "Code",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  },
  {
    field: "toleranceName",
    header: "Tolerance Name",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  },
  {
    field: "toleranceBefore",
    header: "Tolerance Before",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "number" }
  },
  {
    field: "toleranceBeforeUnit",
    header: "Before Unit",
    allowSort: true,
    allowFilter: true,
    filterOptions: {
      fieldType: "string",
      filterValueOptions: ["HOUR", "MINUTE"]
    }
  },
  {
    field: "toleranceAfter",
    header: "Tolerance After",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "number" }
  },
  {
    field: "toleranceAfterUnit",
    header: "After Unit",
    allowSort: true,
    allowFilter: true,
    filterOptions: {
      fieldType: "string",
      filterValueOptions: ["HOUR", "MINUTE"]
    }
  }
];