import { ColumnDefinitions } from "@app/shared/components/data-table/types/data-table.types";
import { User } from "./user.type";

export const userColumnDefinition: ColumnDefinitions<User> = [
  {
    field: "userName",
    header: "Username",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  },
  {
    field: "fullName",
    header: "Full Name",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  },
  {
    field: "email",
    header: "Email",
    allowSort: true,
    allowFilter: true,
    filterOptions: { fieldType: "string" }
  },
  {
    field: "expiryDate",
    header: "Expiry Date",
    allowSort: true,
    columnFn: (user) => {
      if (!user.expiryDate) {
        return "-";
      }
      return new Date(`${user.expiryDate}`.replace(" ", "T")).toLocaleString();
    }
  }
];
