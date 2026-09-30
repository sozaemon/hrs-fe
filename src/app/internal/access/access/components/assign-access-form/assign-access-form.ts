import { Component, computed, inject, input, OnInit, signal, ViewChild } from "@angular/core";
import { Access } from "../../types/access.type";
import { FieldOption, FormConfig } from "@app/shared/components/form-builder/types/types";
import { AccessService } from "../../service/access.service";
import { DynamicFormBuilder } from "@app/shared/components/form-builder/form-builder.component";
import { NzModalModule } from "ng-zorro-antd/modal";
import { RoleAccess } from "./role-access.type";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Component({
  selector: "assign-access-form",
  templateUrl: "./assign-access-form.html",
  imports: [DynamicFormBuilder, NzModalModule],
  providers: [AccessService],
})
export class AssignAccessForm implements OnInit {

  public readonly access = input.required<Access>();
  private readonly accessService = inject(AccessService);
  private readonly notification = inject(NzNotificationService);

  public readonly roleOption = signal<FieldOption[]>([]);

  public readonly isLoading = signal<boolean>(false);
  public readonly formVisible = signal<boolean>(false);

  @ViewChild(DynamicFormBuilder) dynamicFormBuilder!: DynamicFormBuilder;

  public readonly formConfig = computed<FormConfig>(() => {
    return {
      fields: [
        {
          key: "roleId",
          type: "select",
          label: "Role",
          placeholder: "Select Role",
          validation: {
            required: true,
          },
          order: 1,
          options: this.roleOption()
        }
      ],
      columns: 1,
    };
  })

  ngOnInit(): void {
    this.isLoading.set(true);

    this.accessService.roleList().subscribe({
      next: (r) => {

        const roleOption: FieldOption[] = r.data.map((m) => {
          return {
            label: m.name,
            value: m.id,
          };
        });
        this.roleOption.set(roleOption);
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
    this.dynamicFormBuilder.submit();
  }

  createRoleAccess(roleAccess: RoleAccess): void {
    this.isLoading.set(true);

    roleAccess.accessId = this.access().id;
    this.accessService.assignAccess(roleAccess).subscribe({
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
    this.formVisible.set(false);
  }
}