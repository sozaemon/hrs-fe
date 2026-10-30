import { HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { HttpResponseBody, ServerClient } from "@app/core/http/client";
import { PaginationInterface } from "@app/shared/components/data-table/interface/pagination.interface";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { Observable } from "rxjs";
import { PaginationUploadedRoleAccess, UploadedRoleAccess, UploadedRoleAccessPaginationResponse } from "../types/upload-role-access.type";


@Injectable()
export class UploadRoleAccessService implements PaginationInterface<UploadedRoleAccess> {

  private readonly client = inject(ServerClient);
  private readonly apiUrl = "role-access";
  private readonly uploadApiUrl = "upload";

  paginateList(request: PaginationRequest): Observable<UploadedRoleAccessPaginationResponse> {
    return this.client.post<PaginationRequest, PaginationUploadedRoleAccess>(`${this.uploadApiUrl}/list`, request);
  }

  downloadTemplate(): Observable<HttpResponse<Blob>> {
    return this.client.downloadFile(`${this.apiUrl}/upload/template`);
  }

  uploadTemplate(file: File, description?: string): Observable<HttpResponseBody<UploadedRoleAccess[]>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description ?? "test description");

    return this.client.uploadFile<UploadedRoleAccess[]>(`${this.apiUrl}/upload`, formData);
  }
}
