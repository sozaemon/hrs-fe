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
import { AssignAccessForm } from "./components/assign-access-form/assign-access-form";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";


@Component({
  imports: [DataTable, NzCardModule, NzButtonModule, AccessForm, AssignAccessForm],
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

  readonly displayForm = signal<boolean>(false);
  readonly displayAccessForm = signal<boolean>(false);

  @ViewChild(AccessForm) accessForm!: AccessForm;
  @ViewChild(AssignAccessForm) assignAccessForm!: AssignAccessForm;

  ngOnInit(): void {
    this.loadData();
  }

  public openCreateAccessForm(): void {
    this.formMode.set("create");
    this.selectedAccess.set(undefined);
    this.openAccessForm();
  }

  private openAccessForm(): void {
    this.displayAccessForm.set(false);
    this.displayForm.set(true);
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
          const message = resolveHttpErrorMessage(e);
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
        class: "bg-green-500"
      },
      {
        name: "edit",
        icon: "edit",
        label: "Edit",
        class: "bg-orange-500"
      },
      {
        name: "assign",
        label: "Assign Roles",
        icon: "check-circle",
        class: "bg-blue-500"
      }
    ];
  }

  public resolveRowAction(action: RowAction<Access>): void {
    this.selectedAccess.set(action.row);
    switch (action.name) {
      case "view":
        this.formMode.set("read");
        this.openAccessForm();
        break;
      case "edit":
        this.formMode.set("update");
        this.openAccessForm();
        break;
      case "assign":
        this.displayAccessForm.set(true);
        break;

    }
  }
  public onFormSubmit(result: AccessResult): void {
    console.info("process result", result);
    this.accessForm.closeForm();
    this.page.set(1);
    this.loadData();
  }

}