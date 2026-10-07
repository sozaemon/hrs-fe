import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { AuthService } from "@app/core/auth/service/auth.service";
import { catchError, switchMap, throwError } from "rxjs";

export const AuthenticationInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {

  const router = inject(Router);
  const message = inject(NzMessageService);
  const authService = inject(AuthService);

  const logOutAndReturnToLogin = () => {
    authService.revokeAuthentication();

    if (router.url !== "/login") {
      void router.navigate(["/login"], { queryParams: { returnUrl: router.url } });
    }
  }

  const isLoginOrRefreshToken = (): boolean => {
    return request.url.includes("/refresh-token") || request.url.includes("/login");
  }
  const clonedRequest = request.clone();

  return next(clonedRequest).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === HttpStatusCode.Unauthorized) {
          if (isLoginOrRefreshToken()) {
            logOutAndReturnToLogin();
            message.error("authentication failed");
            return throwError(() => err);
          }

          return authService.refreshToken().pipe(
            switchMap(() => next(clonedRequest)),
            catchError(refreshError => {
              logOutAndReturnToLogin();
              return throwError(() => err);
            })
          )
        }
      }
      return throwError(() => err);
    })
  )
}