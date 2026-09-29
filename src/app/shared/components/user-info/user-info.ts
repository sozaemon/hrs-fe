import { Component, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@app/core/auth/service/auth.service";
import { UserService } from "@app/shared/components/user-info/user.service";
import { ɵNzTransitionPatchDirective } from "ng-zorro-antd/core/transition-patch";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";

@Component({
  selector: "user-info",
  templateUrl: './user-info.html',
  styleUrl: './user-info.css',
  imports: [ɵNzTransitionPatchDirective, NzAvatarModule, NzButtonModule, NzIconModule]
})
export class UserInfo implements OnInit {
  readonly userName = signal<string | null>(null);
  readonly userEmail = signal<string | null>(null);
  readonly loadUsername = signal<boolean>(false);

  readonly userService = inject(UserService);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  ngOnInit(): void {
    this.loadUsername.set(true);

    // this.userService.fetchUserData().subscribe(r => {
    //   this.userName.set(r?.data.fullName || null);
    //   this.userEmail.set(r?.data.email || null)
    //   this.loadUsername.set(false);
    // })

    this.userService.fetchUserData()
      .subscribe({
        next: (r) => {
          this.userName.set(r?.data.fullName || null);
          this.userEmail.set(r?.data.email || null)
          this.loadUsername.set(false);
        },
        error: (e) => {
          this.loadUsername.set(false);
        }
      })
  }

  logOut(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}