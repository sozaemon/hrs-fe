import { inject, Injectable } from "@angular/core";
import { PaginationInterface } from "@app/shared/components/data-table/interface/pagination.interface";
import { PaginationShiftTolerance, ShiftTolerance, ShiftToleranceResponse } from "../types/shift-tolerance.type";
import { HttpResponseBody, ServerClient } from "@app/core/http/client";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { PaginationResponse } from "@app/shared/components/data-table/types/pagination-response";
import { Observable } from "rxjs";

@Injectable()
export class ShiftToleranceService implements PaginationInterface<ShiftTolerance> {

  private readonly client = inject(ServerClient);
  private readonly apiUrl = "shift/shift-tolerance";

  paginateList(request: PaginationRequest): Observable<HttpResponseBody<PaginationResponse<ShiftTolerance>>> {
    return this.client.post<PaginationRequest, PaginationShiftTolerance>(`${this.apiUrl}/list`, request);
  }

  createShiftTolerance(request: ShiftTolerance): Observable<ShiftToleranceResponse> {
    return this.client.post<ShiftTolerance, ShiftTolerance>(`${this.apiUrl}/create`, request);
  }

  updateShiftTolerance(request: ShiftTolerance): Observable<ShiftToleranceResponse> {
    return this.client.put<ShiftTolerance, ShiftTolerance>(`${this.apiUrl}/update`, request);
  }

}