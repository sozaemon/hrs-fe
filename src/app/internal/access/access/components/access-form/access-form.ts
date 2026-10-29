import { Component, computed, inject, input, model, OnChanges, OnDestroy, OnInit, output, signal, SimpleChanges, ViewChild } from "@angular/core";
import { DynamicFormBuilder } from "@app/shared/components/form-builder/form-builder.component";
import { FieldOption, FormConfig } from "@app/shared/components/form-builder/types/types";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { AccessService } from "../../service/access.service";
import { Access } from "../../types/access.type";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { NzCheckboxOption, NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { RoleAccess } from "@app/internal/access/role-access/types/role-access.type";
import { RoleAccessService } from "@app/internal/access/role-access/service/role-access.service";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { catchError, Subscription, switchMap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

export type AccessResult = "success" | "failed";
export type FormMode = "read" | "create" | "update";

@Component({
  selector: "access-form",
  templateUrl: "./access-form.html",
  imports: [DynamicFormBuilder, NzModalModule, NzCheckboxModule, FormsModule],
  styleUrl: "./access-form.css",
  providers: [AccessService, RoleAccessService]
})
export class AccessForm implements OnInit, OnChanges, OnDestroy {

  private readonly accessService = inject(AccessService);
  private readonly roleAccessService = inject(RoleAccessService);
  private readonly notification = inject(NzNotificationService);

  private subscription?: Subscription;

  public readonly mode = input<FormMode>("create");
  public readonly access = input<Access | undefined>(undefined);
  public readonly result = output<AccessResult>();
  public readonly displayAccessForm = model<boolean>(false);

  public readonly formConfig = computed<FormConfig>(() => {
    return {
      fields: [
        {
          key: "name",
          type: "text",
          label: "Name",
          placeholder: "Insert Access Name",
          value: this.access()?.name ?? undefined,
          validation: {
            required: true
          },
          disabled: this.mode() === "read",
          order: 1,
        },
        {
          key: "path",
          type: "text",
          label: "Path",
          placeholder: "Insert Access Code",
          value: this.access()?.path ?? undefined,
          validation: {
            required: true
          },
          disabled: this.mode() === "read",
          order: 2,
        },
        {
          key: "method",
          type: "select",
          label: "Method",
          placeholder: "Select Access Method",
          value: this.access()?.method ?? undefined,
          validation: {
            required: true
          },
          disabled: this.mode() === "read",
          order: 3,
          options: [
            {
              label: "POST",
              value: "POST",
            },
            {
              label: "GET",
              value: "GET",
            },
            {
              label: "PUT",
              value: "PUT",
            },
            {
              label: "PATCH",
              value: "PATCH",
            },
            {
              label: "DELETE",
              value: "DELETE",
            }
          ],
        },
        {
          key: "description",
          type: "text",
          label: "Description",
          placeholder: "Access Description",
          value: this.access()?.description ?? undefined,
          disabled: this.mode() === "read",
          order: 4,
        },
      ],
      columns: 1,
    };
  });

  public showAction: boolean = true;

  // role property 
  public readonly roleOption = signal<FieldOption[]>([]);
  public readonly roleOptions = signal<NzCheckboxOption[]>([]);
  public readonly roleAccess = signal<RoleAccess[]>([]);

  public readonly assignedRole = signal<number[]>([]);

  public readonly isLoading = signal<boolean>(false);

  @ViewChild(DynamicFormBuilder) dynamicFormBuilder!: DynamicFormBuilder;

  public openForm(): void {
    this.displayAccessForm.set(true);
  }

  public closeForm(): void {
    this.displayAccessForm.set(false);
  }

  public resolveOkFunction(): void {
    this.dynamicFormBuilder.submit();
  }

  ngOnChanges(changes: SimpleChanges<AccessForm>): void {

    this.assignedRole.set([]);

    if (changes.access?.currentValue?.id) {

      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      const accessId = changes.access.currentValue.id;

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

      this.subscription = this.roleAccessService.paginateList(roleAccessRequest).subscribe({
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
  ngOnInit(): void {
    this.loadRoles();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadRoles(): void {
    this.isLoading.set(true);

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const request: PaginationRequest = {
      page: 1,
      filter: [],
      pageSize: 20,
    }

    this.subscription = this.accessService.roleList(request).subscribe({
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
        let message = resolveHttpErrorMessage(e);
        this.notification.error("Error", message);
        this.isLoading.set(false);
      },
    })
  }

  public onSubmit(access: Access): void {

    switch (this.mode()) {
      case "create":
        this.createAccess(access);
        break;
      case "update":
        access.id = this.access()?.id ?? 0;
        this.updateAccess(access);
        break;
      default:
        this.closeForm();
    }
  }

  private createAccess(access: Access): void {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.accessService.createAccess(access)
      .pipe(
        switchMap((e) => {
          const accessId = e.data.id;

          return this.roleAccessService.assignRoleAccess({
            accessId: accessId,
            roleIds: this.assignedRole(),
          })
        }),
        catchError((e) => {
          throw new HttpErrorResponse(e);
        })
      )
      .subscribe({
        next: (r) => {
          this.notification.info("Success", "Access Created");
          this.result.emit("success")
        },
        error: (er) => {
          let message = resolveHttpErrorMessage(er);
          this.notification.error("Error", message);
          this.result.emit("failed");
        }
      })
  }
  private updateAccess(access: Access): void {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    access.id = this.access()?.id ?? 0;
    this.subscription = this.accessService.updateAccess(access)
      .pipe(
        switchMap((e) => {
          const accessId = e.data.id;

          return this.roleAccessService.assignRoleAccess({
            accessId: accessId,
            roleIds: this.assignedRole(),
          })
        }),
        catchError((e) => {
          throw new HttpErrorResponse(e);
        })
      )
      .subscribe({
        next: (r) => {
          this.notification.info("Success", "Access Updated");
          this.result.emit("success");
        },
        error: (er) => {
          const message = resolveHttpErrorMessage(er);
          this.notification.error("Error", message);
          this.result.emit("failed");
        }
      });
  }

  public resolveShowActions(): boolean {
    return this.access() === undefined;
  }

  public resolveSubmitLabel(): string {
    return this.access() ? "Close" : "Create Access";
  }
}