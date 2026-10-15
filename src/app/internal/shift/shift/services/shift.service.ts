import { inject, Injectable } from "@angular/core";
import { ServerClient } from "@app/core/http/client";
import { PaginationInterface } from "@app/shared/components/data-table/interface/pagination.interface";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { Observable } from "rxjs";
import { PaginationShift, Shift, ShiftPaginationResponse, ShiftResponse } from "../types/shift.type";

@Injectable()
export class ShiftService implements PaginationInterface<Shift> {

  private readonly client = inject(ServerClient);
  private readonly apiUrl = "shift";

  paginateList(request: PaginationRequest): Observable<ShiftPaginationResponse> {
    return this.client.post<PaginationRequest, PaginationShift>(`${this.apiUrl}/list`, request);
  }

  createShift(request: Shift): Observable<ShiftResponse> {
    return this.client.post<Shift, Shift>(`${this.apiUrl}/create`, request);
  }

  updateShift(request: Shift): Observable<ShiftResponse> {
    return this.client.put<Shift, Shift>(`${this.apiUrl}/update`, request);
  }

}