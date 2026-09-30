import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import { DataTable } from "@app/shared/components/data-table/data-table";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { AccessService } from "@app/internal/access/access/service/access.service";
import { PaginationRequest, SortDirection } from "@app/shared/components/data-table/types/pagination-request";
import { Access } from "@app/internal/access/access/types/access.type";
import { ColumnAction, DataTableQuery, RowAction } from "@app/shared/components/data-table/types/data-table.types";
import { columnDefinition } from "./types/column.definition";
import { FilterRequest } from "@app/shared/components/data-table/types/filter-request.types";
import { AccessForm, AccessResult, FormMode } from "./components/access-form/access-form";
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  imports: [DataTable, NzCardModule, NzButtonModule, AccessForm],
  templateUrl: "./template/access.html",
  styleUrl: "./css/access.css",
  providers: [AccessService],
})
export class AccessPage implements OnInit {

  private readonly notification = inject(NzNotificationService);

  readonly accessService = inject(AccessService);
  readonly accessData = signal<Access[]>([]);

  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalSize = signal<number>(0);
  readonly sortBy = signal<string | undefined>(undefined);
  readonly sortDirection = signal<SortDirection>("ASC");

  readonly isLoading = signal<boolean>(false);

  readonly accessColumns = columnDefinition;

  readonly selectedAccess = signal<Access | undefined>(undefined);
  readonly formMode = signal<FormMode>("create");

  @ViewChild(AccessForm) accessForm!: AccessForm;

  ngOnInit(): void {
    this.loadData();
  }

  public openAccessForm(): void {
    this.accessForm.openForm();
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

    this.accessService.paginateList(request)
      .subscribe({
        next: (r) => {

          this.accessData.set(r?.data.data || []);
          this.page.set(r.data.page || 0);
          this.totalSize.set(r?.data.total || 0);
          this.pageSize.set(r?.data.size || 10);

          this.isLoading.set(false);
        },
        error: (e) => {
          let message = "unknown error";
          if (e instanceof Error) {
            message = e.message;
          }
          this.notification.error("Error", message);
          this.isLoading.set(false);
        }
      });
  }

  handleQueryChange(qr: DataTableQuery<Access>): void {

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
        color: "green",
      },
      {
        name: "edit",
        icon: "edit",
        label: "edit",
        color: "orange",
      }
    ];
  }

  public resolveRowClick(access: Access): void {
    // TODO right now is not used
    console.info("access", access);
  }

  public resolveRowAction(action: RowAction<Access>): void {
    console.info("row action", action);

    this.selectedAccess.set(action.row);
    switch (action.name) {
      case "view":
        this.formMode.set("read");
        break;
      case "edit":
        this.formMode.set("update");
        break;
    }

    this.openAccessForm();
  }
  public onFormSubmit(result: AccessResult): void {
    console.info("process result", result);
    this.accessForm.closeForm();
    this.loadData();
  }

}