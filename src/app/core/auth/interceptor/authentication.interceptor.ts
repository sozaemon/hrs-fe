import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { AuthService } from "@app/core/auth/service/auth.service";
import { catchError, switchMap, throwError } from "rxjs";

export const AuthenticationInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {

  const message = inject(NzMessageService);
  const authService = inject(AuthService);

  const isLoginOrRefreshToken = (): boolean => {
    return request.url.includes("/refresh-token") || request.url.includes("/login");
  }

  return next(request).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === HttpStatusCode.Unauthorized) {
          if (isLoginOrRefreshToken()) {
            authService.logOutAndReturnToLogin();
            message.error("authentication failed");
            return throwError(() => err);
          }

          return authService.refreshToken().pipe(
            switchMap(() => {
              return next(request);
            }),
            catchError(refreshError => {
              authService.logOutAndReturnToLogin();
              return throwError(() => refreshError);
            })
          )
        }
      }
      return throwError(() => err);
    })
  )
}