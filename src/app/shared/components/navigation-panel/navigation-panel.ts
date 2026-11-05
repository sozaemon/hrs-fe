import { NgTemplateOutlet } from "@angular/common";
import { Component, inject, input, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { HrsRoutes, AppRoutes } from '@app/routes/app.routes';
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzIconModule } from "ng-zorro-antd/icon";
import { AuthService } from "@app/core/auth/service/auth.service";
import { PermissionMapping, permissions } from "@app/core/auth/permission/permission-mapping";

interface NavigationItems {
  title?: string;
  url?: string;
  icon?: string;
  children?: NavigationItems[];
}

@Component({
  imports: [
    NgTemplateOutlet,
    NzMenuModule,
    NzIconModule,
  ],
  selector: "nav-panel",
  templateUrl: "./navigation-panel.html",
  styleUrl: "./navigation-panel.css",
})
export class NavigationPanel implements OnInit {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly navigationItems = signal<NavigationItems[]>([]);
  readonly isCollapse = input.required<boolean>();

  readonly appPermission = permissions;

  ngOnInit(): void {
    const navItems = this.mapRoutes(AppRoutes);
    this.navigationItems.set(navItems);
  }

  validatePagePermission(pageUrl?: string): boolean {

    // exclude home 
    if (pageUrl === "app/home" || pageUrl === "app/home/dashboard") {
      return true;
    }
    const userPermission: string[] = this.authService.getPermission();
    const permissionMapping: PermissionMapping[] = this.appPermission.filter((f) => `app/${f.url}` === pageUrl);
    if (permissionMapping.length) {
      return userPermission.includes(permissionMapping[0].code);
    }

    return false;
  }

  private mapRoutes(routesToMap: HrsRoutes, parentRoute: string = ""): NavigationItems[] {
    return routesToMap
      .filter((route) => route.path && !route.redirectTo && !route.isHidden)
      .map((route) => {

        let urlRoute = [parentRoute, route.path].join("/");

        if (!urlRoute.startsWith("app/")) {
          urlRoute = "app" + urlRoute;
        }
        return {
          title: typeof route.title === "string" ? route.title : route.path,
          url: urlRoute,
          icon: route.icon,
          children: route.children?.length ? this.mapRoutes(route.children, [parentRoute, route.path].join("/")) : []
        };

      });
  }

  navigateToRoute(route?: string): void {
    if (route) {
      void this.router.navigate([route.trim()]);
    }
  }
}