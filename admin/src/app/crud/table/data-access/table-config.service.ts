import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { Rows, RowsAndCount } from "@crud/core/utils/crud-service/dto.model";
import { TableConfig } from "@table/data-access/table-config.model";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class TableConfigService {
  private readonly api = `${inject(APP_CONFIG).apiPrefix}gateway/preferences`;
  private readonly http = inject(HttpClient);

  public getViews(componentId: string): Observable<TableConfig[]> {
    return this.http
      .get<RowsAndCount<TableConfig>>(`${this.api}/${componentId}`)
      .pipe(
        map((res) => res.rows),
        catchError(() => of([])),
      );
  }

  public updateMany(componentId: string, views: TableConfig[]) {
    return this.http.put<Rows<TableConfig>>(`${this.api}/${componentId}`, {
      rows: views,
    });
  }
}
