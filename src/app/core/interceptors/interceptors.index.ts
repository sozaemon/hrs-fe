import { HttpInterceptorFn } from "@angular/common/http";
import { AuthenticationInterceptor } from "@app/core/auth/interceptor/authentication.interceptor";
import { HttpErrorInterceptors } from "@app/core/http/http-error.interceptors";

export const interceptors: HttpInterceptorFn[] = [AuthenticationInterceptor, HttpErrorInterceptors];