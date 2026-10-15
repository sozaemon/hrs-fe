import { Component, inject, OnInit, signal } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { PaginationRequest, SortDirection } from "@app/shared/components/data-table/types/pagination-request";
import { FilterRequest } from "@app/shared/components/data-table/types/filter-request.types";
import { ColumnAction, DataTableQuery, RowAction } from "@app/shared/components/data-table/types/data-table.types";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { DataTable } from "@app/shared/components/data-table/data-table";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzButtonModule } from "ng-zorro-antd/button";
import { ShiftToleranceService } from "./services/shift-tolerance.service";
import { ShiftTolerance } from "./types/shift-tolerance.type";
import { columnDefinition } from "./types/column.definition";
import { ShiftToleranceForm } from "./components/shift-tolerance-form/shift-tolerance.form";

@Component({
  templateUrl: "./template/shift-tolerance.html",
  providers: [ShiftToleranceService],
  imports: [NzCardModule, DataTable, NzButtonModule, ShiftToleranceForm],
})
export class ShiftTolerancePage implements OnInit {
  private readonly notification = inject(NzNotificationService);
  private readonly shiftToleranceService = inject(ShiftToleranceService);

  readonly shiftToleranceData = signal<ShiftTolerance[]>([]);
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalSize = signal<number>(0);
  readonly sortBy = signal<string | undefined>(undefined);
  readonly sortDirection = signal<SortDirection>("ASC");
  readonly isLoading = signal<boolean>(false);
  readonly shiftToleranceColumns = columnDefinition;

  readonly selectedShiftTolerance = signal<ShiftTolerance | undefined>(undefined);
  readonly displayShiftToleranceForm = signal<boolean>(false);
  readonly formMode = signal<"view" | "create" | "update">("view");

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(filter: FilterRequest[] = []): void {
    const request: PaginationRequest = {
      page: this.page(),
      pageSize: this.pageSize(),
      filter,
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection(),
    };

    this.isLoading.set(true);

    this.shiftToleranceService.paginateList(request).subscribe({
      next: (r) => {
        this.shiftToleranceData.set(r?.data.data || []);
        this.page.set(r?.data.page || 1);
        this.totalSize.set(r?.data.total || 0);
        this.pageSize.set(r?.data.size || 10);
        this.isLoading.set(false);
      },
      error: (e) => {
        this.notification.error("Error", resolveHttpErrorMessage(e));
        this.isLoading.set(false);
      }
    });
  }

  handleQueryChange(query: DataTableQuery<ShiftTolerance>): void {
    this.page.set(query.pageIndex);
    this.pageSize.set(query.pageSize);
    this.sortBy.set(query.sort?.field);
    this.sortDirection.set(query.sort?.order ?? "ASC");

    this.loadData(query.filters || []);
  }

  rowAction: ColumnAction[] = [
    {
      name: "View",
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
  ]

  resolveRowAction(action: RowAction<ShiftTolerance>): void {
    this.selectedShiftTolerance.set(action.row);

    switch (action.name) {
      case "view":
        this.formMode.set("view");
        this.displayShiftToleranceForm.set(true);
        break;
      case "edit":
        this.formMode.set("update");
        this.displayShiftToleranceForm.set(true);
        break;
    }
  }

  public handleFormResult(result: "created" | "updated" | "closed" | "fail"): void {
    if (result === "created" || result === "updated") {
      this.loadData();
    }
  }

  public openCreateShiftToleranceForm(): void {
    this.selectedShiftTolerance.set(undefined);
    this.formMode.set("create");
    this.displayShiftToleranceForm.set(true);
  }
}