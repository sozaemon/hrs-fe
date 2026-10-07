import { Component, computed, inject, input, model, output, signal, ViewChild } from "@angular/core";
import { RoleService } from "../../service/role.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Role } from "../../type/role.type";
import { FormConfig } from "@app/shared/components/form-builder/types/types";
import { DynamicFormBuilder } from "@app/shared/components/form-builder/form-builder.component";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { NzModalModule } from "ng-zorro-antd/modal";

@Component({
  selector: "role-form",
  templateUrl: "./role-form.html",
  providers: [RoleService],
  imports: [NzModalModule, DynamicFormBuilder]
})
export class RoleForm {
  private readonly roleService = inject(RoleService);
  private readonly notification = inject(NzNotificationService);

  public readonly mode = input<"view" | "create" | "update">("view");
  public readonly role = input<Role | undefined>(undefined);

  public readonly displayRoleForm = model<boolean>(false);

  public readonly isLoading = signal<boolean>(false);

  public readonly outputFlag = output<"created" | "updated" | "closed" | "fail">();

  public readonly formConfig = computed<FormConfig>(() => {
    return {
      fields: [
        {
          key: "code",
          type: "text",
          label: "Role Code",
          placeholder: "Insert Role Code",
          value: this.role()?.code ?? undefined,
          validation: {
            required: true
          },
          disabled: this.mode() === "view",
          order: 1
        },
        {
          key: "name",
          type: "text",
          label: "Name",
          placeholder: "Insert Role Name",
          value: this.role()?.name ?? undefined,
          validation: {
            required: true
          },
          disabled: this.mode() === "view",
          order: 2,
        },
        {
          key: "description",
          type: "text",
          label: "Description",
          placeholder: "Insert Description",
          value: this.role()?.description,
          disabled: this.mode() === "view",
          order: 3,
        },
        {
          key: "active",
          type: "radio",
          label: "Active",
          value: this.role()?.active ?? false,
          disabled: this.mode() === "view",
          options: [
            {
              value: true,
              label: "Active"
            },
            {
              value: false,
              label: "Not Active"
            }
          ],
          order: 4,
        }

      ]
    }
  })

  @ViewChild(DynamicFormBuilder) dynamicFormBuilder!: DynamicFormBuilder;

  public openForm() {
    this.displayRoleForm.set(true);
  }

  public closeForm() { this.displayRoleForm.set(false); }

  public resolveOkFunction(): void {
    this.dynamicFormBuilder.submit();
  }

  public onSubmit(role: Role): void {

    switch (this.mode()) {
      case "view":
        this.closeForm();
        break;
      case "create":
        this.createRole(role);
        break;
      case "update":
        this.updateRole(role);
        break;
    }
  }

  private createRole(role: Role): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    role.active = true;
    this.roleService.create(role).subscribe({
      next: (r) => {
        this.isLoading.set(false);
        this.notification.info("Success", "Success to create Role");
        this.outputFlag.emit("created");
        this.closeForm();
      },
      error: (e) => {
        this.isLoading.set(false);
        const message = resolveHttpErrorMessage(e);
        this.notification.error("Error", message);
        this.outputFlag.emit("fail");
      }
    })
  }

  private updateRole(role: Role): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    role.id = this.role()?.id ?? 0;
    this.roleService.update(role).subscribe({
      next: (r) => {
        this.isLoading.set(false);
        this.notification.info("Success", "Success to update Role");
        this.outputFlag.emit("updated");
        this.closeForm();
      },
      error: (e) => {
        this.isLoading.set(false);
        const message = resolveHttpErrorMessage(e);
        this.notification.error("Error", message);
        this.outputFlag.emit("fail");
      }
    })
  }
}