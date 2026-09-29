import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { catchError, throwError } from "rxjs";
import { AuthService } from "@app/core/auth/service/auth.service";

export const HttpErrorInterceptors: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {

  const router = inject(Router);
  const message = inject(NzMessageService);
  const authService = inject(AuthService);

  const logOutAndReturnToLogin = () => {
    authService.revokeAuthentication();

    if (router.url !== "/login") {
      router.navigate(["/login"], { queryParams: { returnUrl: router.url } });
    }
  }

  const isLoginOrRefreshToken = (): boolean => {
    return request.url.includes("/refresh-token") || request.url.includes("/login");
  }

  return next(request).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse) {
        switch (err.status) {
          case HttpStatusCode.BadRequest:
          case HttpStatusCode.Forbidden:
          case HttpStatusCode.NotFound:
          case HttpStatusCode.RequestTimeout:
          case HttpStatusCode.Conflict:
          case HttpStatusCode.UnprocessableEntity:
          case HttpStatusCode.TooManyRequests:
          case HttpStatusCode.InternalServerError:
          case HttpStatusCode.BadGateway:
          case HttpStatusCode.ServiceUnavailable:
          case HttpStatusCode.GatewayTimeout:
            if ([HttpStatusCode.ServiceUnavailable, HttpStatusCode.GatewayTimeout].includes(err.status) && !isLoginOrRefreshToken()) {
              logOutAndReturnToLogin();
              message.error(getErrorMessage(err));
              return throwError(() => err);
            }
            message.error(getErrorMessage(err));
            console.error(`HTTP ${err.status} while requesting ${request.urlWithParams}`, err);
            break;
          case 0:
            logOutAndReturnToLogin();
            message.error("Unable to connect to the server. Please try again.");
            console.error(`Network error while requesting ${request.urlWithParams}`, err);
            break;
        }
      }
      return throwError(() => err);
    })
  )
}

function getErrorMessage(error: HttpErrorResponse): string {
  const serverMessage = typeof error.error?.message === "string" ? error.error.message : null;

  if (serverMessage) {
    return serverMessage;
  }

  switch (error.status) {
    case HttpStatusCode.BadRequest:
      return "The request is invalid.";
    case HttpStatusCode.Forbidden:
      return "You do not have permission to perform this action.";
    case HttpStatusCode.NotFound:
      return "The requested resource was not found.";
    case HttpStatusCode.RequestTimeout:
      return "The request timed out. Please try again.";
    case HttpStatusCode.Conflict:
      return "The request could not be completed because of a conflict.";
    case HttpStatusCode.UnprocessableEntity:
      return "Some submitted information is invalid.";
    case HttpStatusCode.TooManyRequests:
      return "Too many requests. Please try again later.";
    case HttpStatusCode.InternalServerError:
    case HttpStatusCode.BadGateway:
    case HttpStatusCode.ServiceUnavailable:
    case HttpStatusCode.GatewayTimeout:
      return "The server could not complete the request. Please try again later.";
    default:
      return `Request failed with status ${error.status}.`;
  }
}


