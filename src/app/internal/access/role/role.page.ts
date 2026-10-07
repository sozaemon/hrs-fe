import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import { RoleService } from "./service/role.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { PaginationRequest, SortDirection } from "@app/shared/components/data-table/types/pagination-request";
import { FilterRequest } from "@app/shared/components/data-table/types/filter-request.types";
import { Role } from "./type/role.type";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { DataTable } from "@app/shared/components/data-table/data-table";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzButtonModule } from "ng-zorro-antd/button";
import { roleColumnDefinition } from "./type/column.definition";
import { DataTableQuery } from "@app/shared/components/data-table/types/data-table.types";
import { RoleForm } from "./components/role-form/role-form";

@Component({
  imports: [DataTable, NzCardModule, NzButtonModule, RoleForm],
  templateUrl: "./template/role.html",
  providers: [RoleService],
})
export class RolePage implements OnInit {

  private readonly notification = inject(NzNotificationService);
  private readonly roleService = inject(RoleService);

  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalSize = signal<number>(0);
  readonly sortBy = signal<string | undefined>(undefined);
  readonly sortDirection = signal<SortDirection>("ASC");

  readonly columnDef = roleColumnDefinition;

  readonly isLoading = signal<boolean>(false);
  readonly displayRoleForm = signal<boolean>(false);

  readonly roleData = signal<Role[]>([]);

  readonly role = signal<Role | undefined>(undefined);

  @ViewChild(RoleForm) roleForm!: RoleForm;
  readonly formMode = signal<"view" | "create" | "update">("view");

  ngOnInit(): void {
    this.loadData();
  }

  public openCreateRoleForm() {
    this.role.set(undefined);
    this.formMode.set("create");

    this.displayRoleForm.set(true);
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

    this.roleService.paginateList(request)
      .subscribe({
        next: (r) => {
          this.roleData.set(r?.data.data || []);
          this.page.set(r?.data.page || 1);
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

  public handleQueryChange(queryChange: DataTableQuery<Role>): void {
    this.page.set(queryChange.pageIndex);
    this.pageSize.set(queryChange.pageSize);
    this.sortBy.set(queryChange.sort?.field);
    this.sortDirection.set(queryChange.sort?.order ?? "ASC");

    this.loadData(queryChange.filters);
  }

  public handleFormResult(result: "created" | "updated" | "closed" | "fail"): void {
    if (["created", "updated"].includes(result)) {
      this.loadData();
    }
  }

  public handleRowClick(roles: Role[]): void {
    console.info("role row click", roles);

    if (roles.length) {
      this.role.set(roles[0]);
      this.formMode.set("update");
      this.displayRoleForm.set(true);
    }

  }

}