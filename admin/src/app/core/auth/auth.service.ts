import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AccessLevelsService } from "@core/access/access-levels.service";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { LoginResponse } from "@core/auth/auth.dto";
import { TokenService } from "@core/auth/token.service";
import { RolesService } from "@core/roles/roles.service";
import { User } from "@core/user/user.class";
import { Rows } from "@crud/core/utils/crud-service/dto.model";
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

	private readonly consumerApi: string = `${this.apiPrefix}/gatelin/consumers/`;
	private readonly accountApi: string = `${this.apiPrefix}account/`;

	private readonly _isAuthenticated = signal(false);
	public readonly isAuthenticated = this._isAuthenticated.asReadonly();

	private readonly _currentUser = signal<User | undefined>(undefined);
	public readonly currentUser = this._currentUser.asReadonly();

	public login(email: string, pwd: string): Observable<boolean> {
		if (!email || !pwd) return of(false);
		const payload = { email, pwd };
		return this.http.post<Rows<LoginResponse>>(this.consumerApi, payload).pipe(
			map((res) => res.rows[0]),
			tap((res) => {
				if (res) {
					const { accessToken, refreshToken } = res;
					this.saveTokens(accessToken, refreshToken);
				}
			}),
			switchMap(() => this.getAccount()),
			this.storeAccessLevels(),
			map((res) => !!res),
			tap(() => {
				this.authenticate();
			}),
			catchError(() => of(false)),
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

	public getAccount(): Observable<User | null> {
		const token = this.tokenService.getAccessToken();
		if (!token) {
			return of(null);
		}
		return this.http.get<Rows<User>>(this.accountApi).pipe(
			map((res) => res.rows[0]),
			tap((res) => {
				if (res) {
					this.updateCurrentUser(res);
				}
			}),
			catchError(() => of(null)),
		);
	}

	public refreshToken(): Observable<boolean> {
		const accessToken = this.tokenService.getAccessToken();
		const refreshToken = this.tokenService.getRefreshToken();
		if (accessToken && refreshToken) {
			return this.http
				.patch<Rows<{ accessToken: string; refreshToken: string }>>(
					this.consumerApi,
					{ accessToken, refreshToken },
				)
				.pipe(
					tap((res) => {
						const { accessToken, refreshToken } = res.rows[0] ?? {};
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

	public updateCurrentUser(user: Partial<User>): void {
		this._currentUser.update(
			(currentUser) => ({ ...currentUser, ...user }) as User,
		);
	}

	public storeAccessLevels() {
		return pipe(
			switchMap(() => this.rolesService.getAll()),
			tap(() => {
				const payload = {
					roles: this.rolesService.roles,
					userRoleIds: this.currentUser()?.rolesArrayAgg || [],
					functionalities: this.rolesService.functionalities,
				};
				this.accessLevelsService.storeAccessLevels(payload);
			}),
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
		this._currentUser.set(undefined);
		this.accessLevelsService.resetAccessLevels();
	}

	private saveTokens(accessToken: string, refreshToken: string) {
		if (accessToken && refreshToken) {
			this.tokenService.saveAccessToken(accessToken);
			this.tokenService.saveRefreshToken(refreshToken);
		}
	}

	private authenticate() {
		this._isAuthenticated.set(true);
	}
}
