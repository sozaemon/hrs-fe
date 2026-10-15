import { Component, inject, OnInit, signal } from "@angular/core";
import { ShiftTypeService } from "./service/shift_type.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { PaginationRequest, SortDirection } from "@app/shared/components/data-table/types/pagination-request";
import { FilterRequest } from "@app/shared/components/data-table/types/filter-request.types";
import { ShiftType } from "./types/shift_type.type";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { columnDefinition } from "./types/column.definition";
import { ColumnAction, DataTableQuery, RowAction } from "@app/shared/components/data-table/types/data-table.types";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { DataTable } from "@app/shared/components/data-table/data-table";
import { ShiftTypeForm } from "./components/shift-type-form/shift-type.form";

@Component({
  imports: [DataTable, NzCardModule, NzButtonModule, ShiftTypeForm],
  templateUrl: "./template/shift-type.html",
  providers: [ShiftTypeService]
})
export class ShiftTypePage implements OnInit {

  private readonly notification = inject(NzNotificationService)
  private readonly shiftTypeService = inject(ShiftTypeService);

  readonly shiftTypeData = signal<ShiftType[]>([]);

  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalSize = signal<number>(0);
  readonly sortBy = signal<string | undefined>(undefined);
  readonly sortDirection = signal<SortDirection>("ASC");

  readonly columnDefinition = columnDefinition;

  readonly isLoading = signal<boolean>(false);

  readonly selectedShiftType = signal<ShiftType | undefined>(undefined);
  readonly displayShiftTypeForm = signal<boolean>(false);
  readonly formMode = signal<"view" | "create" | "update">("view");

  ngOnInit(): void {
    this.loadData();
  }

  public openCreateShiftTypeForm(): void {
    this.selectedShiftType.set(undefined);
    this.formMode.set("create");
    this.displayShiftTypeForm.set(true);
  }

  private loadData(filter: FilterRequest[] = []): void {
    const request: PaginationRequest = {
      page: this.page(),
      pageSize: this.pageSize(),
      filter: filter,
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection(),
    }

    this.isLoading.set(true);

    this.shiftTypeService.paginateList(request)
      .subscribe({
        next: (r) => {
          this.shiftTypeData.set(r.data.data || [])

          this.page.set(r.data.page || 0);
          this.totalSize.set(r?.data.total || 0);
          this.pageSize.set(r?.data.size || 10);

          this.isLoading.set(false);
        },
        error: (e) => {
          const message = resolveHttpErrorMessage(e);
          this.notification.error("Error", message);
          this.isLoading.set(false);
        }
      })
  }

  handleQueryChange(qr: DataTableQuery<ShiftType>): void {

    this.page.set(qr.pageIndex);
    this.pageSize.set(qr.pageSize);
    this.sortBy.set(qr.sort?.field);
    this.sortDirection.set(qr.sort?.order ?? "ASC");

    this.loadData(qr.filters);
  }

  public resolveActions(): ColumnAction[] {
    return [
      {
        name: "view",
        icon: "eye",
        label: "View",
        class: "bg-green-500"
      },
      {
        name: "edit",
        icon: "edit",
        label: "Edit",
        class: "bg-orange-500"
      }
    ];
  }

  public resolveRowAction(action: RowAction<ShiftType>): void {
    this.selectedShiftType.set(action.row);

    switch (action.name) {
      case "view":
        this.formMode.set("view");
        this.displayShiftTypeForm.set(true);
        break;
      case "edit":
        this.formMode.set("update");
        this.displayShiftTypeForm.set(true);
        break;
    }
  }

  public handleFormResult(result: "created" | "updated" | "closed" | "fail"): void {
    if (result === "created" || result === "updated") {
      this.loadData();
    }
  }
}