import { inject, Injectable } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { FormConfig, FormField } from "../types/types";

@Injectable({ providedIn: "root" })
export class FormBuilderService {
  readonly formBuilder = inject(FormBuilder);

  createForm(config: FormConfig): FormGroup {
    try {
      const group: Record<string, FormControl> = {};

      const sortedField = this.sortFields(config.fields ?? []);

      sortedField.forEach((field) => {
        group[field.key] = new FormControl(
          {
            value: field.value ?? null,
            disabled: field.disabled || false,
          },
          this.buildValidators(field)
        );
      });

      return this.formBuilder.group(group);
    } catch (e) {
      throw new Error(`Failed to create form; ${e}`);
    }
  }

  private buildValidators(field: FormField): ValidatorFn[] {
    const validation = field.validation ?? {};
    const validators: ValidatorFn[] = [];

    if (validation.required) {
      validators.push(Validators.required);
    }

    if (field.type === "email" || validation.email) {
      validators.push(Validators.email);
    }

    if (validation.minLength !== undefined) {
      validators.push(Validators.minLength(validation.minLength));
    }

    if (validation.maxLength !== undefined) {
      validators.push(Validators.maxLength(validation.maxLength));
    }

    if (validation.min !== undefined) {
      validators.push(Validators.min(validation.min));
    }

    if (validation.max !== undefined) {
      validators.push(Validators.max(validation.max));
    }

    if (validation.pattern) {
      validators.push(Validators.pattern(validation.pattern));
    }

    if (validation.custom) {
      validators.push((control) => {
        const message = validation.custom?.(control.value);
        return message ? { custom: message } : null;
      });
    }

    return validators;
  }

  private sortFields(fields: FormField[]): FormField[] {
    return [...fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
}