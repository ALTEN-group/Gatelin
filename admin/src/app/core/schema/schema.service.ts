import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { AdminEntity } from "@core/app-config/app.entities";
import { map, Observable } from "rxjs";

export interface SchemaRow {
  key: string;
  operations: ("INSERT" | "UPDATE" | "SELECT")[];
}

@Injectable({ providedIn: "root" })
export class SchemaService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(APP_CONFIG);

  public get(entityId: AdminEntity): Observable<SchemaRow[]> {
    const endpoint = `${this.appConfig.gatelinApi}${entityId}/schema`;
    return this.http
      .get<{ rows?: SchemaRow[] }>(endpoint)
      .pipe(map((res) => res.rows ?? []));
  }
}
