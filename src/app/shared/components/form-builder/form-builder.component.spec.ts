import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DynamicFormBuilderComponent } from '@app/shared/components/form-builder/form-builder.component';

describe('DynamicFormBuilderComponent', () => {
  let fixture: ComponentFixture<DynamicFormBuilderComponent>;
  let component: DynamicFormBuilderComponent;

  const config = {
    columns: 2,
    fields: [
      {
        key: 'email',
        label: 'Email',
        type: 'email' as const,
        validation: { required: true, email: true },
      },
      {
        key: 'age',
        label: 'Age',
        type: 'number' as const,
        validation: { min: 18 },
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormBuilderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('formSize', 'small');
    fixture.detectChanges();
  });

  it('should create the form and apply validation rules', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('age')).toBeTruthy();
    expect(component.form.get('email')?.hasValidator).toBeTruthy();
  });

  it('should emit submitted value when valid', () => {
    const emitSpy = vi.fn();
    const subscription = component.submitted.subscribe(emitSpy);

    component.form.get('email')?.setValue('user@example.com');
    component.form.get('age')?.setValue(22);
    component.submit();

    expect(emitSpy).toHaveBeenCalledWith({ email: 'user@example.com', age: 22 });
    subscription.unsubscribe();
  });

  it('should expose the configured form size', () => {
    expect(component.size()).toBe('small');
  });
});
