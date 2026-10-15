import { Component, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@app/core/auth/service/auth.service";
import { UserService } from "@app/shared/components/user-info/user.service";
import { ɵNzTransitionPatchDirective } from "ng-zorro-antd/core/transition-patch";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzDropdownModule } from "ng-zorro-antd/dropdown";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Component({
  selector: "user-info",
  templateUrl: './user-info.html',
  styleUrl: './user-info.css',
  imports: [ɵNzTransitionPatchDirective, NzAvatarModule, NzButtonModule, NzIconModule, NzDropdownModule]
})
export class UserInfo implements OnInit {
  readonly userName = signal<string | null>(null);
  readonly userRole = signal<string | null>(null);
  readonly loadUsername = signal<boolean>(false);

  readonly userService = inject(UserService);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly notification = inject(NzNotificationService);

  ngOnInit(): void {
    this.loadUsername.set(true);

    this.userService.fetchUserData()
      .subscribe({
        next: (r) => {
          this.userName.set(r?.data.fullName || null);
          // this.userEmail.set(r?.data.email || null)
          this.loadUsername.set(false);
        },
        error: (e) => {
          this.loadUsername.set(false);
        }
      })
    this.userService.fetchRole().subscribe({
      next: (r) => this.userRole.set(r?.data),
      error: (e) => {
        const msg = resolveHttpErrorMessage(e);
        this.notification.error("Error", msg);
      }
    })
  }

  logOut(): void {
    this.authService.logout().subscribe(() => {
      void this.router.navigate(['/login']);
    });
  }

}