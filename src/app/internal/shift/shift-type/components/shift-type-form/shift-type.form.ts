import { Component, computed, inject, input, model, output, signal, ViewChild } from "@angular/core";
import { ShiftTypeService } from "../../service/shift_type.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ShiftType } from "../../types/shift_type.type";
import { FormConfig } from "@app/shared/components/form-builder/types/types";
import { DynamicFormBuilder } from "@app/shared/components/form-builder/form-builder.component";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { NzModalModule } from "ng-zorro-antd/modal";

@Component({
  selector: "shift-type-form",
  templateUrl: "./shift-type.form.html",
  providers: [ShiftTypeService],
  imports: [NzModalModule, DynamicFormBuilder]
})
export class ShiftTypeForm {
  private readonly shiftTypeService = inject(ShiftTypeService);
  private readonly notification = inject(NzNotificationService);

  public readonly mode = input<"view" | "create" | "update">("view");
  public readonly shiftType = input<ShiftType | undefined>(undefined);

  public readonly displayShiftTypeForm = model<boolean>(false);
  public readonly isLoading = signal<boolean>(false);
  public readonly outputFlag = output<"created" | "updated" | "closed" | "fail">();

  public readonly formConfig = computed<FormConfig>(() => ({
    fields: [
      {
        key: "code",
        type: "text",
        label: "Shift Type Code",
        placeholder: "Insert Shift Type Code",
        value: this.shiftType()?.code ?? undefined,
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
        placeholder: "Insert Shift Type Name",
        value: this.shiftType()?.name ?? undefined,
        validation: {
          required: true
        },
        disabled: this.mode() === "view",
        order: 2
      }
    ]
  }));

  @ViewChild(DynamicFormBuilder) dynamicFormBuilder!: DynamicFormBuilder;

  public openForm(): void {
    this.displayShiftTypeForm.set(true);
  }

  public closeForm(): void {
    this.displayShiftTypeForm.set(false);
  }

  public resolveOkFunction(): void {
    this.dynamicFormBuilder.submit();
  }

  public onSubmit(shiftType: ShiftType): void {
    switch (this.mode()) {
      case "view":
        this.closeForm();
        break;
      case "create":
        this.createShiftType(shiftType);
        break;
      case "update":
        this.updateShiftType(shiftType);
        break;
    }
  }

  private createShiftType(shiftType: ShiftType): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    this.shiftTypeService.createShiftType(shiftType).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notification.info("Success", "Success to create Shift Type");
        this.outputFlag.emit("created");
        this.closeForm();
      },
      error: (e) => {
        this.isLoading.set(false);
        const message = resolveHttpErrorMessage(e);
        this.notification.error("Error", message);
        this.outputFlag.emit("fail");
      }
    });
  }

  private updateShiftType(shiftType: ShiftType): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    shiftType.id = this.shiftType()?.id ?? 0;

    this.shiftTypeService.updateShiftType(shiftType).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notification.info("Success", "Success to update Shift Type");
        this.outputFlag.emit("updated");
        this.closeForm();
      },
      error: (e) => {
        this.isLoading.set(false);
        const message = resolveHttpErrorMessage(e);
        this.notification.error("Error", message);
        this.outputFlag.emit("fail");
      }
    });
  }
}
