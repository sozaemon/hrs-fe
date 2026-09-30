import { Component, computed, inject, input, output, signal, ViewChild } from "@angular/core";
import { DynamicFormBuilder } from "@app/shared/components/form-builder/form-builder.component";
import { FormConfig } from "@app/shared/components/form-builder/types/types";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { AccessService } from "../../service/access.service";
import { Access } from "../../types/access.type";

export type AccessResult = "success" | "failed";
export type FormMode = "read" | "create" | "update";

@Component({
  selector: "access-form",
  templateUrl: "./access-form.html",
  imports: [DynamicFormBuilder, NzModalModule],
  styleUrl: "./access-form.css",
})
export class AccessForm {

  private readonly accessService = inject(AccessService);

  private readonly notification = inject(NzNotificationService);

  public readonly mode = input<FormMode>("create");
  public readonly access = input<Access | undefined>(undefined);
  public readonly result = output<AccessResult>();

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
        }
      ],
      columns: 1,
    };
  });

  public readonly displayForm = signal<boolean>(false);

  public showAction: boolean = true;

  @ViewChild(DynamicFormBuilder) dynamicFormBuilder!: DynamicFormBuilder;

  public openForm(): void {
    this.displayForm.set(true);
  }

  public closeForm(): void {
    this.displayForm.set(false);
  }

  public resolveOkFunction(): void {
    this.dynamicFormBuilder.submit();
  }

  public onSubmit(access: Access): void {

    switch (this.mode()) {
      case "create":
        this.createAccess(access);
        break;
      case "update":
        this.updateAccess(access);
        break;
      default:
        this.closeForm();
    }
  }


  private createAccess(access: Access): void {
    this.accessService.createAccess(access).subscribe({
      next: (r) => {
        this.notification.info("Success", "Access Created");
        this.result.emit("success")
      },
      error: (er) => {
        let message = "unknown error";
        if (er instanceof Error) {
          message = er.message;
        }
        this.notification.error("Error", message);
        this.result.emit("failed");
      }
    })
  }
  private updateAccess(access: Access): void {
    this.accessService.updateAccess(access).subscribe({
      next: (r) => {
        this.notification.info("Success", "Access Updated");
        this.result.emit("success");
      },
      error: (er) => {
        let message = "unknown error";
        if (er instanceof Error) {
          message = er.message;
        }
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