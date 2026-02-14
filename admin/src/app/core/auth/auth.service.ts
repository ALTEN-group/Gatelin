import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AccessLevelsService } from "@core/access/access-levels.service";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { LoginResponse } from "@core/auth/auth.dto";
import { TokenService } from "@core/auth/token.service";
import { RolesService } from "@core/roles/roles.service";
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
	private readonly rolesService = inject(RolesService);
	private readonly accessLevelsService = inject(AccessLevelsService);

	private readonly apiPrefix = inject(APP_CONFIG).apiPrefix;

	private readonly consumerApi: string = `${this.apiPrefix}gatelin/consumers/`;
	private readonly meApi: string = `${this.apiPrefix}users/me/`;

	private readonly _isAuthenticated = signal(false);
	public readonly isAuthenticated = this._isAuthenticated.asReadonly();

	private readonly _user = signal<User | undefined>(undefined);
	public readonly user = this._user.asReadonly();

	public login(email: string, pwd: string): Observable<boolean> {
		if (!email || !pwd) return of(false);
		const payload = { email, pwd };
		return this.http.post<LoginResponse>(this.consumerApi, payload).pipe(
			tap((res) => {
				const { accessToken, refreshToken } = res;
				this.saveTokens(accessToken, refreshToken);
				this.authenticate();
			}),
      switchMap(() => this.getAccount()),
			this.storeAccessLevels(),
			catchError(() => of(false)),
		);
	}

  public getAccount(): Observable<User | null> {
		return this.http.get<User>(this.meApi).pipe(
			tap((res) => {
        const { nickname, firstName, lastName, rolesArrayAgg } = res;
				this.updateUser(nickname, firstName, lastName, rolesArrayAgg);
			}),
			catchError(() => of(null)),
		);
	}

	public logout(): Observable<string> {
		return this.http.delete(this.consumerApi, { responseType: "text" }).pipe(
			tap(() => {
				this.tokenService.deleteAccessToken();
				this.tokenService.deleteRefreshToken();
				this.resetCurrentUser();
				this.rolesService.resetRoles();
				this.redirectToLogin();
			}),
			catchError(() => of("")),
		);
	}

	public refreshToken(): Observable<boolean> {
		const accessToken = this.tokenService.getAccessToken();
		const refreshToken = this.tokenService.getRefreshToken();
		if (accessToken && refreshToken) {
			return this.http
				.put<{ accessToken: string; refreshToken: string }>(this.consumerApi, {
					accessToken,
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
		}
		return of(false);
	}

	public updateUser(nickname: string, firstName: string, lastName: string, rolesArrayAgg: number[]): void {
		this._user.update((user) => ({ ...user, nickname, firstName, lastName, rolesArrayAgg }) as User);
	}

	public storeAccessLevels() {
		return pipe(
			switchMap(() => this.rolesService.getAll()),
			tap(() => {
				this.accessLevelsService.storeAccessLevels(
					this.rolesService.roles,
					this.user()?.rolesArrayAgg || [],
					this.rolesService.functionalities,
				);
			}),
			map(() => true),
		);
	}

	public redirectToLogin(): void {
		this.router.navigate(["/login"], {
			queryParams: { returnUrl: this.router.url },
		});
	}

	public redirectToApp(): void {
		const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
		if (returnUrl) {
			this.router.navigate([returnUrl]);
		} else {
			this.router.navigate(["/"]);
		}
	}

	private resetCurrentUser(): void {
		this._isAuthenticated.set(false);
		this._user.set(undefined);
		this.accessLevelsService.resetAccessLevels();
	}

	private saveTokens(accessToken: string, refreshToken: string) {
		// if (accessToken && refreshToken) {
		this.tokenService.saveAccessToken(accessToken);
		this.tokenService.saveRefreshToken(refreshToken);
		// }
	}

	private authenticate() {
		this._isAuthenticated.set(true);
	}
}
