import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '@app/core/auth/service/auth.service';
import { PermissionMapping, permissions } from './permission/permission-mapping';


export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
}

export const permissionGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const componentUrl: string = state.url;
  const permissionMapping: PermissionMapping[] = permissions.filter((f) => `/app/${f.url}` == componentUrl);

  if (permissionMapping.length <= 0) {
    return router.createUrlTree(["/unauthorized"]);
  }

  const userPermission = authService.getPermission();

  return userPermission.includes(permissionMapping[0].code) ? true : router.createUrlTree(["/unauthorized"]);
}
