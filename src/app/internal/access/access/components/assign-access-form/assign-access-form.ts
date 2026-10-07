import { Component, inject, input, model, OnChanges, OnInit, signal, SimpleChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RoleAccessService } from "@app/internal/access/role-access/service/role-access.service";
import { RoleAccess } from "@app/internal/access/role-access/types/role-access.type";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { FieldOption } from "@app/shared/components/form-builder/types/types";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { NzCheckboxModule, NzCheckboxOption } from "ng-zorro-antd/checkbox";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { AccessService } from "../../service/access.service";
import { Access } from "../../types/access.type";

@Component({
  selector: "assign-access-form",
  templateUrl: "./assign-access-form.html",
  imports: [FormsModule, NzModalModule, NzCheckboxModule],
  providers: [AccessService, RoleAccessService],
})
export class AssignAccessForm implements OnInit, OnChanges {


  public readonly access = input<Access | undefined>();

  private readonly accessService = inject(AccessService);
  private readonly roleAccessService = inject(RoleAccessService);

  private readonly notification = inject(NzNotificationService);

  public readonly roleOption = signal<FieldOption[]>([]);

  public readonly isLoading = signal<boolean>(false);
  public readonly displayAssignAccessForm = model<boolean>(false);

  public roleOptions = signal<NzCheckboxOption[]>([]);
  public readonly roleAccess = signal<RoleAccess[]>([]);

  public readonly assignedRole = signal<number[]>([]);

  // public readonly formConfig = computed<FormConfig>(() => {
  //   return {
  //     fields: [
  //       {
  //         key: "roleId",
  //         type: "select",
  //         label: "Role",
  //         placeholder: "Select Role",
  //         validation: {
  //           required: true,
  //         },
  //         order: 1,
  //         options: this.roleOption()
  //       }
  //     ],
  //     columns: 1,
  //   };
  // })

  ngOnChanges(changes: SimpleChanges<AssignAccessForm>): void {
    if (changes.access?.currentValue?.id) {
      const accessId = changes.access.currentValue?.id;
      const roleAccessRequest: PaginationRequest = {
        page: 1,
        pageSize: 100,
        filter: [
          {
            label: "Access ID",
            fieldName: "accessId",
            value: accessId,
            operator: "EQ",
            joinOperator: "AND"
          }
        ]
      }

      this.isLoading.set(true);

      this.roleAccessService.paginateList(roleAccessRequest).subscribe({
        next: (d) => {
          this.roleAccess.set(d.data.data);
          this.assignedRole.set(d.data.data.map((m) => m.roleId));
          this.isLoading.set(false);
        },
        error: (e) => {
          let message = resolveHttpErrorMessage(e);
          this.notification.error("Error", message);
          this.isLoading.set(false);
        }
      })
    }
  }

  // resolveRoleIsAssigned(roleId: number): boolean {
  //   return this.roleAccess().map((m) => m.roleId).includes(roleId);
  // }

  ngOnInit(): void {
    this.isLoading.set(true);

    const request: PaginationRequest = {
      page: 1,
      filter: [],
      pageSize: 20,
    }
    this.accessService.roleList(request).subscribe({
      next: (r) => {

        const roleOption: FieldOption[] = r.data.data.map((m) => {
          return {
            label: m.name,
            value: m.id,
          };
        });
        this.roleOptions.set(roleOption);
        this.isLoading.set(false);
      },
      error: (e) => {
        let message = "unknown error";
        if (e instanceof Error) {
          message = e.message;
        }
        this.notification.error("Failed to fetch Role", message);
        this.isLoading.set(false);
      }
    })
  }

  public resolveOkFunction(): void {
    // this.dynamicFormBuilder.submit();
    this.assignRoles();

  }

  private assignRoles(): void {

    if (this.access()) {
      this.isLoading.set(true);
      this.roleAccessService.assignRoleAccess({
        accessId: this.access()?.id ?? 0,
        roleIds: this.assignedRole(),
      }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.notification.info("Success", "Success assign roles");
          this.closeForm();
        },
        error: (err) => {
          this.isLoading.set(false);
          const errMessage = resolveHttpErrorMessage(err);
          this.notification.info("Error", `Fail to assign Roles: ${errMessage}`);
        }
      })
    }
  }

  /** @deprecated change assignRoles */
  private createRoleAccess(roleAccess: RoleAccess): void {

    if (!this.access()) {
      return;
    }

    this.isLoading.set(true);

    roleAccess.accessId = this.access()?.id ?? 0;
    this.roleAccessService.assignAccess(roleAccess).subscribe({
      next: (r) => {
        this.notification.info("Success", "Access Assigned");
        this.closeForm();
      },
      error: (e) => {
        let message = "unknown error";
        if (e instanceof Error) {
          message = e.message;
        }
        this.notification.error("Error", message);
        this.closeForm();
      }
    })
  }

  public closeForm(): void {
    this.displayAssignAccessForm.set(false);
  }

  // public openForm(): void {
  //   this.displayForm.set(true);
  // }
}