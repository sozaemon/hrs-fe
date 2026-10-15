import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '@app/core/auth/service/auth.service';
import { Role } from '@app/core/auth/types/auth.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { resolveHttpErrorMessage } from '@app/shared/utility/error-utility';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStepsModule } from 'ng-zorro-antd/steps';

@Component({
  imports: [FormsModule, NzAlertModule, NzButtonModule, NzCardModule,
    NzFormModule, NzIconModule, NzInputModule, NzSelectModule,
    NzStepsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  readonly notification = inject(NzNotificationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  username: string = '';
  password: string = '';
  readonly role = signal<string>("");
  readonly errorMessage = signal<string | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly roles = signal<Role[]>([]);

  currentStep: number = 0;

  loadRole(): void {

    this.isSubmitting.set(true);

    console.info("load role", this.username, this.password);

    this.authService.getRole({
      userName: this.username,
      password: this.password,
    }).subscribe({
      next: (r) => {
        this.roles.set(r.data || []);
        this.currentStep = 1;
      },
      error: (err) => {
        const errMessage = resolveHttpErrorMessage(err);
        this.notification.error("Error", errMessage);
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false)
    })
  }

  backToLogin(): void { this.currentStep = 0; }

  submit(): void {

    if (this.currentStep == 0) {
      return;
    }
    this.errorMessage.set('');
    this.isSubmitting.set(true);

    try {
      this.authService
        .login({ userName: this.username, password: this.password, role: this.role() })
        .subscribe({
          next: (v) => {
            if (v) {
              const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || '/';
              void this.router.navigateByUrl(returnUrl.startsWith('/') ? returnUrl : '/home');
            }
          },
          error: (e) => {
            const errMessage = resolveHttpErrorMessage(e);
            this.notification.error("Error", errMessage);
            this.isSubmitting.set(false);
          },
          complete: () => this.isSubmitting.set(false)
        })
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.errorMessage.set(e.message);
      }
    }
  }
}
