import { Component, inject, input, OnInit, output, signal, ViewChild, viewChild } from "@angular/core";
import { AccessService } from "../../service/access.service";
import { Access } from "../../types/access.type";
import { FormConfig } from "@app/shared/components/form-builder/types/types";
import { DynamicFormBuilder } from "@app/shared/components/form-builder/form-builder.component";
import { NzModalModule } from "ng-zorro-antd/modal";

export type AccessResult = "success" | "failed";
export type FormMode = "read" | "create" | "update";

@Component({
  selector: "access-form",
  templateUrl: "./access-form.html",
  imports: [DynamicFormBuilder, NzModalModule],
  styleUrl: "./access-form.css",
})
export class AccessForm implements OnInit {

  private readonly accessService = inject(AccessService);

  public readonly mode = input<FormMode>("create");
  public readonly access = input<Access | undefined>(undefined);
  public readonly result = output<AccessResult>();
  public readonly formConfig = signal<FormConfig>({ fields: [] });
  public readonly displayForm = signal<boolean>(false);

  public showAction: boolean = true;

  @ViewChild(DynamicFormBuilder) dynamicFormBuilder!: DynamicFormBuilder;

  ngOnInit(): void {
    this.formConfig.set({
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
          ]
        },
        {
          key: "description",
          type: "text",
          label: "Description",
          placeholder: "Insert Access Description",
          value: this.access()?.description ?? undefined,
          disabled: this.mode() === "read",
          order: 4,
        },
      ],
      columns: 1,
    });
  }

  public openForm(): void {
    this.displayForm.set(true);
  }

  public closeForm(): void {
    this.displayForm.set(false);
  }

  public resolveOkFunction(): void {
    this.dynamicFormBuilder.submit();
  }

  public createAccess(access: Access): void {
    console.info("access", access);
    this.accessService.createAccess(access)
      .subscribe({
        next: (r) => {
          this.result.emit("success");
        },
        error: (er) => {
          this.result.emit("failed");
        }
      });
  }

  public onSubmit(access: Access): void {
    this.accessService.createAccess(access).subscribe({
      next: (r) => {
        this.result.emit("success")
      },
      error: (e) => {
        this.result.emit("failed");
      }
    })
  }

  public resolveShowActions(): boolean {
    return this.access() === undefined;
  }

  public resolveSubmitLabel(): string {
    return this.access() ? "Close" : "Create Access";
  }
}