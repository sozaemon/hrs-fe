import { inject, Injectable } from "@angular/core";
import { HttpResponseBody, ServerClient } from "@app/core/http/client";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { Observable } from "rxjs";
import {
  UpdateUploadAccessDetailRequest,
  UploadAccessDetail,
  UploadAccessDetailPaginationResponse,
  PaginationUploadAccessDetail,
} from "../types/upload-access-detail.type";

/**
 * Skeleton for the upload access detail endpoints.
 *
 * `update` and `process` match the existing backend contract
 * (`PATCH /api/role-access/upload/update`, `POST /api/role-access/upload/process/{headerId}`).
 * `list` is a placeholder: the backend service already has `pageUpload(PaginationDto)` but no
 * controller exposes it yet, so the path below is an assumption to be confirmed.
 */
@Injectable()
export class UploadAccessDetailService {

  private readonly client = inject(ServerClient);
  private readonly apiUrl = "role-access";

  list(request: PaginationRequest): Observable<UploadAccessDetailPaginationResponse> {
    return this.client.post<PaginationRequest, PaginationUploadAccessDetail>(
      `${this.apiUrl}/upload/list`,
      request,
    );
  }

  update(request: UpdateUploadAccessDetailRequest): Observable<HttpResponseBody<UploadAccessDetail>> {
    return this.client.patch<UpdateUploadAccessDetailRequest, UploadAccessDetail>(
      `${this.apiUrl}/upload/update`,
      request,
    );
  }

  process(headerId: number): Observable<HttpResponseBody<string>> {
    return this.client.post<Record<string, never>, string>(
      `${this.apiUrl}/upload/process/${headerId}`,
      {},
    );
  }
}
