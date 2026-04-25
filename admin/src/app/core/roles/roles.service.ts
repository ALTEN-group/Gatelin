import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { Role } from "@core/roles/role.class";
import { RolesPayload } from "@core/roles/role.model";
import { RowsAndCount } from "@dwtechs/crud-builder";
import { TableLazyLoadEvent } from "primeng/table";
import { catchError, map, Observable, of, tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class RolesService {
  private readonly http = inject(HttpClient);

  private readonly apiPrefix = inject(APP_CONFIG).apiGateway;
  private readonly endPoint: string = `${this.apiPrefix}roles/`;

  // Roles cache
  private _roles: Role[] | null = null;
  public get roles(): Role[] {
    return this._roles ?? [];
  }

  private readonly httpSearch = (payload?: TableLazyLoadEvent) =>
    this.http.post<RowsAndCount<Role>>(`${this.endPoint}search`, payload ?? {});

  private storeRoles(roles: Role[]): void {
    this._roles = roles;
  }

  public resetRoles(): void {
    this._roles = null;
  }

  public getAll(): Observable<Role[]> {
    if (this._roles) return of(this._roles);
    return this.httpSearch().pipe(
      map((res: RolesPayload) => res.rows),
      tap((roles) => this.storeRoles(roles)),
      catchError(() => of([])),
    );
  }
}
