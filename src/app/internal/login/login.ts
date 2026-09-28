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

@Component({
  imports: [FormsModule, NzAlertModule, NzButtonModule, NzCardModule, NzFormModule, NzIconModule, NzInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  username = '';
  password = '';
  readonly errorMessage = signal<string | null>(null);
  readonly isSubmitting = signal<boolean>(false);

  submit(): void {
    this.errorMessage.set('');
    this.isSubmitting.set(true);

    try {
      this.authService
        .login(this.username, this.password)
        .subscribe({
          next: (v) => {
            if (v) {
              const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || '/';
              this.router.navigateByUrl(returnUrl.startsWith('/') ? returnUrl : '/home');
            }
          },
          error: (e) => {
            if (e instanceof Error) {
              this.errorMessage.set(e.message);
              this.isSubmitting.set(false)
            }
          },
          complete: () => this.isSubmitting.set(false)
        })
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.errorMessage.set(e.message);
      }
    }
    // finally {
    //   this.isSubmitting.set(false);
    // }
  }
}
