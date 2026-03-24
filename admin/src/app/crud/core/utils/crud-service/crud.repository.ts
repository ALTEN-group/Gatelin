import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { HistorizedData } from "@crud/core/ui/history/history.model";
import {
  CrudRepositoryConfig,
  FileOperationConfig,
  Repository,
} from "@crud/core/utils/crud-service/crud.model";
import { Rows, RowsAndCount } from "@crud/core/utils/crud-service/dto.model";
import {
  NO_ROWS,
  NO_ROWS_AND_COUNT,
} from "@crud/core/utils/crud-service/no-rows";
import { isArray } from "@dwtechs/checkard";
import { TableLazyLoadEvent } from "primeng/table";
import { catchError, Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class CrudRepository<T> {
  private readonly http = inject(HttpClient);

  private readonly apiPrefix = inject(APP_CONFIG).apiPrefix;

  /* Initialized in with() */
  private apiUrl = "";
  private fileOperationsConfig: FileOperationConfig<T> = {};

  /** Configure the repository with an endpoint and return CRUD operations */
  public with(config: CrudRepositoryConfig): Repository<T> {
    const { endpoint, fileOperationsConfig } = config;
    this.apiUrl = `${this.apiPrefix}${endpoint}`;
    this.fileOperationsConfig = fileOperationsConfig ?? {};
    return this.operations();
  }

  private readonly operations: () => Repository<T> = () => ({
    get: (e) => this.get(e),
    getById: (id: number) => this.getById(id),
    getAll: () => this.get({}),
    create: (item: T) => this.create(item),
    update: (item: T) => this.update(item),
    archive: (ids: number[]) => this.archive(ids),
    restore: (ids: number[]) => this.restore(ids),
    history: (id: number) => this.history(id),
    updateFiles: (files: File[], id: number) => this.updateFiles(files, id),
  });

  /**
   * Search for entities in the database, and return the result as an
   * observable of RowsAndCount.
   *
   * @param e The TableLazyLoadEvent to send to the server. If null, returns
   *          NO_ROWS_AND_COUNT.
   * @returns An observable of RowsAndCount<T>
   */
  private get(e: TableLazyLoadEvent): Observable<RowsAndCount<T>> {
    if (!e) {
      return of(NO_ROWS_AND_COUNT);
    }
    return this.http
      .post<RowsAndCount<T>>(`${this.apiUrl}/search`, e)
      .pipe(catchError(() => of(NO_ROWS_AND_COUNT)));
  }

  /**
   * Retrieve a single entity by its ID.
   *
   * @param itemId The ID of the item to retrieve.
   * @returns An observable of RowsAndCount<T>, containing a single item.
   */
  private getById(itemId: number): Observable<RowsAndCount<T>> {
    const filter: TableLazyLoadEvent = {
      filters: {
        id: { value: itemId, matchMode: "equals" },
      },
    };
    return this.get(filter);
  }

  /**
   * Create a single entity in the database.
   *
   * @param item The entity to create.
   * @returns An observable of Rows<T>, containing a single item.
   */
  private create(item: T): Observable<Rows<T>> {
    const data = this.fileOperationsConfig?.serializer
      ? this.fileOperationsConfig.serializer(item)
      : { rows: [item] };
    return this.http.post<Rows<T>>(this.apiUrl, data);
  }

  /**
   * Update a single entity in the database.
   *
   * @param item The entity to update.
   * @returns An observable of Rows<T>, containing a single item.
   */
  private update(item: T): Observable<Rows<T>> {
    const data = this.fileOperationsConfig?.serializer
      ? this.fileOperationsConfig.serializer(item)
      : { rows: [item] };
    return this.http.put<Rows<T>>(this.apiUrl, data);
  }

  /**
   * Archive a list of items in the database.
   *
   * @param itemId The IDs of the items to archive.
   * @returns An observable of null.
   */
  private archive(itemIds: number[]): Observable<null> {
    return this.http.post<null>(`${this.apiUrl}/archive`, {
      rows: itemIds,
    });
  }

  private restore(ids: number[]): Observable<null> {
    return this.http.post<null>(`${this.apiUrl}/restore`, { rows: ids });
  }

  private history(id: number): Observable<RowsAndCount<HistorizedData<T>>> {
    return this.http.get<RowsAndCount<HistorizedData<T>>>(
      `${this.apiUrl}/${id}/history`,
    );
  }

  // TODO: test again when backend works again (events & user)
  // Or maybe move to documents service way? (all form values converted to form data)
  private updateFiles(
    media: File | File[],
    id: number,
    formDataKey = "pictures",
    suffix = "pictures",
  ): Observable<Rows<Pick<T, keyof T>>> {
    const formData = new FormData();
    const files = isArray(media) ? media : [media];
    for (const file of files) {
      formData.append(formDataKey, file);
    }
    return this.http
      .post<Rows<Pick<T, keyof T>>>(`${this.apiUrl}/${id}/${suffix}`, formData)
      .pipe(
        catchError(() => {
          return of(NO_ROWS);
        }),
      );
  }
}
