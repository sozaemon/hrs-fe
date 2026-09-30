import { NgTemplateOutlet } from "@angular/common";
import { Component, inject, input, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HrsRoutes, AppRoutes } from '@app/routes/app.routes';
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzIconModule } from "ng-zorro-antd/icon";

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
  private readonly route = inject(ActivatedRoute);
  readonly navigationItems = signal<NavigationItems[]>([]);
  readonly isCollapse = input.required<boolean>();

  ngOnInit(): void {

    const navItems = this.mapRoutes(AppRoutes);
    console.info(navItems);
    this.navigationItems.set(navItems);
  }

  private mapRoutes(routesToMap: HrsRoutes, parentRoute: string = ""): NavigationItems[] {
    return routesToMap
      .filter((route) => route.path && !route.redirectTo)
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
      this.router.navigate([route.trim()]);
    }
  }
}