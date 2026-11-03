import { Component, computed, inject, input, model, OnChanges, OnDestroy, OnInit, output, signal, SimpleChanges, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzCheckboxModule, NzCheckboxOption } from "ng-zorro-antd/checkbox";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { catchError, EMPTY, Subscription, switchMap } from "rxjs";
import { DynamicFormBuilder } from "@app/shared/components/form-builder/form-builder.component";
import { FormConfig, FormField } from "@app/shared/components/form-builder/types/types";
import { PaginationRequest } from "@app/shared/components/data-table/types/pagination-request";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { UserService } from "../../service/user.service";
import { User } from "../../type/user.type";

@Component({
  selector: "user-form",
  templateUrl: "./user-form.html",
  providers: [UserService],
  imports: [NzModalModule, DynamicFormBuilder, NzCheckboxModule, FormsModule],
})
export class UserForm implements OnInit, OnChanges, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly notification = inject(NzNotificationService);

  private rolesSubscription?: Subscription;
  private assignedRoleSubscription?: Subscription;

  public readonly mode = input<"view" | "create" | "update">("view");
  public readonly user = input<User | undefined>(undefined);

  public readonly displayUserForm = model<boolean>(false);
  public readonly isLoading = signal<boolean>(false);
  public readonly isRoleLoading = signal<boolean>(false);
  public readonly outputFlag = output<"created" | "updated" | "closed" | "fail">();

  public readonly roleOptions = signal<NzCheckboxOption[]>([]);
  public readonly assignedRole = signal<number[]>([]);

  public readonly formConfig = computed<FormConfig>(() => {
    const isCreate = this.mode() === "create";
    const disabled = this.mode() === "view";

    const fields: FormField[] = [
      {
        key: "userName",
        type: "text",
        label: "Username",
        placeholder: "Insert Username",
        value: this.user()?.userName ?? undefined,
        validation: { required: true },
        disabled: disabled || !isCreate,
        order: 1,
      },
      {
        key: "fullName",
        type: "text",
        label: "Full Name",
        placeholder: "Insert Full Name",
        value: this.user()?.fullName ?? undefined,
        validation: { required: true },
        disabled,
        order: 2,
      },
      {
        key: "email",
        type: "email",
        label: "Email",
        placeholder: "Insert Email",
        value: this.user()?.email ?? undefined,
        validation: { required: true, email: true },
        disabled,
        order: 3,
      },
      {
        key: "expiryDate",
        type: "date",
        label: "Expiry Date",
        placeholder: "Select Expiry Date",
        value: this.parseDateTime(this.user()?.expiryDate),
        disabled,
        order: 4,
      },
    ];

    if (isCreate) {
      fields.push({
        key: "plainPassword",
        type: "password",
        label: "Password",
        placeholder: "Insert Password",
        validation: { required: true },
        order: 5,
      });
    }

    return { fields };
  });

  @ViewChild(DynamicFormBuilder) dynamicFormBuilder!: DynamicFormBuilder;

  public ngOnInit(): void {
    this.loadRoles();
  }

  public ngOnChanges(changes: SimpleChanges<UserForm>): void {
    this.assignedRole.set([]);

    if (!changes["user"] && !changes["mode"]) {
      return;
    }

    if (this.mode() === "create") {
      return;
    }

    const userId = this.user()?.id;

    if (!userId) {
      return;
    }

    this.assignedRoleSubscription?.unsubscribe();
    this.isRoleLoading.set(true);

    this.assignedRoleSubscription = this.userService.getUserRoles(userId).subscribe({
      next: (r) => {
        this.assignedRole.set(r.data.map((role) => role.id));
        this.isRoleLoading.set(false);
      },
      error: (e) => {
        this.notification.error("Error", resolveHttpErrorMessage(e));
        this.isRoleLoading.set(false);
      },
    });
  }

  public ngOnDestroy(): void {
    this.rolesSubscription?.unsubscribe();
    this.assignedRoleSubscription?.unsubscribe();
  }

  private loadRoles(): void {
    const request: PaginationRequest = {
      page: 1,
      pageSize: 100,
      filter: [],
    };

    this.rolesSubscription?.unsubscribe();
    this.isRoleLoading.set(true);

    this.rolesSubscription = this.userService.roleList(request).subscribe({
      next: (r) => {
        this.roleOptions.set(r.data.data.map((role) => ({
          label: role.name,
          value: role.id,
        })));
        this.isRoleLoading.set(false);
      },
      error: (e) => {
        this.notification.error("Error", resolveHttpErrorMessage(e));
        this.isRoleLoading.set(false);
      },
    });
  }

  public closeForm(): void {
    this.displayUserForm.set(false);
  }

  public resolveOkFunction(): void {
    if (this.isRoleLoading()) {
      return;
    }

    this.dynamicFormBuilder.submit();
  }

  public onSubmit(user: User): void {
    switch (this.mode()) {
      case "view":
        this.closeForm();
        break;
      case "create":
        this.createUser(user);
        break;
      case "update":
        this.updateUser(user);
        break;
    }
  }

  private createUser(user: User): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    this.userService.create(this.normalize(user))
      .pipe(
        catchError((e) => {
          this.isLoading.set(false);
          this.notification.error("Error", resolveHttpErrorMessage(e));
          this.outputFlag.emit("fail");
          return EMPTY;
        }),
        switchMap((r) => this.userService.assignUserRole({
          userId: r.data.id ?? 0,
          roleId: this.assignedRole(),
        }))
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.notification.info("Success", "Success to create User");
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

  private updateUser(user: User): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    const payload = this.normalize(user);
    payload.id = this.user()?.id ?? 0;

    this.userService.update(payload)
      .pipe(
        catchError((e) => {
          this.isLoading.set(false);
          this.notification.error("Error", resolveHttpErrorMessage(e));
          this.outputFlag.emit("fail");
          return EMPTY;
        }),
        switchMap(() => this.userService.assignUserRole({
          userId: payload.id ?? 0,
          roleId: this.assignedRole(),
        }))
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.notification.info("Success", "Success to update User");
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

  private normalize(user: User): User {
    const { plainPassword, ...rest } = user;
    const payload: User = { ...rest };

    if (this.mode() === "create" && plainPassword) {
      payload.plainPassword = plainPassword;
    }

    if (payload.expiryDate instanceof Date) {
      payload.expiryDate = this.formatDateTime(payload.expiryDate);
    }

    return payload;
  }

  private parseDateTime(value?: string | Date): Date | undefined {
    if (!value) {
      return undefined;
    }

    if (value instanceof Date) {
      return value;
    }

    const parsed = new Date(value.replace(" ", "T"));
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  private formatDateTime(value: Date): string {
    const pad = (part: number): string => `${part}`.padStart(2, "0");
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} `
      + `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
  }
}
