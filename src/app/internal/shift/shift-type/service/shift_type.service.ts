import { inject, Injectable } from "@angular/core";
import { ServerClient } from "@app/core/http/client";
import { PaginationInterface } from "@app/shared/components/data-table/interface/pagination.interface";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { Observable } from "rxjs";
import { PaginationShiftType, ShiftType, ShiftTypePaginationResponse, ShiftTypeResponse } from "../types/shift_type.type";

@Injectable()
export class ShiftTypeService implements PaginationInterface<ShiftType> {

  private readonly client = inject(ServerClient);
  private readonly apiUrl = "shift/shift-type";

  paginateList(request: PaginationRequest): Observable<ShiftTypePaginationResponse> {
    return this.client.post<PaginationRequest, PaginationShiftType>(`${this.apiUrl}/list`, request);
  }

  createShiftType(request: ShiftType): Observable<ShiftTypeResponse> {
    return this.client.post<ShiftType, ShiftType>(`${this.apiUrl}/create`, request)
  }

  updateShiftType(request: ShiftType): Observable<ShiftTypeResponse> {
    return this.client.put<ShiftType, ShiftType>(`${this.apiUrl}/update`, request);
  }

}