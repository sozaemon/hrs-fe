import { Component, computed, inject, input, model, output, signal, ViewChild } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalModule } from "ng-zorro-antd/modal";
import { DynamicFormBuilder } from "@app/shared/components/form-builder/form-builder.component";
import { FormConfig } from "@app/shared/components/form-builder/types/types";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { ShiftToleranceService } from "../../services/shift-tolerance.service";
import { ShiftTolerance } from "../../types/shift-tolerance.type";

@Component({
  selector: "shift-tolerance-form",
  templateUrl: "./shift-tolerance.from.html",
  providers: [ShiftToleranceService],
  imports: [NzModalModule, DynamicFormBuilder],
})
export class ShiftToleranceForm {
  private readonly shiftToleranceService = inject(ShiftToleranceService);
  private readonly notification = inject(NzNotificationService);

  public readonly mode = input<"view" | "create" | "update">("view");
  public readonly shiftTolerance = input<ShiftTolerance | undefined>(undefined);

  public readonly displayShiftToleranceForm = model<boolean>(false);
  public readonly isLoading = signal<boolean>(false);
  public readonly outputFlag = output<"created" | "updated" | "closed" | "fail">();

  public readonly formConfig = computed<FormConfig>(() => ({
    fields: [
      {
        key: "code",
        type: "text",
        label: "Shift Tolerance Code",
        placeholder: "Insert Shift Tolerance Code",
        value: this.shiftTolerance()?.code ?? undefined,
        validation: { required: true },
        disabled: this.mode() === "view",
        order: 1,
      },
      {
        key: "toleranceName",
        type: "text",
        label: "Tolerance Name",
        placeholder: "Insert Tolerance Name",
        value: this.shiftTolerance()?.toleranceName ?? undefined,
        validation: { required: true },
        disabled: this.mode() === "view",
        order: 2,
      },
      {
        key: "toleranceBefore",
        type: "number",
        label: "Tolerance Before",
        placeholder: "Insert Before Value",
        value: this.shiftTolerance()?.toleranceBefore ?? undefined,
        validation: { required: true },
        disabled: this.mode() === "view",
        order: 3,
      },
      {
        key: "toleranceBeforeUnit",
        type: "select",
        label: "Before Unit",
        placeholder: "Select Before Unit",
        value: this.shiftTolerance()?.toleranceBeforeUnit ?? "HOUR",
        validation: { required: true },
        disabled: this.mode() === "view",
        options: [
          { label: "Hour", value: "HOUR" },
          { label: "Minute", value: "MINUTE" },
        ],
        order: 4,
      },
      {
        key: "toleranceAfter",
        type: "number",
        label: "Tolerance After",
        placeholder: "Insert After Value",
        value: this.shiftTolerance()?.toleranceAfter ?? undefined,
        validation: { required: true },
        disabled: this.mode() === "view",
        order: 5,
      },
      {
        key: "toleranceAfterUnit",
        type: "select",
        label: "After Unit",
        placeholder: "Select After Unit",
        value: this.shiftTolerance()?.toleranceAfterUnit ?? "HOUR",
        validation: { required: true },
        disabled: this.mode() === "view",
        options: [
          { label: "Hour", value: "HOUR" },
          { label: "Minute", value: "MINUTE" },
        ],
        order: 6,
      },
    ],
  }));

  @ViewChild(DynamicFormBuilder) dynamicFormBuilder!: DynamicFormBuilder;

  public openForm(): void {
    // no-op; controlled by parent binding when required
  }

  public closeForm(): void {
    this.displayShiftToleranceForm.set(false);
  }

  public resolveOkFunction(): void {
    this.dynamicFormBuilder.submit();
  }

  public onSubmit(shiftTolerance: ShiftTolerance): void {
    switch (this.mode()) {
      case "view":
        this.closeForm();
        break;
      case "create":
        this.createShiftTolerance(shiftTolerance);
        break;
      case "update":
        this.updateShiftTolerance(shiftTolerance);
        break;
    }
  }

  private createShiftTolerance(shiftTolerance: ShiftTolerance): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    this.shiftToleranceService.createShiftTolerance(shiftTolerance).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notification.info("Success", "Success to create Shift Tolerance");
        this.outputFlag.emit("created");
        this.closeForm();
      },
      error: (e) => {
        this.isLoading.set(false);
        this.notification.error("Error", resolveHttpErrorMessage(e));
        this.outputFlag.emit("fail");
      },
    });
  }

  private updateShiftTolerance(shiftTolerance: ShiftTolerance): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    shiftTolerance.id = this.shiftTolerance()?.id ?? 0;

    this.shiftToleranceService.updateShiftTolerance(shiftTolerance).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notification.info("Success", "Success to update Shift Tolerance");
        this.outputFlag.emit("updated");
        this.closeForm();
      },
      error: (e) => {
        this.isLoading.set(false);
        this.notification.error("Error", resolveHttpErrorMessage(e));
        this.outputFlag.emit("fail");
      },
    });
  }
}