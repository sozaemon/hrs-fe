import { Component, computed, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NgComponentOutlet } from "@angular/common";
import { ActivatedRouteSnapshot, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { AuthService } from "@app/core/auth/service/auth.service";
import { NavigationPanel } from "@app/shared/components/navigation-panel/navigation-panel";
import { UserInfo } from "@app/shared/components/user-info/user-info";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { PageSearch } from "@app/shared/components/page-search/page-search";
import { AppTab } from "./main.type";

@Component({
  imports: [
    NzAvatarModule, NzBreadCrumbModule, NzButtonModule, NzCardModule,
    NzIconModule, NzLayoutModule, NzStatisticModule,
    UserInfo, NavigationPanel, NzTabsModule,
    PageSearch,
    NgComponentOutlet
  ],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit {
  private readonly maxTabs = 10;
  private readonly homeUrl = "/app/home";
  private homeComponentPromise?: Promise<AppTab["component"]>;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly isCollapsed = signal(false);
  readonly tabs = signal<AppTab[]>([]);
  readonly currentHoverTabKey = signal<string | undefined>(undefined);
  readonly homeTabKey = this.homeUrl;

  readonly selectedTabIndex = computed(() => {
    return Math.max(0, this.tabs().findIndex((tab) => tab.active));
  });

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => void this.createAndNavigateToTab(event.urlAfterRedirects));

    void this.loadHomeComponent().then(() => {
      if (this.router.navigated) {
        void this.createAndNavigateToTab(this.router.url);
      }
    });
  }

  private async loadHomeComponent(): Promise<void> {
    const existingHomeTab = this.tabs().find((tab) => tab.key === this.homeTabKey);
    if (existingHomeTab) {
      this.tabs.update((currentTabs) => [
        existingHomeTab,
        ...currentTabs.filter((tab) => tab.key !== this.homeTabKey),
      ]);
      return;
    }

    const homeComponent = await this.getHomeComponent();
    this.tabs.update((currentTabs) => {
      if (currentTabs.some((tab) => tab.key === this.homeTabKey)) {
        return currentTabs;
      }
      return [{
        name: "Home",
        component: homeComponent,
        key: this.homeTabKey,
        url: this.homeUrl,
        active: false,
      }, ...currentTabs];
    });
  }

  private async createAndNavigateToTab(url: string): Promise<void> {
    const pageRoute = this.getPageRoute();
    const component = pageRoute?.component;
    if (!component || component === Main) {
      return;
    }

    await this.loadHomeComponent();
    const currentTabs = this.tabs();
    const homeTab = currentTabs.find((tab) => tab.key === this.homeTabKey);
    if (!homeTab) {
      return;
    }
    const otherTabs = currentTabs.filter((tab) => tab.key !== this.homeTabKey);

    if (component === homeTab.component) {
      this.tabs.set([
        { ...homeTab, active: true },
        ...otherTabs.map((tab) => ({ ...tab, active: false })),
      ]);
      return;
    }

    const existingTab = otherTabs.some((tab) => tab.key === url);
    const nextOtherTabs = existingTab
      ? otherTabs.map((tab) => ({ ...tab, active: tab.key === url }))
      : [
        ...otherTabs.map((tab) => ({ ...tab, active: false })),
        {
          name: pageRoute.title ?? component.name ?? url,
          component,
          key: url,
          url,
          active: true,
        },
      ];
    const maxOtherTabs = this.maxTabs - 1;
    const visibleOtherTabs = nextOtherTabs.slice(-maxOtherTabs);

    this.tabs.set([{ ...homeTab, active: false }, ...visibleOtherTabs]);
  }

  private getHomeComponent(): Promise<AppTab["component"]> {
    this.homeComponentPromise ??= import("@app/internal/home/dashboard/dashboard")
      .then(({ Dashboard }) => Dashboard);
    return this.homeComponentPromise;
  }

  private getPageRoute(): ActivatedRouteSnapshot | undefined {
    let currentRoute: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    let pageRoute: ActivatedRouteSnapshot | undefined;

    while (currentRoute) {
      if (currentRoute.component && currentRoute.component !== Main) {
        pageRoute = currentRoute;
      }
      currentRoute = currentRoute.firstChild;
    }

    return pageRoute;
  }

  selectTab(index: number): void {
    const tab = this.tabs()[index];
    if (tab && !tab.active) {
      void this.router.navigateByUrl(tab.url);
    }
  }

  disposeTab(event: { index: number }): void {
    const currentTabs = this.tabs();
    const closingTab = currentTabs[event.index];

    if (!closingTab || closingTab.key === this.homeTabKey) {
      return;
    }

    const remainingTabs = currentTabs.filter((_, index) => index !== event.index);
    if (remainingTabs.length === 0) {
      this.tabs.set([]);
      void this.router.navigateByUrl(this.homeUrl);
      return;
    }

    if (!closingTab.active) {
      this.tabs.set(remainingTabs);
      return;
    }

    const nextActiveIndex = Math.min(event.index, remainingTabs.length - 1);
    const nextActiveTab = remainingTabs[nextActiveIndex];
    this.tabs.set(
      remainingTabs.map((tab, index) => ({ ...tab, active: index === nextActiveIndex })),
    );
    void this.router.navigateByUrl(nextActiveTab.url);
  }

  mouseOverTab(tab: AppTab) {
    this.currentHoverTabKey.set(tab.key ?? undefined);
  }


  toggleCollapsed(): void {
    this.isCollapsed.update((collapsed) => !collapsed);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}