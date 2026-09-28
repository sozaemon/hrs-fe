import { CommonModule } from '@angular/common';
import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilderService } from '@app/shared/components/form-builder/service/form-builder.service';
import { FieldOption, FormConfig, FormField, FormSize } from '@app/shared/components/form-builder/types/types';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'dynamic-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzSelectModule,
  ],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.css',
})
export class DynamicFormBuilderComponent {
  readonly config = input<FormConfig>({ fields: [] });
  readonly formSize = input<FormSize>('default');
  readonly submitLabel = input<string>('Submit');
  readonly showActions = input<boolean>(true);

  readonly submitted = output<Record<string, unknown>>();
  readonly valueChange = output<Record<string, unknown>>();

  form: FormGroup = new FormGroup({});

  constructor(private readonly formBuilderService: FormBuilderService) {
    effect(() => {
      const nextConfig = this.config() ?? { fields: [] };
      this.form = this.formBuilderService.createForm(nextConfig);
      this.form.valueChanges.subscribe((value) => this.valueChange.emit(value));
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }

  control(field: FormField): FormControl {
    return this.form.get(field.key) as FormControl;
  }

  inputType(field: FormField): string {
    switch (field.type) {
      case 'email':
        return 'email';
      case 'password':
        return 'password';
      case 'number':
        return 'number';
      default:
        return 'text';
    }
  }

  size(): FormSize {
    return this.config().formSize ?? this.formSize();
  }

  isInvalid(field: FormField): boolean {
    const control = this.control(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: FormField): string {
    const control = this.control(field);
    if (!control?.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${field.label} is required.`;
    }

    if (control.errors['email']) {
      return `${field.label} must be a valid email address.`;
    }

    if (control.errors['minlength']) {
      return `${field.label} must be at least ${control.errors['minlength'].requiredLength} characters.`;
    }

    if (control.errors['maxlength']) {
      return `${field.label} cannot exceed ${control.errors['maxlength'].requiredLength} characters.`;
    }

    if (control.errors['min']) {
      return `${field.label} must be greater than or equal to ${control.errors['min'].min}.`;
    }

    if (control.errors['max']) {
      return `${field.label} must be less than or equal to ${control.errors['max'].max}.`;
    }

    if (control.errors['pattern']) {
      return `${field.label} format is invalid.`;
    }

    if (field.validation?.custom) {
      const message = field.validation.custom(control.value);
      if (message) {
        return message;
      }
    }

    return `${field.label} is invalid.`;
  }

  get fieldOptions(): Record<string, FieldOption[]> {
    return Object.fromEntries(
      this.config().fields
        .filter((field) => field.options?.length)
        .map((field) => [field.key, field.options ?? []]),
    );
  }
}
