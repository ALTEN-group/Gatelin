import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import {
	FunctionalityAccessLevel,
	Role,
	RoleWithPermissions,
} from "@core/roles/role.class";
import { Functionality, Operation, RolesPayload } from "@core/roles/role.model";
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import { Rows, RowsAndCount } from "@crud/core/utils/crud-service/dto.model";
import { NO_ROWS_AND_COUNT } from "@crud/core/utils/crud-service/no-rows";
import { isNumber, isObject } from "@dwtechs/checkard";
import { FilterMetadata } from "primeng/api";
import { TableLazyLoadEvent } from "primeng/table";
import { catchError, map, Observable, of, tap } from "rxjs";

export type PermissionsConf = {
	functionalities: Functionality[];
	operations: Operation[];
};

type PermissionFilters = {
	value: { [functionalityKey: number]: number[] } | null;
};

interface GetManyDtoIn extends Omit<TableLazyLoadEvent, "filters"> {
	filters: {
		permissions: PermissionFilters;
	} & {
		[rolePropKey: string]: FilterMetadata;
	};
}

export const functionalityPrefix = "functionality_";

@Injectable({ providedIn: "root" })
export class RolesService {
	private readonly http = inject(HttpClient);
	private readonly snackbarService = inject(SnackbarService);

	private readonly apiPrefix = inject(APP_CONFIG).apiPrefix;
	private readonly endPoint: string = `${this.apiPrefix}users/roles/`;
	private readonly archiveSuffix: string = "archive";

	// Roles cache
	private _roles: Role[] | null = null;
	public get roles(): Role[] {
		return this._roles ?? [];
	}

	// Functionality keys cache
	private _functionalities: Functionality[] | null = null;
	public get functionalities(): Functionality[] {
		return this._functionalities ?? [];
	}

	// Operation keys cache
	private _operations: Operation[] | null = null;
	public get operations(): Operation[] {
		return this._operations ?? [];
	}

	private readonly httpSearch = (payload?: TableLazyLoadEvent) =>
		this.http.post<RowsAndCount<Role>>(`${this.endPoint}search`, payload);

	private storeRoles(roles: Role[]): void {
		this._roles = roles;
	}

	private storeConf(conf: PermissionsConf): void {
		this._functionalities = conf.functionalities;
		this._operations = conf.operations;
	}

	public resetRoles(): void {
		this._roles = null;
	}

	public getAll(): Observable<Role[]> {
		if (this._roles)
			return of(this._roles);
		return this.httpSearch().pipe(
			map((res: RolesPayload) => res.rows),
			tap((roles) => this.storeRoles(roles)),
			catchError(() => of([])),
		);
	}

	public getMany(payload: TableLazyLoadEvent): Observable<RowsAndCount<Role>> {
		const cleanPayload = this.getPayloadWithPermissions(payload);
		return this.httpSearch(cleanPayload).pipe(
			catchError(() => of(NO_ROWS_AND_COUNT)),
		);
	}

	public create(role: RoleWithPermissions): Observable<Rows<Role>> {
		return this.http
			.post<Rows<Role>>(this.endPoint, this.getFormattedRole(role))
			.pipe(tap(() => this.snackbarService.displaySuccess()));
	}

	public update(role: RoleWithPermissions): Observable<Rows<Role>> {
		const updatedRole = this.getFormattedRole(role);
		return this.http
			.put<Rows<Role>>(this.endPoint + role.id, updatedRole)
			.pipe(tap(() => this.snackbarService.displaySuccess()));
	}

	public delete(ids: number[]): Observable<null> {
		const payload: Rows<number> = { rows: ids };
		return this.http
			.patch<null>(this.endPoint + this.archiveSuffix, payload)
			.pipe(tap(() => this.snackbarService.displaySuccess()));
	}

	private getPermissionsConf(): Observable<PermissionsConf> {
		if (this._functionalities && this._operations) {
			return of({
				functionalities: this._functionalities,
				operations: this._operations,
			});
		}
		return this.http.get<Rows<PermissionsConf>>(`${this.endPoint}conf`).pipe(
			map((res) => res.rows[0]),
			tap((conf) => this.storeConf(conf)),
		);
	}

	private getPayloadWithPermissions(payload: TableLazyLoadEvent): GetManyDtoIn {
		const cleanPayload: GetManyDtoIn = JSON.parse(JSON.stringify(payload));
		if (cleanPayload.filters) {
			const permissions: PermissionFilters = {
				value: {},
			};
			for (const filterKey in cleanPayload.filters) {
				if (!isNumber(filterKey, false)) continue;

				const filterValue = cleanPayload.filters[filterKey];
				if (!filterValue?.value) {
					delete cleanPayload.filters[filterKey];
					continue;
				}
				// TODO: test
				(permissions.value as { [key: number]: number[] })[
					filterKey as unknown as number
				] = filterValue.value;
				delete cleanPayload.filters[filterKey];
			}

			if (!isObject(permissions.value, true)) permissions.value = null;

			cleanPayload.filters.permissions = permissions;
		}

		return cleanPayload;
	}

	private getFormattedRole(
		role: RoleWithPermissions,
	): Pick<Role, "name" | "description" | "level" | "color" | "permissions"> {
		const permissions: FunctionalityAccessLevel = {};
		for (const key in role) {
			const isFunctionalityKey = key.startsWith(functionalityPrefix);
			if (!isFunctionalityKey) continue;

			const functionalityKey = key.replace(functionalityPrefix, "");
			if (!isNumber(functionalityKey, false)) continue;

			permissions[+functionalityKey] = role[key];
			delete role[key];
		}
		return {
			name: role.name,
			description: role.description,
			level: role.level,
			color: role.color,
			permissions,
		};
	}
}
