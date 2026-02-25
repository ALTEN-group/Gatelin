import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { LoginResponse } from "@core/auth/auth.dto";
import { TokenService } from "@core/auth/token.service";
import { User } from "@core/user/user.class";
import { Observable, of, pipe } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tokenService = inject(TokenService);
  private readonly aclService = inject(AclService);

  private readonly apiPrefix = inject(APP_CONFIG).apiPrefix;

  private readonly sessionApi: string = `${this.apiPrefix}gateway/sessions`;
  private readonly meApi: string = `${this.apiPrefix}users/users/me`;

  private readonly _isAuthenticated = signal(false);
  public readonly isAuthenticated = this._isAuthenticated.asReadonly();

  private readonly _user = signal<User | undefined>(undefined);
  public readonly user = this._user.asReadonly();

  public login(email: string, pwd: string): Observable<boolean> {
    if (!email || !pwd) return of(false);
    const payload = { email, pwd };
    return this.http.post<LoginResponse>(this.sessionApi, payload).pipe(
      tap((res) => {
        const { accessToken, refreshToken } = res;
        this.saveTokens(accessToken, refreshToken);
        this.authenticate();
      }),
      this.getUserBasics(),
      catchError(() => of(false)),
    );
  }

  public logout(): Observable<void> {
    return this.http.delete<void>(this.sessionApi, {}).pipe(
      tap(() => {
        this.tokenService.deleteAccessToken();
        this.tokenService.deleteRefreshToken();
        this.resetCurrentUser();
        this.redirectToLogin();
      }),
      catchError(() => of()),
    );
  }

  public refreshToken(): Observable<boolean> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (refreshToken)
      return this.http
        .put<{ accessToken: string; refreshToken: string }>(this.sessionApi, {
          refreshToken,
        })
        .pipe(
          tap((res) => {
            const { accessToken, refreshToken } = res ?? {};
            if (!accessToken || !refreshToken) return;
            this.saveTokens(accessToken, refreshToken);
            this.authenticate();
          }),
          map((res) => !!res),
          catchError(() => {
            return of(false);
          }),
        );

    return of(false);
  }

  public updateUser( nickname: string, firstName: string, lastName: string ): void {
    this._user.update(
      (u) => ({ ...u, nickname, firstName, lastName }) as User,
    );
  }

  // Get user basics info
  public getUserBasics() {
    return pipe(switchMap(() => this.getAccount()));
  }

  public getAccount(): Observable<User | null> {
    return this.http.get<User>(this.meApi).pipe(
      tap((res) => {
        const { nickname, firstName, lastName, permissions } = res;
        this.updateUser(nickname, firstName, lastName);
        // Store ACLs directly from user's permissions
        if (permissions)
          this.aclService.storeAccessLevels(permissions);
      }),
      catchError(() => of(null)),
    );
  }

  public redirectToLogin(): void {
    this.router.navigate(["/login"], {
      queryParams: { returnUrl: this.router.url },
    });
  }

  public redirectToApp(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
    if (returnUrl)
      this.router.navigate([returnUrl]);
    else
      this.router.navigate(["/"]);
  }

  private resetCurrentUser(): void {
    this._isAuthenticated.set(false);
    this._user.set(undefined);
    this.aclService.resetAccessLevels();
  }

  private saveTokens(accessToken: string, refreshToken: string) {
    this.tokenService.saveAccessToken(accessToken);
    this.tokenService.saveRefreshToken(refreshToken);
  }

  private authenticate() {
    this._isAuthenticated.set(true);
  }
}
