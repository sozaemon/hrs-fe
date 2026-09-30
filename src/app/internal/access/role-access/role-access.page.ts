import { Component, inject, OnInit, signal } from "@angular/core";
import { RoleAccessService } from "./service/role-access.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { PaginationRequest, SortDirection } from "@app/shared/components/data-table/types/pagination-request";
import { FilterRequest } from "@app/shared/components/data-table/types/filter-request.types";
import { RoleAccess } from "./types/role-access.type";
import { DataTableQuery } from "@app/shared/components/data-table/types/data-table.types";
import { columnDefinition } from "./types/column-definition";
import { NzCardModule } from "ng-zorro-antd/card";
import { DataTable } from "@app/shared/components/data-table/data-table";
import { NzButtonModule } from "ng-zorro-antd/button";

@Component({
  templateUrl: "./template/role-access.html",
  providers: [RoleAccessService],
  imports: [NzCardModule, DataTable, NzButtonModule],
})
export class RoleAccessPage implements OnInit {

  private readonly roleAccessService = inject(RoleAccessService);
  private readonly notification = inject(NzNotificationService);

  readonly roleAccessData = signal<RoleAccess[]>([]);
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalSize = signal<number>(0);
  readonly sortBy = signal<string | undefined>(undefined);
  readonly sortDirection = signal<SortDirection>("ASC");

  readonly isLoading = signal<boolean>(false);

  readonly roleAccessColumns = columnDefinition;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(filter: FilterRequest[] = []): void {
    const request: PaginationRequest = {
      page: this.page(),
      pageSize: this.pageSize(),
      filter: filter,
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection()
    }

    this.isLoading.set(true);

    this.roleAccessService.paginateList(request)
      .subscribe({
        next: (r) => {
          this.roleAccessData.set(r.data.data || []);
          this.page.set(r.data.page || 0);
          this.totalSize.set(r.data.total);
          this.pageSize.set(r.data.size);

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
      })
  }

  handleQueryChange(query: DataTableQuery<RoleAccess>): void {
    this.page.set(query.pageIndex);
    this.pageSize.set(query.pageSize);
    this.sortBy.set(query.sort?.field)
    this.sortDirection.set(query.sort?.order ?? "ASC");

    this.loadData(query.filters || []);
  }
}