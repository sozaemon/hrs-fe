import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, shareReplay, tap } from 'rxjs';
import { HttpResponseBody, ServerClient } from '@app/core/http/client';
import { AUTHENTICATION_KEY } from '@app/core/auth/types/authentication-key';


interface TokenResponse {
  token?: string;
  refreshToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  readonly isAuthenticated = signal(this.hasStoredSession());

  private readonly serverClient = inject(ServerClient);

  revokeAuthentication(): void {
    localStorage.setItem(AUTHENTICATION_KEY.STORAGE_IS_AUTHENTICATED, "false");
    this.isAuthenticated.set(false);
  }

  login(username: string, password: string): Observable<boolean> {

    let result: boolean = false;

    return this.serverClient.post<{ userName: string, password: string }, TokenResponse>("auth/login", {
      userName: username, password: password
    }).pipe(
      tap(e => {

        const token = e.data.token;
        if (token) {
          localStorage.setItem(AUTHENTICATION_KEY.STORAGE_IS_AUTHENTICATED, "true");
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

  logout(): Observable<HttpResponseBody<void>> {
    return this.serverClient.post<{}, void>("auth/logout").pipe(
      tap(e => {
        this.revokeAuthentication();
      })
    );
  }

  refreshToken(): Observable<HttpResponseBody<void>> {
    return this.serverClient.post<{}, void>("auth/refresh-token").pipe(shareReplay({ bufferSize: 1, refCount: false }))
  }

  private hasStoredSession(): boolean {
    return typeof localStorage !== 'undefined' && localStorage.getItem(AUTHENTICATION_KEY.STORAGE_IS_AUTHENTICATED) === 'true';
  }
}
