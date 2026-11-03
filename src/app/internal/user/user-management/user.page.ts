import { Component, inject, OnInit, signal } from "@angular/core";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { DataTable } from "@app/shared/components/data-table/data-table";
import { ColumnAction, DataTableQuery, RowAction } from "@app/shared/components/data-table/types/data-table.types";
import { FilterRequest } from "@app/shared/components/data-table/types/filter-request.types";
import { PaginationRequest, SortDirection } from "@app/shared/components/data-table/types/pagination-request";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { UserService } from "./service/user.service";
import { User } from "./type/user.type";
import { userColumnDefinition } from "./type/column.definition";
import { UserForm } from "./components/user-form/user-form";

@Component({
  templateUrl: "./template/user.html",
  providers: [UserService],
  imports: [NzCardModule, NzButtonModule, NzModalModule, DataTable, UserForm],
})
export class UserPage implements OnInit {
  private readonly notification = inject(NzNotificationService);
  private readonly modal = inject(NzModalService);
  private readonly userService = inject(UserService);

  readonly userData = signal<User[]>([]);
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalSize = signal<number>(0);
  readonly sortBy = signal<string | undefined>(undefined);
  readonly sortDirection = signal<SortDirection>("ASC");
  readonly isLoading = signal<boolean>(false);
  readonly userColumns = userColumnDefinition;

  readonly selectedUser = signal<User | undefined>(undefined);
  readonly displayUserForm = signal<boolean>(false);
  readonly formMode = signal<"view" | "create" | "update">("view");

  readonly rowAction: ColumnAction[] = [
    { name: "view", label: "View", class: "bg-green-500" },
    { name: "edit", label: "Edit", class: "bg-orange-500" },
    { name: "delete", label: "Delete", class: "bg-red-500" },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  public openCreateUserForm(): void {
    this.selectedUser.set(undefined);
    this.formMode.set("create");
    this.displayUserForm.set(true);
  }

  public handleQueryChange(query: DataTableQuery<User>): void {
    this.page.set(query.pageIndex);
    this.pageSize.set(query.pageSize);
    this.sortBy.set(query.sort?.field);
    this.sortDirection.set(query.sort?.order ?? "ASC");

    this.loadData(query.filters ?? []);
  }

  public resolveRowAction(action: RowAction<User>): void {
    this.selectedUser.set(action.row);

    switch (action.name) {
      case "view":
        this.formMode.set("view");
        this.displayUserForm.set(true);
        break;
      case "edit":
        this.formMode.set("update");
        this.displayUserForm.set(true);
        break;
      case "delete":
        this.confirmDelete(action.row);
        break;
    }
  }

  public handleFormResult(result: "created" | "updated" | "closed" | "fail"): void {
    if (result === "created" || result === "updated") {
      this.loadData();
    }
  }

  private confirmDelete(user: User): void {
    this.modal.confirm({
      nzTitle: "Delete User",
      nzContent: `Are you sure you want to delete ${user.userName}?`,
      nzOkText: "Delete",
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(user),
    });
  }

  private deleteUser(user: User): void {
    if (!user.id) {
      return;
    }

    this.isLoading.set(true);

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notification.info("Success", "Success to delete User");
        this.loadData();
      },
      error: (e) => {
        this.isLoading.set(false);
        this.notification.error("Error", resolveHttpErrorMessage(e));
      },
    });
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

    this.userService.paginateList(request).subscribe({
      next: (r) => {
        this.userData.set(r?.data.data || []);
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
}
