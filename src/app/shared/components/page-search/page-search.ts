import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AppRoutes, HrsRoutes } from "@app/routes/app.routes";
import { NzSelectComponent, NzOptionComponent } from "ng-zorro-antd/select";
import { AuthService } from "@app/core/auth/service/auth.service";
import { PermissionMapping, permissions } from "@app/core/auth/permission/permission-mapping";

interface MenuItem {
  label: string;
  value: string;
}
type MenuItems = MenuItem[];
@Component({
  selector: "page-search",
  templateUrl: "./page-search.html",
  imports: [NzSelectComponent, FormsModule, NzOptionComponent]
})
export class PageSearch implements OnInit {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private readonly allMenuItems = signal<MenuItems>([]);

  public readonly menuItems = signal<MenuItems>(this.allMenuItems());

  public selectedItem = signal<string | undefined>(undefined);

  public readonly filterFn = signal<boolean>(true);

  readonly appPermission = permissions;

  @ViewChild("pageSearch") pageSearchSelect!: NzSelectComponent;

  ngOnInit(): void {
    const menuItems = this.mapMenuItem(AppRoutes);
    this.allMenuItems.set(menuItems);
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

  private mapMenuItem(routeToMap: HrsRoutes, path?: string): MenuItems {

    let result: MenuItems = [];

    for (const i of routeToMap) {
      if (!i.path || i.redirectTo) {
        continue;
      }

      if (i.isHidden) {
        continue;
      }
      let currentPath = path ? `${path}/${i.path}` : i.path;
      if (i.children?.length) {
        const childrenPath = this.mapMenuItem(i.children, currentPath);
        result.push(...childrenPath);
      } else {
        const pageUrl = `app/${currentPath}`;
        if (!this.validatePagePermission(pageUrl)) {
          continue;
        }
        const label: string = typeof i.title === "string" ? i.title as string : i.path;
        result.push({
          label: label,
          value: `/app/${currentPath}`,
        })
      }
    }
    return result;
  }

  public onSearch(searchItem: string): void {

    searchItem = searchItem.toLocaleLowerCase();
    const searchedItem: MenuItems = this.allMenuItems().filter((f) => {
      return f.value.toLocaleLowerCase().includes(searchItem.toLocaleLowerCase())
        || f.label?.toLocaleLowerCase().includes(searchItem.toLocaleLowerCase());
    });
    this.menuItems.set(searchedItem);
  }

  public onSelectMenuItem(): void {

    if (this.selectedItem()) {
      const items = this.menuItems().filter((f) => f.value === this.selectedItem())

      if (items.length > 0) {
        this.pageSearchSelect.clearInput();
        this.router.navigateByUrl(items[0].value);
      }


    }

  }

}