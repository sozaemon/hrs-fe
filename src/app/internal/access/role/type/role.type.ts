import { RecordType } from "@app/shared/components/data-table/types/pagination-response";

export interface Role extends Record<string, RecordType>{
  id: number;
  code:string;
  name:string;
  description?:string;
  active?:boolean;
}