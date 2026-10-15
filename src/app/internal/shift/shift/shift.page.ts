import { Component, inject, OnInit, signal } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { PaginationRequest, SortDirection } from "@app/shared/components/data-table/types/pagination-request";
import { FilterRequest } from "@app/shared/components/data-table/types/filter-request.types";
import { DataTableQuery, ColumnAction, RowAction } from "@app/shared/components/data-table/types/data-table.types";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { DataTable } from "@app/shared/components/data-table/data-table";
import { ShiftService } from "./services/shift.service";
import { Shift } from "./types/shift.type";
import { columnDefinition } from "./types/column.definition";

@Component({
  imports: [DataTable, NzCardModule, NzButtonModule],
  templateUrl: "./template/shift.html",
  providers: [ShiftService],
})
export class ShiftPage implements OnInit {
  private readonly notification = inject(NzNotificationService);
  private readonly shiftService = inject(ShiftService);

  readonly shiftData = signal<Shift[]>([]);
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalSize = signal<number>(0);
  readonly sortBy = signal<string | undefined>(undefined);
  readonly sortDirection = signal<SortDirection>("ASC");
  readonly isLoading = signal<boolean>(false);
  readonly shiftColumns = columnDefinition;

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

    this.shiftService.paginateList(request).subscribe({
      next: (r) => {
        this.shiftData.set(r?.data.data || []);
        this.page.set(r?.data.page || 1);
        this.totalSize.set(r?.data.total || 0);
        this.pageSize.set(r?.data.size || 10);
        this.isLoading.set(false);
      },
      error: (e) => {
        this.notification.error("Error", resolveHttpErrorMessage(e));
        this.isLoading.set(false);
      },
    });
  }

  handleQueryChange(query: DataTableQuery<Shift>): void {
    this.page.set(query.pageIndex);
    this.pageSize.set(query.pageSize);
    this.sortBy.set(query.sort?.field);
    this.sortDirection.set(query.sort?.order ?? "ASC");

    this.loadData(query.filters || []);
  }

  public resolveActions(): ColumnAction[] {
    return [
      {
        name: "view",
        icon: "eye",
        label: "View",
        class: "bg-green-500",
      },
      {
        name: "edit",
        icon: "edit",
        label: "Edit",
        class: "bg-orange-500",
      },
    ];
  }

  public resolveRowAction(action: RowAction<Shift>): void {
    switch (action.name) {
      case "view":
        break;
      case "edit":
        break;
    }
  }
}
