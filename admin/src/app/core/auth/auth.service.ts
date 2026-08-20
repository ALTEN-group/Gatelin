import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AclService } from "@core/acl/acl.service";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import {
  ChallengeRequiredResponse,
  SessionResponse,
} from "@core/auth/auth.dto";
import { TokenService } from "@core/auth/token.service";
import { User } from "@core/user/user.class";
import { Observable, of, pipe } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";

/**
 * Mid-login challenge ticket handed back by the password service (`?ticket=…`).
 * Read from the raw URL so it is available before the router has run.
 */
export function readLoginTicket(): string | null {
  return new URLSearchParams(window.location.search).get("ticket");
}

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tokenService = inject(TokenService);
  private readonly aclService = inject(AclService);

  private readonly apiPrefix = inject(APP_CONFIG).gatelinApi;
  private readonly apiUsers = inject(APP_CONFIG).apiUsers;

  private readonly sessionApi: string = `${this.apiPrefix}sessions`;
  private readonly meApi: string = `${this.apiUsers}users/me`;

  private readonly _isAuthenticated = signal(false);
  public readonly isAuthenticated = this._isAuthenticated.asReadonly();

  private readonly _user = signal<User | undefined>(undefined);
  public readonly user = this._user.asReadonly();

  public login(email: string, pwd: string): Observable<boolean> {
    if (!email || !pwd) return of(false);
    const payload = { email, pwd };
    return this.http
      .post<SessionResponse | ChallengeRequiredResponse>(
        this.sessionApi,
        payload,
      )
      .pipe(
        switchMap((res) => {
          // 202: the password was right but a mid-login challenge (2FA, expired
          // password, …) has to be solved on the pwd service first.
          if (res && "challengeRequired" in res && res.url) {
            window.location.assign(res.url);
            return of(true);
          }
          return of(res as SessionResponse).pipe(
            tap((session) => {
              const { accessToken, permissions } = session;
              this.saveTokens(accessToken);
              this.authenticate();
              this.aclService.storeAccessLevels(permissions);
            }),
            this.getUserBasics(),
            tap(() => this.redirectToApp()),
            map(() => true),
          );
        }),
        catchError(() => of(false)),
      );
  }

  /** Finish a login that went through a mid-login challenge (ticket from ?ticket=). */
  public resumeLogin(ticket: string): Observable<boolean> {
    if (!ticket) return of(false);
    return this.http
      .post<SessionResponse>(`${this.sessionApi}/resume`, { ticket })
      .pipe(
        tap((res) => {
          const { accessToken, permissions } = res;
          this.saveTokens(accessToken);
          this.authenticate();
          this.aclService.storeAccessLevels(permissions);
        }),
        this.getUserBasics(),
        tap(() => this.redirectToApp()),
        map(() => true),
        catchError(() => of(false)),
      );
  }

  public logout(): Observable<void> {
    return this.http.delete<void>(this.sessionApi, {}).pipe(
      tap(() => {
        this.tokenService.deleteAccessToken();
        this.resetCurrentUser();
        this.redirectToLogin();
      }),
      catchError(() => of()),
    );
  }

  public refreshToken(): Observable<boolean> {
    // The refresh token itself is carried by an httpOnly cookie the browser
    // sends automatically; only gate on a previously stored access token to
    // avoid firing a doomed request when no session ever existed.
    if (this.tokenService.getAccessToken())
      return this.http.put<SessionResponse>(this.sessionApi, {}).pipe(
        tap((res) => {
          const { accessToken, permissions } = res ?? {};
          if (!accessToken) return;
          this.saveTokens(accessToken);
          this.authenticate();
          this.aclService.resetAccessLevels();
          if (permissions) this.aclService.storeAccessLevels(permissions);
        }),
        map((res) => !!res),
        catchError(() => {
          return of(false);
        }),
      );

    return of(false);
  }

  // Get user basics info
  public getUserBasics() {
    return pipe(switchMap(() => this.getAccount()));
  }

  public getAccount(): Observable<User | null> {
    return this.http.get<User>(this.meApi).pipe(
      tap((user) => {
        this.updateUser(user);
      }),
      map(() => this._user() ?? null),
      catchError(() => {
        return of(null);
      }),
    );
  }

  public redirectToLogin(): void {
    // Keep a pending challenge ticket in the URL, otherwise a failed refresh
    // would drop it before the login page gets a chance to redeem it.
    const ticket = readLoginTicket();
    this.router.navigate(["/login"], {
      queryParams: ticket ? { ticket } : { returnUrl: this.router.url },
    });
  }

  public redirectToApp(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
    if (returnUrl) this.router.navigate([returnUrl]);
    else this.router.navigate(["/"]);
  }

  private resetCurrentUser(): void {
    this._isAuthenticated.set(false);
    this._user.set(undefined);
    this.aclService.resetAccessLevels();
  }

  private saveTokens(accessToken: string) {
    this.tokenService.saveAccessToken(accessToken);
  }

  private authenticate() {
    this._isAuthenticated.set(true);
  }

  private updateUser(user: User): void {
    this._user.update((u) => ({ ...u, ...user }));
  }
}
