import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { HttpResponseBody, ServerClient } from '@app/core/http/client';
import { AUTHENTICATION_KEY, PERMISSION_KEY } from '@app/core/auth/types/authentication-key';
import { LoginRequest, Permission, Role, TokenResponse } from '../types/auth.type';

@Injectable({ providedIn: 'root' })
export class AuthService {

  readonly isAuthenticated = signal(this.hasStoredSession());
  private readonly serverClient = inject(ServerClient);
  readonly isPerformingRefreshToken = signal<boolean>(false);

  revokeAuthentication(): void {
    localStorage.setItem(AUTHENTICATION_KEY.STORAGE_IS_AUTHENTICATED, "false");
    this.isAuthenticated.set(false);
  }

  login(request: LoginRequest): Observable<boolean> {

    return this.serverClient.post<LoginRequest, TokenResponse>("auth/login", request).pipe(
      tap(e => {
        const token = e.data.token;
        if (token) {
          localStorage.setItem(AUTHENTICATION_KEY.STORAGE_IS_AUTHENTICATED, "true");


          // testing permission with hard coded permission string
          // this permission should be fetch from background service 

          // localStorage.setItem(PERMISSION_KEY.STORAGE_USER_PERMISSION, "SR,AC1,AC2,AC3,SH1,SH2,SH3");

          this.isAuthenticated.set(true);
        } else {
          throw new Error("fail to fetch token")
        }
      }),
      map(m => true),
      catchError(e => {
        throw new Error(`login failed: ${e}`)
      })
    );
  }

  fetchPermission(): Observable<HttpResponseBody<Permission[]>> {
    return this.serverClient.get<Permission[]>("permission/list");
  }


  getRole(request: LoginRequest): Observable<HttpResponseBody<Role[]>> {
    return this.serverClient.post<LoginRequest, Role[]>("auth/user-roles", request);
  }

  logout(): Observable<HttpResponseBody<void>> {
    return this.serverClient.post<{}, void>("auth/logout").pipe(
      tap(e => {
        this.revokeAuthentication();
      })
    );
  }

  refreshToken(): Observable<HttpResponseBody<void>> {

    if (this.isPerformingRefreshToken()) {
      return of();
    }

    this.isPerformingRefreshToken.set(true);

    return this.serverClient.post<{}, void>("auth/refresh-token")
      .pipe(shareReplay({ bufferSize: 1, refCount: false }))
  }

  refreshTokenComplete(): void { this.isPerformingRefreshToken.set(false); }

  private hasStoredSession(): boolean {
    return typeof localStorage !== 'undefined' && localStorage.getItem(AUTHENTICATION_KEY.STORAGE_IS_AUTHENTICATED) === 'true';
  }

  getPermission(): string[] {

    if (typeof localStorage === "undefined") {
      return [];
    }

    const storagePermission: string | null = localStorage.getItem(PERMISSION_KEY.STORAGE_USER_PERMISSION);

    if (storagePermission != null) {
      return storagePermission.split(",");
    }
    return [];
  }
}
