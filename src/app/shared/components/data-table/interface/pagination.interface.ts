import { Observable } from "rxjs";
import { HttpResponseBody } from "@app/core/http/client";
import { PaginationResponse, RecordType } from "@app/shared/components/data-table/types/pagination-response";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";

export interface PaginationInterface<T extends Record<string, RecordType>> {
  paginateList(request: PaginationRequest): Observable<HttpResponseBody<PaginationResponse<T>>>;
}