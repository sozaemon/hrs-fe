import { RecordType } from "@app/shared/components/data-table/types/pagination-response";


export interface Access extends Record<string, RecordType> {
  id: number;
  name: string;
  path: string;
  method: string;
  description?: string;
}
