import { Component, inject, signal } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from "@app/core/auth/service/auth.service";
import { NavigationPanel } from "@app/shared/components/navigation-panel/navigation-panel";
import { UserInfo } from "@app/shared/components/user-info/user-info";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { PageSearch } from "@app/shared/components/page-search/page-search";

@Component({
  imports: [
    RouterOutlet,
    NzAvatarModule, NzBreadCrumbModule, NzButtonModule, NzCardModule,
    NzIconModule, NzLayoutModule, NzStatisticModule,
    UserInfo, NavigationPanel,
    PageSearch
  ],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly isCollapsed = signal(false);

  toggleCollapsed(): void {
    this.isCollapsed.update((collapsed) => !collapsed);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
