import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ChangePasswordService } from "./change-password.service";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { NzCardModule } from "ng-zorro-antd/card";
import { CommonModule } from "@angular/common";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component(
  {
    templateUrl: "./change-password.html",
    providers: [ChangePasswordService],
    imports: [NzCardModule, CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule]
  }
)
export class ChangePassword {

  private readonly service = inject(ChangePasswordService);
  private readonly router = inject(Router);
  private readonly notification = inject(NzNotificationService);

  changePasswordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl("",
      [
        Validators.required,
      ]
    ),
    newPassword: new FormControl("",
      [
        Validators.required
      ]
    ),
    repeatPassword: new FormControl("",
      [
        Validators.required
      ]
    )
  })

  updatePassword(): void {
    console.info("values", this.changePasswordForm.value);
    if (this.changePasswordForm.valid) {

      const oldPassword: string = this.changePasswordForm.get("oldPassword")?.value;
      const newPassword: string = this.changePasswordForm.get("newPassword")?.value;
      const repeatPassword: string = this.changePasswordForm.get("repeatPassword")?.value;

      if (newPassword !== repeatPassword) {
        this.notification.warning("Warning", "Repeat Password is not matched");
        return;
      }
      this.service.changePassword({
        oldPassword: oldPassword,
        newPassword: newPassword
      }).subscribe({
        next: (r) => {
          void this.router.navigate(["/login"])
        }, error: (e) => {
          const errMessage = resolveHttpErrorMessage(e);
          this.notification.error("Error", errMessage);
        }
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  backToHome(): void {
    void this.router.navigate(["/app/home"]);
  }
}